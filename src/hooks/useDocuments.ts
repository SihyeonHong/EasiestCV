import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import { queryKeys } from "@/constants/queryKeys";
import { get, post } from "@/utils/http";

export const useDocuments = (userid: string) => {
  const queryClient = useQueryClient();
  const tMessage = useTranslations("message");
  const tError = useTranslations("error");

  const { data: documents, isLoading } = useQuery({
    queryKey: queryKeys.files({ userid }),
    queryFn: () => get<string[]>(`/documents?userid=${userid}`),
    enabled: !!userid,
  });

  const { mutate: uploadDocument, isPending: isUploading } = useMutation({
    mutationFn: (document: File) => {
      const formData = new FormData();
      formData.append("userid", userid);
      formData.append("document", document);

      return post("/documents", formData);
    },
    onSuccess: () => {
      alert(tMessage("saveSuccess"));
      queryClient.invalidateQueries({ queryKey: queryKeys.files({ userid }) });
    },
    onError: (err) => {
      alert(tError("saveFail"));
      console.error("PDF 업로드 에러:", err);
    },
  });

  return {
    documents,
    isLoading,
    uploadDocument,
    isUploading,
  };
};
