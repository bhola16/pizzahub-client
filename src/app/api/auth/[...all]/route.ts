import { auth, connectMongoDB } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

const handlers = toNextJsHandler(auth);

export async function GET(request: Request) {
  await connectMongoDB();
  return handlers.GET(request);
}

export async function POST(request: Request) {
  await connectMongoDB();
  return handlers.POST(request);
}
