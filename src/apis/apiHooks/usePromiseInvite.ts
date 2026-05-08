import { useMutation } from "@tanstack/react-query";
import { postPromiseInviteCode } from "../promise/invite";

// 약속 초대 코드 생성
export const usePostPromiseInviteCode = () => {
  return useMutation({
    mutationFn: async (promiseId: string) => {
      const response = await postPromiseInviteCode(promiseId);
      return response.data;
    },
    onSuccess: response => {
      const inviteCode = response.inviteCode;
      const promiseId = response.promiseId;
      const invitationLink = `${window.location.origin}/map/${promiseId}?inviteCode=${inviteCode}`;
      navigator.clipboard.writeText(invitationLink);
      alert("초대 링크가 복사되었습니다.");
    },
    onError: error => {
      console.error('약속 초대 코드 생성 실패: ', error);
      alert("초대 링크 복사에 실패했습니다.");
    }
  });
};