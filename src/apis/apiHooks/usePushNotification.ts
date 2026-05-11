import { getVapidPublicKey, postPushSubscription } from "@/apis/notification/notification";

export const usePushNotification = () => {
  const subscribePushNotification = async () => {
    try {
      const vapidPublicKeyResponse = await getVapidPublicKey();
      const vapidPublicKey = vapidPublicKeyResponse.data.publicKey;

      const registration = await navigator.serviceWorker.ready; // 서비스 워커 가져오기(대기)
      const subscription = await registration.pushManager.subscribe({ // 푸시 구독 요청
        userVisibleOnly: true,
        applicationServerKey: vapidPublicKey,
      });

      await postPushSubscription({
        endpoint: subscription.endpoint,
        keys: {
          p256dh: btoa(String.fromCharCode(...new Uint8Array(subscription.getKey('p256dh')!))),
          auth: btoa(String.fromCharCode(...new Uint8Array(subscription.getKey('auth')!))),
        }
      });
    } catch (error) {
      console.error('푸시 구독 실패: ', error);
    }
  };

  return {subscribePushNotification};
};
