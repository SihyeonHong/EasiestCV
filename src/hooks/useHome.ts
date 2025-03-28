import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import { queryKeys } from "@/constants/queryKeys";
import { HomeData } from "@/models/home.model";
import { get, patch, post } from "@/util/http";

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
    onSuccess: () => {
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
    onSuccess: () => {
      alert(t("saveSuccess"));
      queryClient.invalidateQueries({ queryKey: queryKeys.home({ userid }) });
      refetch();
    },
    onError: (err) => {
      alert(t("saveFail"));
      console.error("이미지 업로드 에러:", err);
    },
  });

  // 4) 프로필 소개 업로드 Mutation
  const {
    mutate: mutateUploadIntro,
    status: introUploadStatus,
    isPending: isIntroPending,
  } = useMutation({
    mutationFn: (newIntro: string) =>
      patch<UploadIntroResponse>(`/home/intro`, {
        userid: userid,
        intro: newIntro,
      }),
    onSuccess: () => {
      alert(t("saveSuccess"));
      queryClient.invalidateQueries({ queryKey: queryKeys.home({ userid }) });
    },
    onError: (error) => {
      alert(t("saveFail"));
      console.error("intro 업로드 에러:", error);
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

    // intro 업로드
    mutateUploadIntro,
    introUploadStatus,
    isIntroPending,
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
interface UploadImgVariables {
  userid: string;
  file: File;
}

interface UploadImgResponse {
  imageUrl?: string; // 성공 시 서버에서 imageUrl을 내려줌
  error?: string;
}

async function uploadImg({ userid, file }: UploadImgVariables) {
  const formData = new FormData();
  formData.append("userid", userid);
  formData.append("file", file); // 서버에서 "file"이 key로 사용됨

  return await post<UploadImgResponse>("/home/img", formData);
}

// ---------- 인트로 업로드 ----------
interface UploadIntroResponse {
  success: boolean;
  intro: string;
}
