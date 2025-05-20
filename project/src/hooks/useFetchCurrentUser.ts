// src/hooks/useAuth.ts
import { useEffect } from "react";
import axios from "axios";
import { useStore } from "../store";

export function useFetchCurrentUser() {
  const setCurrentUser = useStore((s) => s.setCurrentUser);

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/v1/users/")
      .then((res) => {
        setCurrentUser(res.data.response);
      })
      .catch(() => {
        console.log("Error is useFetchHook");
      });
  }, [setCurrentUser]);
}
