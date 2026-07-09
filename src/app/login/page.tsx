import { redirect } from "next/navigation";

// This page immediately redirects to the Scalekit OAuth flow.
// No intermediate "Welcome back" UI is shown.
export default function LoginPage() {
  redirect("/api/auth/login");
}
