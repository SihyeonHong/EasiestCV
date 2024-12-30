import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";

import { LoginForm } from "@/models/user.model";
import { get, post } from "@/api/http";
import { queryKeys } from "@/constants/queryKeys";
import { useQueryClient } from "@tanstack/react-query";

interface LoginResponse {
  message: string;
  user: {
    userid: string;
  };
}

export default function useAuth() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery({
    queryKey: queryKeys.auth(),
    queryFn: async () => {
      try {
        const response = await get<{ userid: string }>(`/users/me`);
        return response;
      } catch {
        return null;
      }
    },
  });

  const { mutate: login, isPending: isLoggingIn } = useMutation({
    mutationFn: async (data: LoginForm) => {
      return await post<LoginResponse>(`/users/login`, data);
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.auth() });
      router.push(`/${response.user.userid}/admin`);
    },
    onError: (error: Error) => {
      console.log("Login Failed: ", error);
    },
  });

  const { mutate: logout, isPending: isLoggingOut } = useMutation({
    mutationFn: async () => {
      const currentUserId = user?.userid;
      const response = await post<{ message: string }>(`/users/logout`);
      return { response, currentUserId };
    },
    onSuccess: ({ currentUserId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.auth() });
      if (currentUserId) {
        router.push(`/${currentUserId}`);
      } else {
        router.push("/");
      }
    },
    onError: (error: Error) => {
      console.log("Logout Failed: ", error);
    },
  });

  return { user, isLoading, login, isLoggingIn, logout, isLoggingOut };
}
