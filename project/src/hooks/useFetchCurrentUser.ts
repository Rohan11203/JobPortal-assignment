// src/hooks/useAuth.ts
import { useEffect } from "react";
import axios from "axios";
import { useStore } from "../store";

export function useFetchCurrentUser() {
  const setCurrentUser = useStore((s) => s.setCurrentUser);

  useEffect(() => {
    axios
      .get("https://jobportal-assignment.onrender.com/api/v1/users/")
      .then((res) => {
        setCurrentUser(res.data.response);
      })
      .catch(() => {
        console.log("Error is useFetchHook");
      });
  }, [setCurrentUser]);
}
