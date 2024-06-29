import { fetchLogin } from "../api/auth.api";
import { User } from "../models/user.model";

export default function useAuth() {
  const login = (user: User) => {
    fetchLogin(user).then((res) => {
      if (!res) return;
      sessionStorage.setItem("userid", res.data.userid);
      sessionStorage.setItem("token", res.data.token);
      window.location.href = `/${res.data.userid}/admin`;
    });
  };
  return { login };
}
