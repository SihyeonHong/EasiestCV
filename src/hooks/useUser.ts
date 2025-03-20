import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/constants/queryKeys";
import { User } from "@/models/user.model";
import { get } from "@/util/http";

export const useUser = (userid: string) => {
  const {
    data: user,
    isLoading,
    isError,
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

  return {
    user,
    isLoading,
    isError,
  };
};
