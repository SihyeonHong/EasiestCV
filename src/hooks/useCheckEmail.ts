import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useTranslations } from "next-intl";

import { ApiErrorResponse } from "@/types/error";
import { CheckEmailResponse } from "@/types/user-account";
import { get } from "@/utils/http";

interface UseCheckEmailProps {
  onSuccess: (data: CheckEmailResponse) => void;
}

export default function useCheckEmail({ onSuccess }: UseCheckEmailProps) {
  const tError = useTranslations("error");

  const { mutate: checkEmail, isPending: isChecking } = useMutation({
    mutationFn: async (email: string) => {
      return await get<CheckEmailResponse>(
        `/users/check-email?email=${encodeURIComponent(email)}`,
      );
    },
    onSuccess: (data) => {
      onSuccess(data);
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      if (!error.response) {
        alert(tError("networkError"));
        return;
      }

      const { data } = error.response;
      const message = data.message || tError("generalError");
      alert(message);
    },
  });

  return {
    checkEmail,
    isChecking,
  };
}
