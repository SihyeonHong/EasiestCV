import Image from "next/image";
import { useTranslations } from "next-intl";

import Editor from "@/app/components/admin/Editor";
import { Button } from "@/app/components/common/Button";
import { Input } from "@/app/components/common/Input";
import { Label } from "@/app/components/common/Label";
import LoadingPage from "@/app/components/LoadingPage";
import { DEFAULT_IMG } from "@/constants/constants";
import { useHome } from "@/hooks/useHome";

interface Props {
  userid: string;
}
export default function AdminHome({ userid }: Props) {
  const tAdmin = useTranslations("admin");
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
    <div className="flex flex-col gap-6 md:flex-row">
      <div className="flex flex-1 flex-col gap-2">
        <Label htmlFor="profileImg">{tAdmin("profileImgAttach")}</Label>
        <Input
          id="profileImg"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
        />

        {(!userHome || isHomeLoading) && <LoadingPage />}

        {userHome && userHome.img_url && (
          <Image
            src={userHome.img_url}
            alt="profile-img"
            width={0}
            height={0}
            sizes="100%"
            className="h-auto w-full rounded-sm"
            priority
          />
        )}
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={handleImageToDefault}>
            {tAdmin("imageToDefault")}
          </Button>
          <Button onClick={handleImageTabHide}>{tAdmin("imageTabHide")}</Button>
        </div>
      </div>
      <Editor userid={userid} tid={0} />
    </div>
  );
}
