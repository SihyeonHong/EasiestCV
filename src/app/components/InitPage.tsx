"use client";

import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState, FormEvent } from "react";

import { Button } from "@/app/components/common/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/app/components/common/Card";
import { Input } from "@/app/components/common/Input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/components/common/Tabs";
import UsageGuide from "@/app/components/UsageGuide";
import useAuth from "@/hooks/useAuth";
import { useResetPassword } from "@/hooks/useResetPW";

import SignUpCard from "./SignUpCard";

export default function InitPage() {
  const tInitPage = useTranslations("initpage");
  const tPlaceholder = useTranslations("placeholder");
  const tResetPW = useTranslations("resetPassword");
  const tButton = useTranslations("button");

  const [showResetForm, setShowResetForm] = useState(false);
  const [loginData, setLoginData] = useState({
    userid: "",
    password: "",
  });
  const [resetData, setResetData] = useState({
    userid: "",
    email: "",
  });

  const { login, isLoggingIn } = useAuth();
  const { resetPassword } = useResetPassword();

  const handleLogin = (e: FormEvent<HTMLFormElement>) => {
    sessionStorage.setItem("login_start", String(performance.now()));
    e.preventDefault();
    login(loginData);
  };

  const handleReset = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    resetPassword(
      { userid: resetData.userid, email: resetData.email },
      {
        onSuccess: () => {
          setResetData({ userid: "", email: "" });
          setShowResetForm(false);
        },
      },
    );
  };

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-4 p-2 md:max-w-xl">
      <Tabs defaultValue="login" className="mx-0 w-full max-w-none md:mx-0">
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="login">{tInitPage("login")}</TabsTrigger>
          <TabsTrigger value="signup">{tInitPage("signup")}</TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <Card>
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
          </Card>
        </TabsContent>
        <TabsContent value="signup">
          <SignUpCard />
        </TabsContent>
      </Tabs>
      <UsageGuide />
    </div>
  );
}
