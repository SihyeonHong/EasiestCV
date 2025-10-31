import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";

import { Button } from "@/app/components/common/Button";
import { Input } from "@/app/components/common/Input";
import { Label } from "@/app/components/common/Label";
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
      setUsername(user.username);
      setEmail(user.email);
    }
  }, [user]);

  if (isUserLoading || !user) return <LoadingIcon />;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    updateUserInfo({
      userid,
      username: username.trim(),
      email: email.trim(),
    });
  };

  const handleReset = () => {
    if (user) {
      setUsername(user.username);
      setEmail(user.email);
    }
  };

  return (
    <div id="userinfo-section" className="w-full">
      <h1 className="mb-4 text-2xl font-bold">{t("title")}</h1>

      <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-1">
          <Label htmlFor="username" className="text-sm">
            {tLabel("name")}
          </Label>
          <Input
            id="username"
            type="text"
            placeholder={tPlaceholder("namePlaceholder")}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="flex flex-col gap-1">
          <Label htmlFor="email" className="text-sm">
            {tLabel("email")}
          </Label>
          <Input
            id="email"
            type="email"
            placeholder={tPlaceholder("emailPlaceholder")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <Button variant="secondary" type="button" onClick={handleReset}>
            {tButton("reset")}
          </Button>
          <Button variant="default" type="submit">
            {tButton("confirm")}
          </Button>
        </div>
      </form>
    </div>
  );
}
