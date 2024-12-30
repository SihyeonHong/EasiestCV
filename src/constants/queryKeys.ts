export const queryKeys = {
  tabs: (params: { userid: string }) => ["tabs", params],
  auth: () => ["auth", "me"] as const,
} as const;
