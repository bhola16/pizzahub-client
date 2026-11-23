import "server-only";
import { headers } from "next/headers";
import { auth } from "../auth";

export const getSession = async () => {
  return auth.api.getSession({
    headers: await headers(),
  });
};

export const getServerToken = async () => {
  const result = await auth.api.getToken({
    headers: await headers(),
  });

  return result.token;
};
