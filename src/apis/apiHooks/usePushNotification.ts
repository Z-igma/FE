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
    console.log('1. 구독 시작');
    try {
      // 알림 권한 요청
      const permission = await Notification.requestPermission();
      console.log('2. 권한:', permission);
      
      if (permission !== 'granted') {
        alert('알림 권한을 허용해야 알림을 받을 수 있어요!');
        return;
      }

      const vapidPublicKeyResponse = await getVapidPublicKey();
      console.log('3. VAPID 키:', vapidPublicKeyResponse);
      const vapidPublicKey = vapidPublicKeyResponse.data.publicKey;
      const convertedKey = urlBase64ToUint8Array(vapidPublicKey);

      const registration = await navigator.serviceWorker.ready; // 서비스 워커 가져오기(대기)
      console.log('4. Service Worker:', registration);
      const subscription = await registration.pushManager.subscribe({ // 푸시 구독 요청
        userVisibleOnly: true,
        applicationServerKey: convertedKey,
      });
      console.log('5. 구독 정보:', subscription);

      await postPushSubscription({
        endpoint: subscription.endpoint,
        keys: {
          p256dh: btoa(String.fromCharCode(...new Uint8Array(subscription.getKey('p256dh')!))),
          auth: btoa(String.fromCharCode(...new Uint8Array(subscription.getKey('auth')!))),
        }
      });
      console.log('6. 구독 완료!');
    } catch (error) {
      console.error('푸시 구독 실패: ', error);
    }
  };

  return {subscribePushNotification};
};
