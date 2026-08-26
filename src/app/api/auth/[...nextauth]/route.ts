import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

/**
 * Standard Next.js Route Handler for NextAuth.
 * It uses the authOptions imported from our library to manage the lifecycle.
 */
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };