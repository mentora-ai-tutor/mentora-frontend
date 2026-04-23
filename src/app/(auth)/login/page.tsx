import type { Metadata } from "next";
import LoginForm from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Sign In",
  description:
    "Sign in to your Mentora account to access AI-powered personalised learning, assessments and peer collaboration.",
};

export default function LoginPage() {
  return <LoginForm />;
}
