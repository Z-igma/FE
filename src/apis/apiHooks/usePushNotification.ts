import { getVapidPublicKey, postPushSubscription } from "@/apis/notification/notification";

const urlBase64ToUint8Array = (base64String: string) => {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');
  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map(char => char.charCodeAt(0)));
};

export const usePushNotification = () => {
  const subscribePushNotification = async () => {
    try {
      // 알림 권한 요청
      const permission = await Notification.requestPermission();
      
      if (permission !== 'granted') {
        alert('알림 권한을 허용해야 알림을 받을 수 있어요!');
        return;
      }

      const vapidPublicKeyResponse = await getVapidPublicKey();
      const vapidPublicKey = vapidPublicKeyResponse.data.publicKey;
      const convertedKey = urlBase64ToUint8Array(vapidPublicKey);

      const registration = await navigator.serviceWorker.ready; // 서비스 워커 가져오기(대기)
      const subscription = await registration.pushManager.subscribe({ // 푸시 구독 요청
        userVisibleOnly: true,
        applicationServerKey: convertedKey,
      });

      const subscriptionJson = subscription.toJSON();

      await postPushSubscription({
        endpoint: subscriptionJson.endpoint!,
        keys: {
          p256dh: subscriptionJson.keys!.p256dh,
          auth: subscriptionJson.keys!.auth,
        }
      });
    } catch (error) {
      console.error('푸시 구독 실패: ', error);
    }
  };

  return {subscribePushNotification};
};
