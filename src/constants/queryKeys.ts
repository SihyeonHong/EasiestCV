export const queryKeys = {
  tabs: (params: { userid: string }) => ["tabs", params],
  auth: () => ["auth", "me"],
  user: (params: { userid: string }) => ["user", params],
  meta: (params: { userid: string }) => ["meta", params],
  home: ({ userid }: { userid: string }) => ["home", userid],
  files: ({ userid }: { userid: string }) => ["files", userid],
} as const;
