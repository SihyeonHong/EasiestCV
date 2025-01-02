import AdminEditor from "./AdminEditor";
import { useHome } from "@/hooks/useHome";
import Image from "next/image";

interface Props {
  userid: string;
}
export default function AdminHome({ userid }: Props) {
  const { homeData, uploadImg } = useHome(userid);

  return (
    <div className="flex flex-col gap-6 md:flex-row">
      <div className="flex flex-1 flex-col gap-2">
        <h5>프로필 사진 첨부</h5>
        <input type="file" accept="image/*" onChange={uploadImg} />
        {homeData.img && (
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
      <AdminEditor userid={userid} tid={0} />
    </div>
  );
}
