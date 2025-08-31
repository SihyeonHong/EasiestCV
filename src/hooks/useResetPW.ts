import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import { ResetPasswordRequest } from "@/models/user.model";
import { put } from "@/utils/http";

export const useResetPassword = () => {
  const tMessage = useTranslations("message");
  const tError = useTranslations("error");

  const resetPasswordMutation = useMutation({
    mutationFn: (data: ResetPasswordRequest) => put("/users/resetPW", data),
    onSuccess: () => {
      alert(tMessage("resetPWEmailSent"));
    },
    onError: (error: Error) => {
      console.error(error);
      alert(tError("resetPWFail"));
    },
  });

  return {
    resetPassword: resetPasswordMutation.mutate,
    isResetting: resetPasswordMutation.isPending,
    resetError: resetPasswordMutation.error,
  };
};
