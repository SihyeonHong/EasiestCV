import { useParams } from "next/navigation";
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
import { LoadingIcon } from "@/app/components/common/LoadingIcon";
import { useUser } from "@/hooks/useUser";

interface UserInfoEditorProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UserInfoEditor({
  isOpen,
  onClose,
}: UserInfoEditorProps) {
  const userid = useParams().userid as string;

  const t = useTranslations("editUserInfo");
  const tLabel = useTranslations("label");
  const tPlaceholder = useTranslations("placeholder");
  const tButton = useTranslations("button");

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

    updateUserInfo(
      {
        userid,
        username: username.trim(),
        email: email.trim(),
      },
      {
        onSuccess: () => {
          setUsername("");
          setEmail("");
          onClose();
        },
      },
    );
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
              {tLabel("name")}
            </label>
            <Input
              id="username"
              type="text"
              placeholder={tPlaceholder("namePlaceholder")}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col gap-3">
            <label htmlFor="email" className="text-sm">
              {tLabel("email")}
            </label>
            <Input
              id="email"
              type="email"
              placeholder={tPlaceholder("emailPlaceholder")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <DialogFooter>
            <Button variant="secondary" type="button" onClick={handleCancel}>
              {tButton("cancel")}
            </Button>
            <Button variant="default" type="submit">
              {tButton("confirm")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
