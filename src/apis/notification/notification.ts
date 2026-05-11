import { instance } from '@/apis/instance';
import type { ApiEnvelope } from '@/types/api.type';
import type { GetVapidPublicKeyResponse, PostPushSubscriptionRequest } from '@/types/notification/notification.type';

// 알림 구독 키 조회
export const getVapidPublicKey = async (): Promise<ApiEnvelope<GetVapidPublicKeyResponse>> => {
  const response = await instance.get('/notifications/web-push/public-key');
  return response.data;
};

// 알림 구독
export const postPushSubscription = async (body: PostPushSubscriptionRequest): Promise<ApiEnvelope<null>> => {
  const response = await instance.post('/notifications/web-push/subscriptions', body);
  return response.data;
};
