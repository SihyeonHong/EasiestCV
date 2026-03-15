import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import { ResetPasswordRequest } from "@/types/user-account";
import { put } from "@/utils/http";

export const useResetPassword = () => {
  const tMessage = useTranslations("message");
  const tError = useTranslations("error");

  const resetPasswordMutation = useMutation({
    mutationFn: (data: ResetPasswordRequest) => put("/users/resetPW", data),
    onSuccess: () => {
      alert(tMessage("resetPWEmailSent"));
    },
    onError: () => {
      alert(tError("generalError"));
    },
  });

  return {
    resetPassword: resetPasswordMutation.mutate,
    isResetting: resetPasswordMutation.isPending,
    resetError: resetPasswordMutation.error,
  };
};
