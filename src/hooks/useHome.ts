import { useTranslations } from "next-intl";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { HomeData } from "@/models/home.model";
import { queryKeys } from "@/constants/queryKeys";
import { get, post } from "@/api/http";

export const useHome = (userid: string) => {
  const queryClient = useQueryClient();
  const t = useTranslations("message");

  // 1) 홈 데이터 조회
  const {
    data: homeData,
    isLoading: isHomeLoading,
    isError: isHomeError,
    error: homeError,
    refetch,
  } = useQuery<HomeData>({
    queryKey: queryKeys.home({ userid }),
    queryFn: () => get<HomeData>(`/home?userid=${userid}`),
    enabled: !!userid, // userid가 있어야만 요청
  });

  // 2) PDF 업로드 Mutation
  const {
    mutate: mutateUploadPdf,
    status: pdfUploadStatus,
    isPending: isPdfPending,
  } = useMutation({
    mutationFn: uploadPdf,
    onSuccess: (data) => {
      alert(t("saveSuccess"));
      queryClient.invalidateQueries({ queryKey: queryKeys.home({ userid }) });
      refetch();
    },
    onError: (err) => {
      alert(t("saveFail"));
      console.error("PDF 업로드 에러:", err);
    },
  });

  // 3) 이미지 업로드 Mutation
  const {
    mutate: mutateUploadImg,
    status: imgUploadStatus,
    isPending: isImgPending,
  } = useMutation({
    mutationFn: uploadImg,
    onSuccess: (data) => {
      alert(t("saveSuccess"));
      queryClient.invalidateQueries({ queryKey: queryKeys.home({ userid }) });
      refetch();
    },
    onError: (err) => {
      alert(t("saveFail"));
      console.error("이미지 업로드 에러:", err);
    },
  });

  return {
    // 홈 데이터 관련
    homeData,
    isHomeLoading,
    isHomeError,
    homeError,

    // PDF 업로드
    mutateUploadPdf,
    pdfUploadStatus,
    isPdfPending,

    // 이미지 업로드
    mutateUploadImg,
    imgUploadStatus,
    isImgPending,
  };
};

// ---------- PDF 업로드 ----------
type UploadPdfVariables = {
  userid: string;
  file: File;
};

type UploadPdfResponse = {
  pdfUrl?: string; // 성공 시 서버에서 pdfUrl을 내려줌
  error?: string;
};

async function uploadPdf({ userid, file }: UploadPdfVariables) {
  const formData = new FormData();
  formData.append("userid", userid);
  formData.append("file", file); // 서버에서 "file"이 key로 사용됨

  return await post<UploadPdfResponse>("/home/pdf", formData);
}

// ---------- 이미지 업로드 ----------
type UploadImgVariables = {
  userid: string;
  file: File;
};

type UploadImgResponse = {
  imageUrl?: string; // 성공 시 서버에서 imageUrl을 내려줌
  error?: string;
};

async function uploadImg({ userid, file }: UploadImgVariables) {
  const formData = new FormData();
  formData.append("userid", userid);
  formData.append("file", file); // 서버에서 "file"이 key로 사용됨

  return await post<UploadImgResponse>("/home/img", formData);
}
