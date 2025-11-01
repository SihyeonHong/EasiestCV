import { Loader2Icon, RotateCcwIcon, SaveIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { Button } from "@/app/components/common/Button";
import { Input } from "@/app/components/common/Input";
import { Label } from "@/app/components/common/Label";
import { useUserInfo } from "@/hooks/useUserInfo";

interface PasswordChangerProps {
  userid: string;
}

export default function PasswordChanger({ userid }: PasswordChangerProps) {
  const tchangePW = useTranslations("changePassword");
  const tButton = useTranslations("button");
  const tMessage = useTranslations("message");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");

  const { changePWMutation, changePWStatus } = useUserInfo(userid);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== newPasswordConfirm) {
      alert(tMessage("passwordMismatch"));
      return;
    }

    changePWMutation(
      {
        userid,
        currentPassword,
        newPassword,
      },
      {
        onSuccess: () => {
          setCurrentPassword("");
          setNewPassword("");
          setNewPasswordConfirm("");
        },
      },
    );
  };

  const handleReset = () => {
    setCurrentPassword("");
    setNewPassword("");
    setNewPasswordConfirm("");
  };

  return (
    <div id="password-section" className="w-full">
      <h1 className="mb-4 text-2xl font-bold">{tchangePW("changePassword")}</h1>
      <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-1">
          <Label htmlFor="currentPassword">
            {tchangePW("currentPassword")}
          </Label>
          <Input
            id="currentPassword"
            type="password"
            placeholder={tchangePW("currentPasswordPlaceholder")}
            required
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1">
          <Label htmlFor="newPassword">{tchangePW("newPassword")}</Label>
          <Input
            id="newPassword"
            type="password"
            placeholder={tchangePW("newPasswordPlaceholder")}
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1">
          <Label htmlFor="confirmNewPassword">
            {tchangePW("confirmNewPassword")}
          </Label>
          <div className="flex flex-col">
            <Input
              id="confirmNewPassword"
              type="password"
              placeholder={tchangePW("confirmNewPasswordPlaceholder")}
              required
              value={newPasswordConfirm}
              onChange={(e) => setNewPasswordConfirm(e.target.value)}
              className={`${
                newPasswordConfirm
                  ? newPassword === newPasswordConfirm
                    ? "border-green-500 focus-visible:ring-green-500" // 일치할 때 초록색
                    : "border-red-500 focus-visible:ring-red-500" // 불일치할 때 빨간색
                  : ""
              }`}
            />
            {/* 비밀번호가 일치하지 않을 때 에러 메시지 표시 */}
            {newPasswordConfirm && newPassword !== newPasswordConfirm && (
              <p className="mt-1 text-xs text-red-500">
                {tMessage("passwordMismatch")}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={handleReset}>
            <RotateCcwIcon className="size-4" />
            {tButton("reset")}
          </Button>

          {changePWStatus === "pending" ? (
            <Button disabled>
              <Loader2Icon className="animate-spin" />
              {tButton("pending")}
            </Button>
          ) : (
            <Button type="submit">
              <SaveIcon className="size-4" />
              {tButton("save")}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
