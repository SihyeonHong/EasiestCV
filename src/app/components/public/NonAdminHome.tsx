import { useHome } from "@/hooks/useHome";
import Image from "next/image";
import LoadingPage from "@/app/components/LoadingPage";

interface Props {
  userid: string;
}

export default function NonAdminHome({ userid }: Props) {
  const { homeData } = useHome(userid);

  if (!homeData) return <LoadingPage />;

  return (
    <div className="flex flex-1 flex-col gap-5 md:flex-row">
      {homeData.img && (
        <div className="flex-1">
          <Image
            src={homeData.img}
            alt="profile-img"
            width={0}
            height={0}
            sizes="100%"
            className="h-auto w-full object-cover"
            priority
          />
        </div>
      )}
      <div
        className="flex-1 md:w-auto"
        dangerouslySetInnerHTML={{ __html: homeData.intro ?? "" }}
      />
    </div>
  );
}
