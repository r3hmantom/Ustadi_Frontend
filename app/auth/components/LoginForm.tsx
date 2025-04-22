"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginFormValues, loginSchema } from "./schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useEffect } from "react";
import { useAuthStore } from "@/lib/store/auth-store";

interface LoginFormProps {
  onFormError: (error: string | null) => void;
}

export function LoginForm({ onFormError }: LoginFormProps) {
  const { login, isLoading, error } = useAuthStore();
  
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      remember: false
    }
  });

  useEffect(() => {
    if (error) {
      onFormError(error);
    }
  }, [error, onFormError]);

  const onSubmit = async (data: LoginFormValues) => {
    onFormError(null);
    try {
      await login(data.email, data.password);
    } catch (error) {
      // Error is handled by the store
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email" 
            type="email" 
            placeholder="you@example.com" 
            {...register("email")} 
            aria-invalid={errors.email ? "true" : "false"}
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>
        <div className="grid gap-3">
          <Label htmlFor="password">Password</Label>
          <Input 
            id="password" 
            type="password" 
            placeholder="••••••••" 
            {...register("password")}
            aria-invalid={errors.password ? "true" : "false"}
          />
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password.message}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Checkbox 
            id="remember"
            {...register("remember")}
          />
          <Label htmlFor="remember" className="text-sm font-medium">Remember me</Label>
        </div>
        <Button 
          type="submit" 
          className="text-lg font-bold py-5 w-full"
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Sign In"}
        </Button>
      </div>
    </form>
  );
}