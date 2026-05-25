"use client";

import { Headset } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

import { loginApiV1AuthLoginPost } from "@/client/sdk.gen";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await loginApiV1AuthLoginPost({
        body: { email, password },
      });

      if (res.error || !res.data) {
        const detail = (res.error as { detail?: string })?.detail;
        toast.error(detail || "Login failed");
        return;
      }

      // Set httpOnly cookies via server route
      await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: res.data.token, user: res.data.user }),
      });

      window.location.href = "/after-sign-in";
    } catch {
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-blue-600 to-indigo-700 p-4">
      <Card className="w-full max-w-md border-none shadow-2xl bg-white/95 backdrop-blur-sm dark:bg-slate-900/95">
        <CardHeader className="space-y-4 text-center pb-8">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-600/10">
            <Headset className="h-6 w-6 text-blue-600" />
          </div>
          <div className="space-y-2">
            <div className="text-4xl font-black tracking-tighter">
              <span className="text-slate-900 dark:text-white">Call</span>
              <span className="text-blue-600">Agent</span>
            </div>
            <CardDescription className="text-base font-medium">
              Professional Voice AI Dashboard
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-11"
              />
            </div>
            <Button type="submit" className="w-full h-11 text-base font-semibold bg-blue-600 hover:bg-blue-700" disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </form>
          <div className="mt-8 text-center text-sm text-muted-foreground font-medium">
            Don&apos;t have an account?{" "}
            <Link href="/auth/signup" className="font-bold text-blue-600 underline-offset-4 hover:underline">
              Create one now
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
