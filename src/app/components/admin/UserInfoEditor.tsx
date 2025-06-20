import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";

import { Button } from "@/app/components/common/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/app/components/common/Dialog";
import { Input } from "@/app/components/common/Input";
import { useUser } from "@/hooks/useUser";

import { LoadingIcon } from "../common/LoadingIcon";

interface UserInfoEditorProps {
  userid: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function UserInfoEditor({
  userid,
  isOpen,
  onClose,
}: UserInfoEditorProps) {
  const t = useTranslations("editUserInfo");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const { user, isUserLoading, updateUserInfo } = useUser(userid);

  useEffect(() => {
    if (user) {
      setUsername(user.username || "");
      setEmail(user.email || "");
    }
  }, [user]);

  if (isUserLoading || !user) return <LoadingIcon />;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await updateUserInfo({
        ...user,
        username,
        email,
      });
      alert(t("updateSuccess"));
      onClose();
    } catch (error) {
      alert(t("updateFail"));
      console.error("회원정보 수정 오류:", error);
    }
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        onPointerDownOutside={(e) => e.preventDefault()} // 외부 클릭 시 닫힘 방지
      >
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-3">
            <label htmlFor="username" className="text-sm">
              {t("nameLabel")}
            </label>
            <Input
              id="username"
              type="text"
              placeholder={t("usernamePlaceholder")}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col gap-3">
            <label htmlFor="email" className="text-sm">
              {t("emailLabel")}
            </label>
            <Input
              id="email"
              type="email"
              placeholder={t("emailPlaceholder")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <DialogFooter>
            <Button variant="secondary" type="button" onClick={handleCancel}>
              {t("cancel")}
            </Button>
            <Button variant="default" type="submit">
              {t("submit")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
