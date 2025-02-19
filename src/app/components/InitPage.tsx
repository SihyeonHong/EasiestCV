"use client";

import { useState, FormEvent } from "react";
import { useTranslations } from "next-intl";

import { Button } from "@/app/components/common/Button";
import { Input } from "@/app/components/common/Input";
import { Label } from "@/app/components/common/Label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/app/components/common/Card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/components/common/Tabs";
import useAuth from "@/hooks/useAuth";

export default function InitPage() {
  const t = useTranslations("initpage");
  const [showResetForm, setShowResetForm] = useState(false);
  const [loginData, setLoginData] = useState({
    userid: "",
    password: "",
  });

  const { login } = useAuth();

  const handleLogin = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    login(loginData);
  };

  return (
    <Tabs defaultValue="login" className="w-[400px]">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="login">{t("login")}</TabsTrigger>
        <TabsTrigger value="signup">{t("signup")}</TabsTrigger>
      </TabsList>
      <TabsContent value="login">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{t("login")}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Input
                    id="userid"
                    type="text"
                    placeholder={t("idPlaceholder")}
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
                    placeholder={t("passwordPlaceholder")}
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
                <Button type="submit" className="w-full">
                  {t("login")}
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter>
            <button
              onClick={() => setShowResetForm(!showResetForm)}
              className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
            >
              {t("showResetForm")}
            </button>
          </CardFooter>
          <CardContent className={showResetForm ? "" : "hidden"}>
            <form>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Input
                    id="userid"
                    type="userid"
                    placeholder={t("idPlaceholder")}
                    required
                  />
                  <Input
                    id="email"
                    type="email"
                    placeholder={t("emailPlaceholder")}
                    required
                  />
                </div>
                <CardDescription>{t("description")}</CardDescription>
                <Button type="submit" className="w-full">
                  {t("resetPW")}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="signup">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{t("signup")}</CardTitle>
          </CardHeader>
          <CardContent>
            <form>
              <div className="flex flex-col gap-6">
                <div className="space-y-1">
                  <Label htmlFor="userid">Your ID</Label>
                  <div className="flex items-center">
                    <span className="whitespace-nowrap text-sm">
                      https://easiest-cv.com/
                    </span>
                    <Input
                      id="userid"
                      type="text"
                      placeholder={t("idPlaceholder")}
                      className="ml-2"
                      required
                    />
                  </div>
                  <CardDescription className="">
                    {t("signupIdDescription")}
                  </CardDescription>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="username">{t("name")}</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder={t("namePlaceholder")}
                    required
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="email">{t("email")}</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder={t("emailPlaceholder")}
                    required
                  />
                  <CardDescription>
                    {t("signupEmailDescription")}
                  </CardDescription>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="password">{t("password")}</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder={t("passwordPlaceholder")}
                    required
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="confirmPassword">
                    {t("comfirmPassword")}
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder={t("comfirmPasswordPlaceholder")}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  {t("signup")}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
