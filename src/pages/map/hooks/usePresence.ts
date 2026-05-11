import { Client } from '@stomp/stompjs';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import type { PresenceMember } from '@/types/map/presence';

export const usePresence = (promiseId?: string) => {
  const [members, setMembers] = useState<PresenceMember[]>([]);
  const { accessToken } = useAuthStore();

  useEffect(() => {
    if (!promiseId || !accessToken) return;

    const client = new Client({
      brokerURL: `${import.meta.env.VITE_WS_URL}/ws`,
      connectHeaders: {
        Authorization: `Bearer ${accessToken}`,
      },
      onConnect: () => {
        // 접속자 목록 구독
        client.subscribe(
          `/topic/promises/${promiseId}/presence`,
          message => {
            const data: PresenceMember[] = JSON.parse(message.body);
            setMembers(data);
          }
        );

        // 입장 전송
        client.publish({
          destination: `/app/promises/${promiseId}/presence/join`,
        });
      },
    });

    client.activate();

    return () => {
      if (client.connected) {
        client.publish({
          destination: `/app/promises/${promiseId}/presence/leave`,
        });
      }
      client.deactivate();
    };
  }, [promiseId, accessToken]);

  return { members };
};
