import admin from "firebase-admin";
import {DynamoDBClient} from "@aws-sdk/client-dynamodb";
import {DynamoDBDocumentClient, PutCommand, DeleteCommand} from "@aws-sdk/lib-dynamodb";

// 환경변수 세팅 (Lambda 환경변수로 설정해야 함)
const serviceAccount = JSON.parse(Buffer.from(process.env.FIREBASE_CREDENTIALS_BASE64, "base64").toString("utf-8"));

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const ddbClient = new DynamoDBClient({region: process.env.AWS_REGION});
const dynamoDB = DynamoDBDocumentClient.from(ddbClient);
const TABLE_NAME = "FcmToken";
const messaging = admin.messaging();

export const handler = async (event) => {
  let parsedEvent;
  try {
    parsedEvent = typeof event.body === "string" ? JSON.parse(event.body) : event;
  } catch (parseError) {
    console.error("Failed to parse event body:", parseError);
    return {
      statusCode: 400,
      body: JSON.stringify({message: "Invalid event body format"}),
    };
  }

  const token = parsedEvent.token;
  const topic = parsedEvent.topic;

  if (!token || !topic) {
    return {
      statusCode: 400,
      body: JSON.stringify({message: "token과 topic은 필수입니다."}),
    };
  }

  const now = new Date();
  const timestamp = Math.floor(now.getTime() / 1000);
  const expireAt = timestamp + 60;

  try {
    // 유효성 검사용 dummy 메시지
    try {
      await messaging.send({
        token,
        data: {
          type: "validate",
        },
      });
    } catch (error) {
      const code = error.errorInfo?.code;
      if (code === "messaging/registration-token-not-registered" || code === "messaging/invalid-argument") {
        await dynamoDB.send(new DeleteCommand({TableName: TABLE_NAME, Key: {token}}));
        return {
          statusCode: 400,
          body: JSON.stringify({message: "유효하지 않은 FCM 토큰입니다."}),
        };
      } else {
        return {
          statusCode: 500,
          body: JSON.stringify({message: "FCM 전송 오류", error: error.message}),
        };
      }
    }

    let fcmSubStatus = "FAILED";
    try {
      await admin.messaging().subscribeToTopic(token, topic);
      fcmSubStatus = "SUBSCRIBED";
    } catch (e) {
      console.error("FCM 구독 실패:", e.message);
    }

    await dynamoDB.send(
      new PutCommand({
        TableName: TABLE_NAME,
        Item: {
          token,
          createdAt: timestamp,
          expireAt,
          topics: [topic],
          fcmSubStatus,
          lastSubscriptionAttemptAt: timestamp,
        },
      })
    );

    return {
      statusCode: fcmSubStatus === "SUBSCRIBED" ? 200 : 202,
      body: JSON.stringify({
        message: fcmSubStatus === "SUBSCRIBED" ? "구독 성공 및 토큰 저장 완료" : "토큰 저장 완료, FCM 구독 실패",
        status: fcmSubStatus,
      }),
    };
  } catch (error) {
    console.error("Lambda 오류:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({message: "서버 내부 오류", error: error.message}),
    };
  }
};
