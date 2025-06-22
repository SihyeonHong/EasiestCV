import { useTranslations } from "next-intl";
import { useState } from "react";

import UserInfoEditor from "@/app/components/admin/UserInfoEditor";
import { Button } from "@/app/components/common/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/app/components/common/DropdownMenu";

export default function UserInfoDropDown({ userid }: { userid: string }) {
  const tHeader = useTranslations("header");
  const tResetPW = useTranslations("resetPassword");
  const t = useTranslations("editUserInfo");

  const [isUserInfoEditorOpen, setIsUserInfoEditorOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary">{tHeader("dropdown")}</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>{t("title")}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setIsUserInfoEditorOpen(true)}>
            {t("editUserInfoBtn")}
          </DropdownMenuItem>
          <DropdownMenuItem>{tResetPW("resetPW")}</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <UserInfoEditor
        userid={userid}
        isOpen={isUserInfoEditorOpen}
        onClose={() => setIsUserInfoEditorOpen(false)}
      />
    </>
  );
}
