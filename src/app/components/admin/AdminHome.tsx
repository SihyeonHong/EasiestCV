import Image from "next/image";
import { useTranslations } from "next-intl";

import Editor from "@/app/components/admin/Editor";
import { Input } from "@/app/components/common/Input";
import { Label } from "@/app/components/common/Label";
import LoadingPage from "@/app/components/LoadingPage";
import { useHome } from "@/hooks/useHome";

interface Props {
  userid: string;
}
export default function AdminHome({ userid }: Props) {
  const tAdmin = useTranslations("admin");
  const { userHome, mutateUploadImg, isHomeLoading } = useHome(userid);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    mutateUploadImg(e.target.files[0] as File);
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

        {userHome && (
          <Image
            src={userHome.img_url ?? "/icon.png"}
            alt="profile-img"
            width={0}
            height={0}
            sizes="100%"
            className="h-auto w-full rounded-sm"
            priority
          />
        )}
      </div>
      <Editor userid={userid} tid={0} />
    </div>
  );
}
