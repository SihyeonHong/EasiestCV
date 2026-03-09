"use client";

import { CircleUserRound } from "lucide-react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { FormEvent, useState } from "react";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/app/components/common/AlertDialog";
import { Button } from "@/app/components/common/Button";
import { CardDescription } from "@/app/components/common/Card";
import { Input } from "@/app/components/common/Input";
import { Label } from "@/app/components/common/Label";
import { useResetPassword } from "@/hooks/useResetPW";
import { Locale } from "@/i18n/routing";
import { cn } from "@/utils/classname";

interface DuplicateEmailAlertDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  registeredUserids: string[];
  email: string;
  onContinueSignup: () => void;
  onLoginClick: (selectedUserid: string) => void;
}

export default function DuplicateEmailAlertDialog({
  isOpen,
  onOpenChange,
  registeredUserids,
  email,
  onContinueSignup,
  onLoginClick,
}: DuplicateEmailAlertDialogProps) {
  const tInitPage = useTranslations("initpage");
  const tResetPW = useTranslations("resetPassword");
  const tPlaceholder = useTranslations("placeholder");

  const localeParams = useParams().locale as string;
  const locale: Locale = ["ko", "en"].includes(localeParams)
    ? (localeParams as Locale)
    : "en";

  const [selectedUserid, setSelectedUserid] = useState<string>(
    registeredUserids[0] ?? "",
  );
  const [showResetForm, setShowResetForm] = useState(false);
  const [resetData, setResetData] = useState({
    userid: registeredUserids[0] ?? "",
    email,
  });

  const { resetPassword } = useResetPassword();

  const handleRadioChange = (id: string) => {
    setSelectedUserid(id);
    setResetData((prev) => ({ ...prev, userid: id }));
  };

  const handleReset = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    resetPassword(
      { userid: resetData.userid, email: resetData.email, locale },
      {
        onSuccess: () => {
          setShowResetForm(false);
        },
      },
    );
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {tInitPage("duplicateEmailTitle")}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {tInitPage("duplicateEmailDescription")}
          </AlertDialogDescription>
        </AlertDialogHeader>

        {/* 기존 계정 선택 + 로그인 버튼: 하나의 그룹 */}
        <div className="space-y-3 rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/60">
          <div className="space-y-2 text-sm text-foreground">
            {registeredUserids.map((id) => (
              <Label
                key={id}
                className={cn(
                  "flex cursor-pointer items-center gap-3 rounded-md border px-3 py-2.5 transition-colors",
                  selectedUserid === id
                    ? "border-zinc-400 bg-zinc-100 dark:border-zinc-600 dark:bg-zinc-800"
                    : "border-transparent hover:bg-zinc-100 dark:hover:bg-zinc-800/60",
                )}
              >
                <input
                  type="radio"
                  name="existingAccount"
                  value={id}
                  checked={selectedUserid === id}
                  onChange={() => handleRadioChange(id)}
                  className="accent-zinc-900 dark:accent-zinc-50"
                />
                <CircleUserRound className="h-4 w-4 text-zinc-400 dark:text-zinc-500" />
                <span className="font-medium">{id}</span>
              </Label>
            ))}
          </div>
          <Button
            className="w-full"
            onClick={() => onLoginClick(selectedUserid)}
          >
            {tInitPage("duplicateEmailLoginButton")}
          </Button>

          {/* 비밀번호 초기화 토글 */}
          <button
            type="button"
            onClick={() => setShowResetForm(!showResetForm)}
            className="w-full text-center text-sm text-zinc-500 underline-offset-4 hover:underline dark:text-zinc-400"
          >
            {tResetPW("showResetForm")}
          </button>

          {/* 비밀번호 초기화 폼 */}
          {showResetForm && (
            <form onSubmit={handleReset} className="space-y-3 pt-1">
              <div className="grid gap-2">
                <Input
                  type="text"
                  placeholder={tPlaceholder("idPlaceholder")}
                  required
                  value={resetData.userid}
                  onChange={(e) =>
                    setResetData((prev) => ({
                      ...prev,
                      userid: e.target.value,
                    }))
                  }
                />
                <Input
                  type="email"
                  placeholder={tPlaceholder("emailPlaceholder")}
                  required
                  value={resetData.email}
                  onChange={(e) =>
                    setResetData((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                />
              </div>
              <CardDescription>{tResetPW("description")}</CardDescription>
              <Button type="submit" variant="secondary" className="w-full">
                {tResetPW("resetPW")}
              </Button>
            </form>
          )}
        </div>

        {/* 구분선: "또는" */}
        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-700" />
          <span className="text-xs text-zinc-500 dark:text-zinc-400">
            {tInitPage("duplicateEmailOrDivider")}
          </span>
          <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-700" />
        </div>

        {/* 새 계정 만들기 버튼: 분리 배치 */}
        <Button
          variant="outline"
          className="w-full"
          onClick={() => {
            onContinueSignup();
            onOpenChange(false);
          }}
        >
          {tInitPage("duplicateEmailSignupButton")}
        </Button>
      </AlertDialogContent>
    </AlertDialog>
  );
}
