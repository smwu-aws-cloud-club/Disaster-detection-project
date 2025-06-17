// web test
// 구독 요청 처리 + 알림 전송

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import admin from "firebase-admin";
import {getMessaging} from "firebase-admin/messaging";

import {DynamoDBClient} from "@aws-sdk/client-dynamodb";
import {DynamoDBDocumentClient, PutCommand, DeleteCommand} from "@aws-sdk/lib-dynamodb";

dotenv.config();

const app = express();
app.use(cors()); // 모든 도메인에서의 요청을 허용
app.use(express.json());
app.use(express.urlencoded());

const serviceAccount = JSON.parse(Buffer.from(process.env.FIREBASE_CREDENTIALS_BASE64, "base64").toString("utf-8"));

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const ddbClient = new DynamoDBClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});
const dynamoDB = DynamoDBDocumentClient.from(ddbClient);
const TABLE_NAME = "FcmTokens";
const messaging = getMessaging();

app.post("/topic-all", async (req, res) => {
  const {token, topic} = req.body;

  if (!token) {
    return res.status(400).send({message: "토큰이 필요합니다."});
  }

  const now = new Date();
  const timestamp = Math.floor(now.getTime() / 1000);
  // const expireAt = timestamp + 60 * 60 * 24 * 90;
  const expireAt = timestamp + 60;

  try {
    // FCM 유효성 검사를 위해 dummy 메시지 전송
    try {
      await messaging.send({
        token,
        data: {
          type: "validate",
        },
      });
    } catch (error) {
      // 유효하지 않은 토큰이면 삭제 후 종료
      const code = error.errorInfo?.code;
      if (code === "messaging/registration-token-not-registered" || code === "messaging/invalid-argument") {
        await dynamoDB.send(
          new DeleteCommand({
            TableName: TABLE_NAME,
            Key: {token},
          })
        );
        return res.status(400).send({message: "유효하지 않은 FCM 토큰입니다."});
      } else {
        console.warn("FCM 검증 메시지 전송 실패 (기타 오류):", error.message);
        return res.status(500).send({message: "FCM 토큰 검증 중 오류 발생", error: error.message});
      }
    }

    let fcmSubStatus = "SUBSCRIBED_FAILURE";
    let subscribedTopics = []; // 실제 구독 성공한 토픽 목록

    // 'all' 토픽에 구독
    try {
      await admin.messaging().subscribeToTopic(token, topic);
      fcmSubStatus = "SUBSCRIBED";
      subscribedTopics = [topic];
      console.log(`Token ${token} successfully subscribed to topic ${topic}`);
    } catch (subscribeError) {
      console.error(`Failed to subscribe token ${token} to topic ${topic}:`, subscribeError.message);
      fcmSubStatus = "FAILED";
    }

    await dynamoDB.send(
      new PutCommand({
        TableName: TABLE_NAME,
        Item: {
          token,
          createdAt: timestamp,
          expireAt,
          topics: [topic],
          fcmSubStatus, // 구독 시도 결과 상태
          lastSubscriptionAttemptAt: timestamp, // 마지막 구독 시도 시간
        },
      })
    );

    if (fcmSubStatus === "SUBSCRIBED") {
      return res.status(200).send({message: "구독 성공 및 토큰 저장 완료"});
    } else {
      // FCM 구독은 실패했지만, 토큰 정보는 DB에 저장됨
      return res.status(202).send({message: "토큰 저장 완료, FCM 구독 실패 (재시도 필요)", status: fcmSubStatus});
    }
  } catch (error) {
    console.error("처리 실패:", error);
    return res.status(500).send({
      message: "서버 내부 오류 발생",
      error: error.message,
    });
  }
});

// 알림 전송
app.get("/fcm", async (req, res) => {
  try {
    // 1. FCM 발송
    const region = "미지정";

    // 이를 위해 프론트에서 token 등록 및 구독 요청 + 백에서 처리 필요
    await admin.messaging().send({
      topic: "all",
      notification: {
        title: "재난 발생",
        body: `${region}에서 재난이 발생했습니다.`,
      },
      webpush: {
        notification: {
          body: `${region}에서 재난이 발생했습니다.`,
          requireInteraction: true,
          badge: "/example.png",
          click_action: "https://naver.com",
        },
        fcm_options: {
          link: "https://naver.com",
        },
      },
    });

    return res.status(200).json("알림 전송 완료");
    // 2. SNS 발송
  } catch (error) {
    console.error("알림 전송 실패:", error);
    return res.status(500).json("알림 전송 실패");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
