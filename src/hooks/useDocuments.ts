import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useMemo } from "react";

import { queryKeys } from "@/constants/queryKeys";
import { del, get, post } from "@/utils/http";

export const useDocuments = (userid: string) => {
  const queryClient = useQueryClient();
  const tMessage = useTranslations("message");
  const tError = useTranslations("error");

  const {
    data: documents,
    isLoading,
    isSuccess,
  } = useQuery({
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

  const { mutate: deleteDocument, isPending: isDeleting } = useMutation({
    mutationFn: () => {
      return del(`/documents?userid=${userid}`);
    },
    onSuccess: () => {
      alert(tMessage("saveSuccess"));
      queryClient.invalidateQueries({ queryKey: queryKeys.files({ userid }) });
    },
    onError: (err) => {
      alert(tError("saveFail"));
      console.error("PDF 삭제 에러:", err);
    },
  });

  const isDocumentExists = useMemo(
    () =>
      isSuccess &&
      documents !== undefined &&
      Array.isArray(documents) &&
      documents.length > 0,
    [isSuccess, documents],
  );

  return {
    documents,
    isLoading,
    isDocumentExists,
    uploadDocument,
    isUploading,
    deleteDocument,
    isDeleting,
  };
};
