export const queryKeys = {
  tabs: (params: { userid: string }) => ["tabs", params],
  auth: () => ["auth", "me"],
  user: (params: { userid: string }) => ["user", params],
} as const;
