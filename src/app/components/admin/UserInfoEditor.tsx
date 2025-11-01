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
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const { user, isUserLoading, updateUserInfo, userSiteMeta, updateMeta } =
    useUserInfo(userid);

  useEffect(() => {
    if (user) {
      setUsername(user.username);
      setEmail(user.email);
    }
  }, [user]);

  useEffect(() => {
    if (userSiteMeta) {
      setTitle(userSiteMeta.title);
      setDescription(userSiteMeta.description);
    }
  }, [userSiteMeta]);

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

  const handleMetaSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateMeta({
      userid,
      title: title.trim(),
      description: description.trim(),
    });
  };

  const handleMetaReset = () => {
    if (userSiteMeta) {
      setTitle(userSiteMeta.title);
      setDescription(userSiteMeta.description);
    } else {
      setTitle(`${user.username}'s CV - Easiest CV`);
      setDescription(`${user.username}'s CV`);
    }
  };

  return (
    <div id="userinfo-section" className="w-full">
      <h1 className="mb-4 text-2xl font-bold">{t("editUserInfo")}</h1>

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

      <div className="my-6 w-full border-t border-dashed border-zinc-200 dark:border-zinc-800" />

      <form className="mt-4 flex flex-col gap-2" onSubmit={handleMetaSubmit}>
        <h2 className="mb-4 text-xl font-bold">{t("editMetadata")}</h2>
        <Label htmlFor="title" className="text-sm">
          {t("metadataTitleLabel")}
        </Label>
        <Input
          id="title"
          type="text"
          placeholder={t("metadataTitlePlaceholder")}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <Label htmlFor="description" className="text-sm">
          {t("metadataDescriptionLabel")}
        </Label>
        <Input
          id="description"
          type="text"
          placeholder={t("metadataDescriptionPlaceholder")}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <Button variant="secondary" type="button" onClick={handleMetaReset}>
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
