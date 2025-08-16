import {
  dehydrate,
  FetchQueryOptions,
  HydrationBoundary,
  isServer,
  QueryClient,
} from "@tanstack/react-query";

const makeQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        refetchOnWindowFocus: false, // 브라우저 탭 이동시 재요청 안함
        staleTime: Infinity,
      },
    },
  });
};

// 브라우저에서는 싱글톤 패턴
let browserClient: QueryClient | undefined = undefined;

export const getQueryClient = () => {
  if (isServer) {
    return makeQueryClient(); // 서버에서는 매번 새로 생성
  } else {
    if (!browserClient) browserClient = makeQueryClient();
    return browserClient;
  }
};

export const getDehydratedQuery = async (options: FetchQueryOptions) => {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(options);
  return dehydrate(queryClient);
};

export const Hydration = HydrationBoundary;
