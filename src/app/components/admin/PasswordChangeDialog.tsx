import { Loader2Icon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { Button } from "@/app/components/common/Button";
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/app/components/common/Dialog";
import { Input } from "@/app/components/common/Input";
import { useUser } from "@/hooks/useUser";

interface PasswordChangeDialogProps {
  userid: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function PasswordChangeDialog({
  userid,
  isOpen,
  onClose,
}: PasswordChangeDialogProps) {
  const tchangePW = useTranslations("changePassword");
  const tButton = useTranslations("button");
  const tMessage = useTranslations("message");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");

  const { changePWMutation, changePWStatus } = useUser(userid);

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
          onClose();
        },
      },
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{tchangePW("changePassword")}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-1">
              <label htmlFor="currentPassword">
                {tchangePW("currentPassword")}
              </label>
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
              <label htmlFor="newPassword">{tchangePW("newPassword")}</label>
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
              <label htmlFor="confirmNewPassword">
                {tchangePW("confirmNewPassword")}
              </label>
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

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="secondary">{tButton("cancel")}</Button>
              </DialogClose>

              {changePWStatus === "pending" ? (
                <Button disabled>
                  <Loader2Icon className="animate-spin" />
                  {tButton("pending")}
                </Button>
              ) : (
                <Button type="submit">{tButton("confirm")}</Button>
              )}
            </DialogFooter>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
