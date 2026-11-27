import "server-only";
import { headers } from "next/headers";
import { auth, connectMongoDB } from "../auth";

export const getSession = async () => {
  await connectMongoDB();

  return auth.api.getSession({
    headers: await headers(),
  });
};

export const getServerToken = async () => {
  await connectMongoDB();

  const result = await auth.api.getToken({
    headers: await headers(),
  });

  return result.token;
};
