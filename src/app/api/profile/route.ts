
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { ObjectId } from "mongodb";
import { auth, db, connectMongoDB } from "@/lib/auth";

export async function GET() {
  try {
    // Ensure MongoDB is connected before accessing the session.
    await connectMongoDB();

    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    const conditions: Record<string, unknown>[] = [
      { _id: userId },
      { id: userId },
    ];

    if (ObjectId.isValid(userId)) {
      conditions.push({ _id: new ObjectId(userId) });
    }

    const user = await db.collection("user").findOne(
      { $or: conditions },
      {
        projection: {
          name: 1,
          email: 1,
          image: 1,
          role: 1,
          subscriptionPlan: 1,
          emailVerified: 1,
        },
      }
    );

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      user: {
        name: user.name,
        email: user.email,
        image: user.image,
        role: user.role || "customer",
        subscriptionPlan: user.subscriptionPlan || "free",
        emailVerified: user.emailVerified,
      },
    });
  } catch (error) {
    console.error("Profile API error:", error);

    return NextResponse.json(
      { message: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}
