const firebase = require("./firebase/index");

async function sendPushNotification(token) {
  const message = {
    token,
    notification: {
      title: "Hello 👋",
      body: "FCM iOS notification working 🎉",
    },
    apns: {
      payload: {
        aps: {
          sound: "default",
        },
      },
    },
  };

  try {
    const response = await firebase.messaging().send(message);
    console.log("Notification sent:", response);
  } catch (error) {
    console.error("Push error:", error);
  }
}

module.exports = sendPushNotification;
