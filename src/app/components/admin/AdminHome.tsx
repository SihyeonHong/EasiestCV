import Image from "next/image";
import { useTranslations } from "next-intl";

import Editor from "@/app/components/admin/Editor";
import AlertBanner from "@/app/components/common/AlertBanner";
import { Button } from "@/app/components/common/Button";
import { Card, CardContent } from "@/app/components/common/Card";
import { Input } from "@/app/components/common/Input";
import LoadingPage from "@/app/components/LoadingPage";
import { DEFAULT_IMG } from "@/constants/constants";
import { useHome } from "@/hooks/useHome";
import { cn } from "@/utils/classname";

interface Props {
  userid: string;
}
export default function AdminHome({ userid }: Props) {
  const tAdmin = useTranslations("admin");
  const tAlertBanner = useTranslations("alertBanner");
  const { userHome, mutateUploadImg, isHomeLoading, deleteImg } =
    useHome(userid);

  const hasCustomImage =
    userHome?.img_url !== null && userHome?.img_url !== DEFAULT_IMG;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    mutateUploadImg(e.target.files[0] as File);
  };

  const handleImageToDefault = () => {
    const confirmMessage = hasCustomImage
      ? tAdmin("currentImageDelete") + "\n" + tAdmin("imageToDefaultConfirm")
      : tAdmin("imageToDefaultConfirm");
    const confirm = window.confirm(confirmMessage);
    if (!confirm) return;
    deleteImg(DEFAULT_IMG);
  };

  const handleImageTabHide = () => {
    const confirmMessage = hasCustomImage
      ? tAdmin("currentImageDelete") + "\n" + tAdmin("imageTabHideConfirm")
      : tAdmin("imageTabHideConfirm");
    const confirm = window.confirm(confirmMessage);
    if (!confirm) return;
    deleteImg(null);
  };

  return (
    <div className="space-y-4">
      <Card className="bg-editor-color border-tt-border-color">
        <CardContent className="space-y-1">
          <h1 className="whitespace-nowrap text-lg font-semibold">
            {tAdmin("profileImgAttach")}
          </h1>
          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="flex gap-2">
              <Button size="sm" onClick={handleImageTabHide}>
                {tAdmin("imageTabHide")}
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleImageToDefault}
              >
                {tAdmin("imageToDefault")}
              </Button>
            </div>
            <Input
              id="profileImg"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>
          <p className="text-right text-xs text-muted sm:text-sm">
            {tAdmin("howToActivateImgTab")}
          </p>
        </CardContent>
      </Card>
      <div
        className={cn(
          "flex flex-col gap-6",
          userHome && userHome.img_url ? "md:flex-row" : "",
        )}
      >
        {userHome && userHome.img_url && (
          <div className="flex flex-1 flex-col gap-2">
            {isHomeLoading && <LoadingPage />}
            <Image
              src={userHome.img_url}
              alt="profile-img"
              width={0}
              height={0}
              sizes="100%"
              className="h-auto w-full rounded-sm"
              priority
            />
          </div>
        )}
        <Editor userid={userid} tid={0} />
        <AlertBanner message={tAlertBanner("bugAnnouncement")} />
      </div>
    </div>
  );
}
