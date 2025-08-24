"use client";

import { AlertCircleIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState, FormEvent } from "react";

import { Button } from "@/app/components/common/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/common/Card";
import { Input } from "@/app/components/common/Input";
import { Label } from "@/app/components/common/Label";
import useSignUp from "@/hooks/useSignUp";
import { cn } from "@/utils/classname";
import { validateUserId } from "@/utils/validateUserId";

export default function SignUpCard() {
  const tInitPage = useTranslations("initpage");
  const tPlaceholder = useTranslations("placeholder");
  const tLabel = useTranslations("label");
  const tMessage = useTranslations("message");
  const tInvalidId = useTranslations("invalidId");

  const { signup } = useSignUp();

  const passwordsMatch = () => {
    return signupData.password && signupData.confirmPassword
      ? signupData.password === signupData.confirmPassword
      : null;
  };

  const [signupData, setSignupData] = useState({
    userid: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSignup = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (signupData.password !== signupData.confirmPassword) {
      alert(tMessage("passwordMismatch"));
      return;
    }
    signup(signupData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">{tInitPage("signup")}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSignup}>
          <div className="flex flex-col gap-6">
            <div className="space-y-1">
              <Label htmlFor="userid">Your ID</Label>
              <div className="relative flex items-center">
                <span className="mr-2 whitespace-nowrap text-sm">
                  https://easiest-cv.com/
                </span>
                <div className="relative flex-1">
                  <Input
                    id="userid"
                    type="text"
                    placeholder={tPlaceholder("idPlaceholder")}
                    className={cn(
                      `${
                        signupData.userid
                          ? validateUserId(signupData.userid) === "valid"
                            ? "border-green-500 focus-visible:ring-green-500"
                            : "border-red-500 focus-visible:ring-red-500"
                          : ""
                      }`,
                    )}
                    required
                    value={signupData.userid}
                    onChange={(e) =>
                      setSignupData((prev) => ({
                        ...prev,
                        userid: e.target.value,
                      }))
                    }
                  />
                  {signupData.userid &&
                    validateUserId(signupData.userid) !== "valid" && (
                      <div className="absolute bottom-[2rem] left-0 right-0 z-10 flex items-center gap-1 py-2 text-xs text-red-600">
                        <AlertCircleIcon className="h-4 w-4" />
                        <p>{tInvalidId(validateUserId(signupData.userid))}</p>
                      </div>
                    )}
                </div>
              </div>
              <CardDescription>
                {tInitPage("signupIdDescription")}
              </CardDescription>
            </div>
            <div className="space-y-1">
              <Label htmlFor="username">{tLabel("name")}</Label>
              <Input
                id="username"
                type="text"
                placeholder={tPlaceholder("namePlaceholder")}
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
              <Label htmlFor="email">{tLabel("email")}</Label>
              <Input
                id="email"
                type="email"
                placeholder={tPlaceholder("emailPlaceholder")}
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
                {tInitPage("signupEmailDescription")}
              </CardDescription>
            </div>
            <div className="space-y-1">
              <Label htmlFor="password">{tLabel("password")}</Label>
              <Input
                id="password"
                type="password"
                placeholder={tPlaceholder("passwordPlaceholder")}
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
                {tLabel("confirmPassword")}
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder={tPlaceholder("comfirmPasswordPlaceholder")}
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
                      ? "border-green-500 focus-visible:ring-green-500"
                      : "border-red-500 focus-visible:ring-red-500"
                    : ""
                }`}
              />
              {/* 비밀번호가 일치하지 않을 때 에러 메시지 표시 */}
              {signupData.confirmPassword && !passwordsMatch() && (
                <p className="mt-1 text-sm text-red-500">
                  {tMessage("passwordMismatch")}
                </p>
              )}
            </div>
            <Button type="submit" className="w-full">
              {tInitPage("signup")}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
