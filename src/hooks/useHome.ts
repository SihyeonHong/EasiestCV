import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useEffect, useRef } from "react";

import { queryKeys } from "@/constants/queryKeys";
import { HomeImgDeleteRequest, UserHome } from "@/types/user-data";
import { get, patch, post, put } from "@/utils/http";

export const useHome = (userid: string) => {
  const queryClient = useQueryClient();
  const tMessage = useTranslations("message");
  const tEditor = useTranslations("editor");
  const tError = useTranslations("error");

  // 홈 데이터 조회
  const {
    data: userHome,
    isLoading: isHomeLoading,
    isError: isHomeError,
    error: homeError,
    refetch,
  } = useQuery<UserHome>({
    queryKey: queryKeys.home({ userid }),
    queryFn: () => get<UserHome>(`/home?userid=${userid}`),
    enabled: !!userid, // userid가 있어야만 요청
  });

  // 이미지 GCS 업로드 Mutation
  const {
    mutate: mutateUploadImg,
    status: imgUploadStatus,
    isPending: isImgPending,
  } = useMutation({
    mutationFn: (imgFile: File) => {
      const formData = new FormData();
      formData.append("userid", userid);
      formData.append("imgFile", imgFile);
      return post("/home/img", formData);
    },
    onSuccess: () => {
      alert(tMessage("imgUploadSuccess"));
      queryClient.refetchQueries({ queryKey: queryKeys.home({ userid }) });
      refetch();
    },
    onError: (error) => {
      alert(tError("imgUploadFail"));
      console.error("이미지 업로드 에러:", error);
    },
  });

  // 기본 이미지 or 프로필 이미지 없애기
  const { mutate: deleteImg } = useMutation({
    mutationFn: (imgUrl: string | null, oldFileName?: string) => {
      const data: HomeImgDeleteRequest = { userid, imgUrl, oldFileName };
      return put("/home/img", data);
    },
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: queryKeys.home({ userid }) });
      refetch();
    },
    onError: (error) => {
      alert(tError("saveFail"));
      console.error("Reset Img Error:", error);
    },
  });

  // 프로필 소개 업로드 Mutation
  const {
    mutate: mutateUploadIntro,
    status: introUploadStatus,
    isPending: isIntroPending,
  } = useMutation({
    mutationFn: (newIntro: string) =>
      patch(`/home/intro`, {
        userid: userid,
        intro: newIntro,
      }),
    onSuccess: (_, newIntro) => {
      // 자동저장 성공 시 캐시를 즉시 업데이트하여 최신 데이터 유지
      queryClient.setQueryData<UserHome>(
        queryKeys.home({ userid }),
        (oldHome) => {
          if (!oldHome) return oldHome;
          return { ...oldHome, intro_html: newIntro };
        },
      );
    },
    onError: (error) => {
      alert(tError("saveFail"));
      console.error("intro 업로드 에러:", error);
    },
  });

  // 프로필 소개 되돌리기
  const backUpIntroRef = useRef<string | null>(null);

  useEffect(() => {
    if (!backUpIntroRef.current && userHome && userHome.intro_html) {
      backUpIntroRef.current = userHome.intro_html;
    }
  }, [userHome]);

  const revertIntro = (): null | void => {
    try {
      if (!backUpIntroRef.current || backUpIntroRef.current.length === 0) {
        alert(tError("revertNoBackup"));
        return null;
      }

      const confirm = window.confirm(tEditor("revertConfirm"));
      if (!confirm) return null;

      mutateUploadIntro(backUpIntroRef.current);
    } catch (error) {
      console.error("revertIntro: ", error);
    }
  };

  return {
    // 홈 데이터 관련
    userHome,
    isHomeLoading,
    isHomeError,
    homeError,

    // 이미지 업로드
    mutateUploadImg,
    imgUploadStatus,
    isImgPending,

    // 이미지 탭 삭제 or 기본 이미지로 변경
    deleteImg,

    // intro 업로드
    mutateUploadIntro,
    introUploadStatus,
    isIntroPending,

    // intro 되돌리기
    revertIntro,
  };
};
