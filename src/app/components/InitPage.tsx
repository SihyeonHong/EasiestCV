"use client";

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
import { Label } from "@/app/components/common/Label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/components/common/Tabs";
import useAuth from "@/hooks/useAuth";
import { useResetPassword } from "@/hooks/useResetPW";

export default function InitPage() {
  const t = useTranslations("initpage");
  const [showResetForm, setShowResetForm] = useState(false);
  const [loginData, setLoginData] = useState({
    userid: "",
    password: "",
  });
  const [resetData, setResetData] = useState({
    userid: "",
    email: "",
  });
  const [signupData, setSignupData] = useState({
    userid: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const passwordsMatch = () => {
    return signupData.password && signupData.confirmPassword
      ? signupData.password === signupData.confirmPassword
      : null;
  };

  const { login, signup } = useAuth();
  const { resetPassword } = useResetPassword();

  const handleLogin = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    login(loginData);
  };

  const handleSignup = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (signupData.password !== signupData.confirmPassword) {
      alert(t("passwordMismatch"));
      return;
    }
    signup(signupData);
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
            <form onSubmit={handleReset}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Input
                    id="userid"
                    type="text"
                    placeholder={t("idPlaceholder")}
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
                    placeholder={t("emailPlaceholder")}
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
            <form onSubmit={handleSignup}>
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
                      value={signupData.userid}
                      onChange={(e) =>
                        setSignupData((prev) => ({
                          ...prev,
                          userid: e.target.value,
                        }))
                      }
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
                    value={signupData.username}
                    onChange={(e) =>
                      setSignupData((prev) => ({
                        ...prev,
                        username: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="email">{t("email")}</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder={t("emailPlaceholder")}
                    required
                    value={signupData.email}
                    onChange={(e) =>
                      setSignupData((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
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
                    value={signupData.password}
                    onChange={(e) =>
                      setSignupData((prev) => ({
                        ...prev,
                        password: e.target.value,
                      }))
                    }
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
                    value={signupData.confirmPassword}
                    onChange={(e) =>
                      setSignupData((prev) => ({
                        ...prev,
                        confirmPassword: e.target.value,
                      }))
                    }
                    className={`${
                      signupData.confirmPassword
                        ? passwordsMatch()
                          ? "border-green-500 focus-visible:ring-green-500" // 일치할 때 초록색
                          : "border-red-500 focus-visible:ring-red-500" // 불일치할 때 빨간색
                        : ""
                    }`}
                  />
                  {/* 비밀번호가 일치하지 않을 때 에러 메시지 표시 */}
                  {signupData.confirmPassword && !passwordsMatch() && (
                    <p className="mt-1 text-sm text-red-500">
                      {t("passwordMismatch")}
                    </p>
                  )}
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
