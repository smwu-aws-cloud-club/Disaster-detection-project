// web test
// 구독 요청 처리 + 알림 전송

import express from "express";
import dotenv from "dotenv";
import admin from "firebase-admin";
import cors from "cors";

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

// 구독 요청 처리
app.post("/topic-all", async (req, res) => {
  const {token} = req.body;

  try {
    // FCM 토큰을 'all' 토픽에 구독
    await admin.messaging().subscribeToTopic(token, "all");
    res.status(200).send({message: "구독 성공"});
  } catch (error) {
    console.error("토픽 구독 실패:", error);
    res.status(500).send({message: "구독 실패", error: error.message});
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
