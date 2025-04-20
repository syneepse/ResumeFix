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
import GoogleProvider from "next-auth/providers/google";

const authOptions = {
  session: {
    strategy: 'jwt' as const,
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
    encryption: false,
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    // async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
    //   // Redirect to home page on sign out

    //   if (url === `${baseUrl}/api/auth/signout`) {
    //     return baseUrl;
    //   }
    //   // Default: go to dashboard
    //   return `${baseUrl}/candidate/dashboard`;
    // },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST, authOptions };

