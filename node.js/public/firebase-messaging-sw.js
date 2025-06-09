importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyCnIqHUpsH9MN6cBvrXmUz37cInpSc6mKU",
  authDomain: "disaster-detection-project.firebaseapp.com",
  projectId: "disaster-detection-project",
  storageBucket: "disaster-detection-project.firebasestorage.app",
  messagingSenderId: "444335381733",
  appId: "1:444335381733:web:1e7054695e62b0a541080c",
  measurementId: "G-DTCW9W6F4R",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log("[firebase-messaging-sw.js] Received background message ", payload);
  // Customize notification here
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.icon || "/firebase-logo.png", // 기본 아이콘 설정
    data: payload.data, // 추가 데이터를 data 속성에 저장
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener("notificationclick", function (event) {
  console.log("[Service Worker] Notification click Received.");

  event.notification.close();

  const targetUrl = event.notification?.data?.link || "https://your-default-page.com";

  event.waitUntil(
    clients.matchAll({type: "window", includeUncontrolled: true}).then(function (clientList) {
      for (const client of clientList) {
        if (client.url === targetUrl && "focus" in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
