import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import {createGuest, getGuest} from "@/app/_lib/data-service";

const authConfig = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    })
  ],
  callbacks: {
    authorized({auth, request}) {
      return !!auth?.user
    },
    async signIn({user, account, profile}) {
      try {
        const existingGuest = await getGuest(user.email)

        if (!existingGuest)
          await createGuest({email: user.email, fullName: user.name})

        return true;
      } catch {
        return false;
      }
    },
    async session({session, user}) {
      const guest = await getGuest(session.user.email)
      session.user.guestId = guest.id
      return session;
    }
  },
  pages: {
    signIn: "/login"
  }
}

export const {
  auth,
  handlers: {GET, POST},
  signIn,
  signOut,
} = NextAuth(authConfig);