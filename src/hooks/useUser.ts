import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/constants/queryKeys";
import { User } from "@/models/user.model";
import { get, put } from "@/util/http";

export const useUser = (userid: string) => {
  const queryClient = useQueryClient();

  const {
    data: user,
    isLoading: isUserLoading,
    isError: isUserError,
  } = useQuery({
    queryKey: queryKeys.user({ userid }),
    queryFn: async () => {
      const response = await get<User>(`/users/user?userid=${userid}`);
      if (!response) {
        throw new Error("사용자를 찾을 수 없습니다.");
      }
      return response;
    },
    retry: false,
  });

  const {
    mutateAsync: updateUserInfo,
    status: updateStatus,
    error: updateError,
  } = useMutation<{ message: string }, Error, User>({
    mutationFn: (payload) => put(`/users/user`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.user({ userid }) });
    },
  });

  return {
    user,
    isUserLoading,
    isUserError,
    updateUserInfo,
    updateStatus,
    updateError,
  };
};
