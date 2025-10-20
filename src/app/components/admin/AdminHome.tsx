import Image from "next/image";
import { useTranslations } from "next-intl";

import Editor from "@/app/components/admin/Editor";
import { Input } from "@/app/components/common/Input";
import { Label } from "@/app/components/common/Label";
import { useHome } from "@/hooks/useHome";

interface Props {
  userid: string;
}
export default function AdminHome({ userid }: Props) {
  const tAdmin = useTranslations("admin");
  const { homeData, mutateUploadImg } = useHome(userid);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    mutateUploadImg({ userid, file });
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
        {homeData?.img && (
          <Image
            src={homeData.img}
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
