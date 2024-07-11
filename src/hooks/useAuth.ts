import { fetchLogin } from "../api/auth.api";
import { LoginForm } from "../models/user.model";

export default function useAuth() {
  const login = (data: LoginForm) => {
    fetchLogin(data).then((res) => {
      if (!res) return;
      sessionStorage.setItem("userid", res.data.userid);
      sessionStorage.setItem("token", res.data.token);
      window.location.href = `/${res.data.userid}/admin`;
    });
  };

  return { login };
}
