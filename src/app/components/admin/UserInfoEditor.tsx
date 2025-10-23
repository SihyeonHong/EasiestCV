import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";

import { Button } from "@/app/components/common/Button";
import { CardContent } from "@/app/components/common/Card";
import { Input } from "@/app/components/common/Input";
import { LoadingIcon } from "@/app/components/common/LoadingIcon";
import { useUserInfo } from "@/hooks/useUserInfo";

interface UserInfoEditorProps {
  userid: string;
}

export default function UserInfoEditor({ userid }: UserInfoEditorProps) {
  const t = useTranslations("editUserInfo");
  const tLabel = useTranslations("label");
  const tPlaceholder = useTranslations("placeholder");
  const tButton = useTranslations("button");

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const { user, isUserLoading, updateUserInfo } = useUserInfo(userid);

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
        },
      },
    );
  };

  const handleCancel = () => {
    // 취소
  };

  return (
    <CardContent>
      <h1 className="mb-2 text-2xl font-bold">{t("title")}</h1>
      <p>{t("description")}</p>

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

        <div>
          <Button variant="secondary" type="button" onClick={handleCancel}>
            {tButton("cancel")}
          </Button>
          <Button variant="default" type="submit">
            {tButton("confirm")}
          </Button>
        </div>
      </form>
    </CardContent>
  );
}
