import { useMutation } from "@tanstack/react-query";

import { put } from "@/util/http";

interface ResetPasswordData {
  userid: string;
  email: string;
}

export const useResetPassword = () => {
  const resetPasswordMutation = useMutation({
    mutationFn: (data: ResetPasswordData) => put("/users/resetPW", data),
    onSuccess: () => {
      alert("임시 비밀번호가 이메일로 전송되었습니다.");
    },
    onError: (error: Error) => {
      alert(error.message || "비밀번호 재설정 중 오류가 발생했습니다.");
    },
  });

  return {
    resetPassword: resetPasswordMutation.mutate,
    isResetting: resetPasswordMutation.isPending,
    resetError: resetPasswordMutation.error,
  };
};
