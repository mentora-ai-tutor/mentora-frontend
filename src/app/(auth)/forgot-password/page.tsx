import type { Metadata } from "next";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Reset Password",
  description:
    "Reset your Mentora account password. Enter your email and we'll send you a verification code.",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
