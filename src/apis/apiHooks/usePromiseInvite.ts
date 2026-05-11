import { useMutation } from "@tanstack/react-query";
import { postJoinPromise, postPromiseInviteCode } from "../promise/invite";

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

// 초대 코드를 통한 약속 참여 요청
export const usePostJoinPromise = () => {
  return useMutation({
    mutationFn: (inviteCode: string) => postJoinPromise(inviteCode),
    onSuccess: () => {
      console.log('약속 참여 성공');
      sessionStorage.removeItem('inviteCode');
      sessionStorage.removeItem('redirectPage');
    },
    onError: (error) => {
      console.error('약속 참여 실패: ', error);
    }
  });
};
