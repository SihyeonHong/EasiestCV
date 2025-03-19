"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { getQueryClient } from "@/util/queryClient";

const queryClient = getQueryClient();

export default function TanstackQueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
