import Image from "next/image";
import { useTranslations } from "next-intl";

import EditorContainer from "@/app/components/admin/EditorContainer";
import SettingInHome from "@/app/components/admin/SettingInHome";
import AlertBanner from "@/app/components/common/AlertBanner";
import LoadingPage from "@/app/components/LoadingPage";
import { useHome } from "@/hooks/useHome";
import { cn } from "@/utils/classname";

interface Props {
  userid: string;
}

export default function AdminHome({ userid }: Props) {
  const tAlertBanner = useTranslations("alertBanner");
  const { userHome, isHomeLoading } = useHome(userid);

  return (
    <div className="flex flex-col gap-4 bg-background">
      <SettingInHome userid={userid} />
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
        <EditorContainer userid={userid} tid={0} />
        <AlertBanner message={tAlertBanner("bugAnnouncement")} />
      </div>
    </div>
  );
}
