import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import { queryKeys } from "@/constants/queryKeys";
import { FileData, UploadPdfVariables, UploadPdfResponse } from "@/types/file";
import { get, post } from "@/utils/http";

export const useFile = (userid: string) => {
  const queryClient = useQueryClient();
  const tMessage = useTranslations("message");
  const tError = useTranslations("error");

  // 파일 데이터 조회
  const {
    data: fileData,
    isLoading: isFileLoading,
    isError: isFileError,
    error: fileError,
  } = useQuery<FileData>({
    queryKey: queryKeys.files({ userid }),
    queryFn: () => get<FileData>(`/files?userid=${userid}`),
    enabled: !!userid,
  });

  // PDF 업로드 Mutation
  const { mutate: uploadFile, isPending: isUploading } = useMutation({
    mutationFn: ({ userid, file }: UploadPdfVariables) => {
      const formData = new FormData();
      formData.append("userid", userid);
      formData.append("file", file); // 서버에서 "file"이 key로 사용됨

      return post<UploadPdfResponse>("/home/pdf", formData);
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
    fileData,
    isFileLoading,
    isFileError,
    fileError,
    uploadFile,
    isUploading,
  };
};
