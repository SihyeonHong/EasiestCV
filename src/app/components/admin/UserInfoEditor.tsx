import { RotateCcwIcon, SaveIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState, useEffect, useMemo } from "react";

import NeedSaveDescription from "@/app/components/admin/NeedSaveDescription";
import SaveStatusIndicator from "@/app/components/admin/SaveStatusIndicator";
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

  const {
    user,
    isUserLoading,
    updateUserInfo,
    userSiteMeta,
    updateMeta,
    getUserInfoSaveStatus,
    getMetaSaveStatus,
  } = useUserInfo(userid);

  // 저장 상태 계산
  const userInfoSaveStatus = useMemo(
    () => getUserInfoSaveStatus(username, email),
    [getUserInfoSaveStatus, username, email],
  );

  const metaSaveStatus = useMemo(
    () => getMetaSaveStatus(title, description),
    [getMetaSaveStatus, title, description],
  );

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
    <div id="userinfo-section" className="w-full space-y-3">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold">{t("editUserInfo")}</h1>
        <NeedSaveDescription />
      </header>
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
        <div className="mt-4 flex justify-end gap-2">
          <SaveStatusIndicator status={userInfoSaveStatus} />
          <Button variant="secondary" type="button" onClick={handleReset}>
            <RotateCcwIcon className="size-4" />
            {tButton("reset")}
          </Button>
          <Button variant="default" type="submit">
            <SaveIcon className="size-4" />
            {tButton("save")}
          </Button>
        </div>
      </form>

      <form className="space-y-3" onSubmit={handleMetaSubmit}>
        <header className="space-y-1">
          <h2 className="text-xl font-bold">{t("editMetadata")}</h2>
          <NeedSaveDescription />
        </header>
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
        <div className="mt-4 flex justify-end gap-2">
          <SaveStatusIndicator status={metaSaveStatus} />
          <Button variant="secondary" type="button" onClick={handleMetaReset}>
            <RotateCcwIcon className="size-4" />
            {tButton("reset")}
          </Button>
          <Button variant="default" type="submit">
            <SaveIcon className="size-4" />
            {tButton("save")}
          </Button>
        </div>
      </form>
    </div>
  );
}
