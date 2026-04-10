import PolicyEn from "./PolicyEn";
import PolicyKo from "./PolicyKo";

export default function PolicyPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  return (
    <div className="flex flex-col items-center">
      {locale === "en" ? <PolicyEn /> : <PolicyKo />}
    </div>
  );
}
