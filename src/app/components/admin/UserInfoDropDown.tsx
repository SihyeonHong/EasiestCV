import { useTranslations } from "next-intl";
import { useState } from "react";

import PasswordChangeDialog from "@/app/components/admin/PasswordChangeDialog";
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
  const tChangePW = useTranslations("changePassword");
  const t = useTranslations("editUserInfo");

  const [isUserInfoEditorOpen, setIsUserInfoEditorOpen] = useState(false);
  const [isResetPWDialogOpen, setIsResetPWDialogOpen] = useState(false);

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
          <DropdownMenuItem onClick={() => setIsResetPWDialogOpen(true)}>
            {tChangePW("changePassword")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <UserInfoEditor
        userid={userid}
        isOpen={isUserInfoEditorOpen}
        onClose={() => setIsUserInfoEditorOpen(false)}
      />
      <PasswordChangeDialog
        userid={userid}
        isOpen={isResetPWDialogOpen}
        onClose={() => setIsResetPWDialogOpen(false)}
      />
    </>
  );
}
