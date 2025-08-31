import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState, FormEvent } from "react";

import { Button } from "@/app/components/common/Button";
import {
  CardContent,
  CardDescription,
  CardFooter,
} from "@/app/components/common/Card";
import { Input } from "@/app/components/common/Input";
import { useResetPassword } from "@/hooks/useResetPW";
import { Locale } from "@/i18n/routing";

export default function PWResetCard() {
  const localeParams = useParams().locale as string;
  const locale: Locale = ["ko", "en"].includes(localeParams)
    ? (localeParams as Locale)
    : "en";
  const tPlaceholder = useTranslations("placeholder");
  const tResetPW = useTranslations("resetPassword");

  const [resetData, setResetData] = useState({
    userid: "",
    email: "",
  });
  const [showResetForm, setShowResetForm] = useState(false);

  const { resetPassword } = useResetPassword();

  const handleReset = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    resetPassword(
      { userid: resetData.userid, email: resetData.email, locale: locale },
      {
        onSuccess: () => {
          setResetData({ userid: "", email: "" });
          setShowResetForm(false);
        },
      },
    );
  };

  return (
    <div>
      <CardFooter>
        <button
          onClick={() => setShowResetForm(!showResetForm)}
          className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
        >
          {tResetPW("showResetForm")}
        </button>
      </CardFooter>
      <CardContent className={showResetForm ? "" : "hidden"}>
        <form onSubmit={handleReset}>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Input
                id="userid"
                type="text"
                placeholder={tPlaceholder("idPlaceholder")}
                required
                value={resetData.userid}
                onChange={(e) =>
                  setResetData((prev) => ({
                    ...prev,
                    userid: e.target.value,
                  }))
                }
              />
              <Input
                id="email"
                type="email"
                placeholder={tPlaceholder("emailPlaceholder")}
                required
                value={resetData.email}
                onChange={(e) =>
                  setResetData((prev) => ({
                    ...prev,
                    email: e.target.value,
                  }))
                }
              />
            </div>
            <CardDescription>{tResetPW("description")}</CardDescription>
            <Button type="submit" className="w-full">
              {tResetPW("resetPW")}
            </Button>
          </div>
        </form>
      </CardContent>
    </div>
  );
}
