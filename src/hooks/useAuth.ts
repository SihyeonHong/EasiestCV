import { useState } from "react";
import { fetchLogin } from "../api/auth.api";
import { LoginForm } from "../models/user.model";

export default function useAuth() {
  const [loading, setLoading] = useState(false);

  const login = (data: LoginForm) => {
    setLoading(true);
    fetchLogin(data)
      .then((res) => {
        if (!res) return;
        sessionStorage.setItem("userid", res.data.userid);
        sessionStorage.setItem("token", res.data.token);

        window.location.href = `/${res.data.userid}/admin`;
      })
      .then(() => setLoading(false));
  };

  return { login, loading, setLoading };
}
