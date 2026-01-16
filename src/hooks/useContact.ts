import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import { ContactRequest } from "@/types/support";
import { post } from "@/utils/http";

export default function useContact() {
  const t = useTranslations("contact");
  const tError = useTranslations("error");

  const { mutate: sendContact } = useMutation({
    mutationFn: (contactRequest: ContactRequest) =>
      post(`/contact`, contactRequest),
    onSuccess: () => {
      alert(t("sendSuccess"));
    },
    onError: () => {
      alert(tError("sendFail"));
    },
  });

  return { sendContact };
}
