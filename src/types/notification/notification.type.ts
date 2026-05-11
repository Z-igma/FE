// 알림 구독 키 조회
export interface GetVapidPublicKeyResponse {
  publicKey: string;
};

// 알림 구독
export interface PostPushSubscriptionRequest {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
};
