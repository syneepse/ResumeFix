// import NextAuth from "next-auth";
// import GoogleProvider from "next-auth/providers/google";
// import { Session, DefaultSession } from "next-auth";
// import { JWT } from "next-auth/jwt";
// import { SessionStrategy } from "next-auth";

// // Extend the session type to include 'id'
// declare module "next-auth" {
//   interface Session {
//     user: {
//       id?: string;
//     } & DefaultSession["user"];
//   }
// }
import NextAuth from "next-auth";
import { authOptions } from "../authOptions";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

