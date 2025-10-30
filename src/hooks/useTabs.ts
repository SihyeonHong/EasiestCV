import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/constants/queryKeys";
import { Tab } from "@/models/tab.model";
import { get } from "@/utils/http";

export const useTabs = (userid: string) => {
  const {
    data: tabs = [],
    isLoading,
    error,
  } = useQuery<Tab[]>({
    queryKey: queryKeys.tabs({ userid }),
    queryFn: () => get<Tab[]>(`/tabs?userid=${userid}`),
  });

  return {
    tabs,
    isLoading,
    error,
  };
};
