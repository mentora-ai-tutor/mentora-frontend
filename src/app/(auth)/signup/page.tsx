import type { Metadata } from "next";
import SignupForm from "@/components/auth/SignupForm";

export const metadata: Metadata = {
  title: "Create Account",
  description:
    "Join Mentora and start your AI-powered learning journey. Personalised assessments, knowledge gap analysis and peer collaboration.",
};

export default function SignupPage() {
  return <SignupForm />;
}
