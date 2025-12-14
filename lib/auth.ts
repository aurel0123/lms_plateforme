import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { emailOTP } from "better-auth/plugins"
import { prisma } from "./db";
import { env } from "./env";
import { resend } from "./resend";
import { admin } from "better-auth/plugins"

// If your Prisma file is located elsewhere, you can change the path

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql", // or "mysql", "postgresql", ...etc
  }),
  socialProviders: {
    github: {
      clientId: env.AUTH_GITHUB_CLIENT_ID,
      clientSecret: env.AUTH_GITHUB_CLIENT_SECRET,
    },
  },
  plugins: [
    emailOTP({
      async sendVerificationOTP({ email, otp, type }) {
        const { data, error } = await resend.emails.send({
          from: 'KammLMS <no-reply@foodplus.space>',
          to: [email],
          subject: 'KammLMS - Verify  your email',
          html : `<p>Your otp is <strong>${otp}</strong> for ${type}</p>`
        });
      },
    }),
    admin()
  ],
});
