import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import { NextResponse } from "next/server";

export async function requireAdmin() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return {
      authorized: false,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    };
  }

  // Assuming role is available on session.user (configured in auth.ts callbacks)
  const role = (session.user as any).role;
  if (role !== "Admin" && role !== "Super Admin") {
    return {
      authorized: false,
      response: NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 })
    };
  }

  return {
    authorized: true,
    session
  };
}
