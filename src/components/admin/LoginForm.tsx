"use client";

import { useActionState } from "react";
import { Loader2, LogIn } from "lucide-react";
import { loginAction, type LoginState } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

const initialState: LoginState = { ok: false, message: "" };

export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  return (
    <form action={formAction} className="relative mt-8 space-y-4">
      <Field label="Email">
        <Input
          name="email"
          type="email"
          placeholder="admin@clevonext.dev"
          required
          autoComplete="email"
        />
      </Field>

      <Field label="Password">
        <Input
          name="password"
          type="password"
          placeholder="••••••••"
          required
          autoComplete="current-password"
        />
      </Field>

      {state.message ? (
        <p className={state.ok ? "text-xs text-emerald-400" : "text-xs text-destructive"}>
          {state.message}
        </p>
      ) : null}

      <Button type="submit" variant="accent" className="w-full" disabled={pending}>
        {pending ? <Loader2 className="size-4 animate-spin" /> : <LogIn className="size-4" />}
        Masuk ke Dashboard
      </Button>
    </form>
  );
}