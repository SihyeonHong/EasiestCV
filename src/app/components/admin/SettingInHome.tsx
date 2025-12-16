import { useTranslations } from "next-intl";

import { Button } from "@/app/components/common/Button";
import { Input } from "@/app/components/common/Input";
import { DEFAULT_IMG } from "@/constants/constants";
import { useHome } from "@/hooks/useHome";

interface Props {
  userid: string;
}
export default function SettingInHome({ userid }: Props) {
  const tAdmin = useTranslations("admin");
  const { userHome, mutateUploadImg, deleteImg } = useHome(userid);

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
    <div className="bg-background p-3">
      <h1 className="mb-2 whitespace-nowrap text-lg font-semibold">
        {tAdmin("profileImgAttach")}
      </h1>
      {/* 여기 밑에 */}
      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="flex gap-2">
          <Button size="sm" onClick={handleImageTabHide}>
            {tAdmin("imageTabHide")}
          </Button>
          <Button variant="secondary" size="sm" onClick={handleImageToDefault}>
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
    </div>
  );
}
