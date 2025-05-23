import admin from "firebase-admin";
import dotenv from "dotenv";

dotenv.config();

const serviceAccount = JSON.parse(Buffer.from(process.env.FIREBASE_CREDENTIALS_BASE64, "base64").toString("utf-8"));

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export const handler = async (event) => {
  // 1. FCM 발송
  const region = event.region || "미지정";
  const payload = {
    topic: "all", // 프론트에서 token 등록 및 구독 요청 + 백에서 처리 필요
    notification: {
      title: "재난 발생",
      body: `${region}에서 재난이 발생했습니다.`,
    },
    webpush: {
      notification: {
        title: "재난 발생",
        body: `${region}에서 재난이 발생했습니다.`,
        // requireInteraction: true,
      },
    },
  };

  try {
    await admin.messaging().send(payload);
    return {
      statusCode: 200,
      body: JSON.stringify({message: "FCM 전송 완료"}),
    };
  } catch (error) {
    console.error("❌ 알림 전송 실패:", error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({message: "알림 전송 실패", error: error.message}),
    };
  }
};
