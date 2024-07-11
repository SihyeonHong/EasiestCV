import { useEffect, useState } from "react";
import { User } from "../models/user.model";
import { fetchUser } from "../api/user.api";

export const useUser = (userid: string) => {
  const [user, setUser] = useState<User>();
  const [isUserExist, setIsUserExist] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser(userid).then((data) => {
      if (data) {
        setUser(data);
        setIsUserExist(true);
      }
      setLoading(false);
    });
  }, [userid]);

  return { user, isUserExist, loading };
};
