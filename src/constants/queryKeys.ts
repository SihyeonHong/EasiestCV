export const queryKeys = {
  tabs: (params: { userid: string }) => ["tabs", params],
  auth: () => ["auth", "me"],
  user: (params: { userid: string }) => ["user", params],
  home: ({ userid }: { userid: string }) => ["home", userid],
} as const;
