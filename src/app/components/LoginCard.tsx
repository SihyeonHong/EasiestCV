import { Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState, FormEvent } from "react";

import { Button } from "@/app/components/common/Button";
import {
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/common/Card";
import { Input } from "@/app/components/common/Input";
import useLogin from "@/hooks/useLogin";

export default function LoginCard() {
  const tInitPage = useTranslations("initpage");
  const tPlaceholder = useTranslations("placeholder");
  const tButton = useTranslations("button");

  const searchParams = useSearchParams();
  const prefillId = searchParams.get("id") || "";
  const prefillPassword = searchParams.get("password") || "";

  const [loginData, setLoginData] = useState({
    userid: prefillId,
    password: prefillPassword,
  });

  const { login, isLoggingIn } = useLogin();

  const handleLogin = (e: FormEvent<HTMLFormElement>) => {
    sessionStorage.setItem("login_start", String(performance.now()));
    e.preventDefault();
    login(loginData);
  };

  return (
    <div>
      <CardHeader>
        <CardTitle className="text-2xl">{tInitPage("login")}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLogin}>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Input
                id="userid"
                type="text"
                placeholder={tPlaceholder("idPlaceholder")}
                required
                value={loginData.userid}
                onChange={(e) =>
                  setLoginData((prev) => ({
                    ...prev,
                    userid: e.target.value,
                  }))
                }
              />
              <Input
                id="password"
                type="password"
                placeholder={tPlaceholder("passwordPlaceholder")}
                required
                value={loginData.password}
                onChange={(e) =>
                  setLoginData((prev) => ({
                    ...prev,
                    password: e.target.value,
                  }))
                }
              />
            </div>
            {isLoggingIn ? (
              <Button disabled className="w-full">
                <Loader2 className="animate-spin" />
                {tButton("pending")}
              </Button>
            ) : (
              <Button type="submit" className="w-full">
                {tInitPage("login")}
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </div>
  );
}
