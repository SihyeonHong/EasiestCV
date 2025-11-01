import { RotateCcwIcon, SaveIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState, useEffect, useMemo } from "react";

import NeedSaveDescription from "@/app/components/admin/NeedSaveDescription";
import SaveStatusIndicator from "@/app/components/admin/SaveStatusIndicator";
import { Button } from "@/app/components/common/Button";
import { Input } from "@/app/components/common/Input";
import { Label } from "@/app/components/common/Label";
import { LoadingIcon } from "@/app/components/common/LoadingIcon";
import { useMetadata } from "@/hooks/useMetadata";
import { useUserInfo } from "@/hooks/useUserInfo";

interface MetadataEditorProps {
  userid: string;
}

export default function MetadataEditor({ userid }: MetadataEditorProps) {
  const t = useTranslations("editUserInfo");
  const tButton = useTranslations("button");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const { user, isUserLoading } = useUserInfo(userid);
  const { userSiteMeta, updateMeta, getMetaSaveStatus } = useMetadata(userid);

  // 저장 상태 계산
  const metaSaveStatus = useMemo(
    () => getMetaSaveStatus(title, description),
    [getMetaSaveStatus, title, description],
  );

  useEffect(() => {
    if (userSiteMeta) {
      setTitle(userSiteMeta.title);
      setDescription(userSiteMeta.description);
    }
  }, [userSiteMeta]);

  if (isUserLoading || !user) return <LoadingIcon />;

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
    <div id="metadata-section" className="w-full space-y-3">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold">{t("editMetadata")}</h1>
        <NeedSaveDescription />
      </header>
      <form className="space-y-3" onSubmit={handleMetaSubmit}>
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
