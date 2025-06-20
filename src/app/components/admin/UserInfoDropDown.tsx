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
  const t = useTranslations("editUserInfo");

  const [isUserInfoEditorOpen, setIsUserInfoEditorOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary">{t("button")}</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>{t("title")}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setIsUserInfoEditorOpen(true)}>
            {t("editUserInfoBtn")}
          </DropdownMenuItem>
          <DropdownMenuItem>{t("resetPW")}</DropdownMenuItem>
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
