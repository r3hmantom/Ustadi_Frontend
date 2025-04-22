"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterFormValues, registerSchema } from "./schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useEffect } from "react";
import { useAuthStore } from "@/lib/store/auth-store";

interface RegisterFormProps {
  onFormError: (error: string | null) => void;
}

export function RegisterForm({ onFormError }: RegisterFormProps) {
  const { register: registerUser, isLoading, error } = useAuthStore();
  
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      terms: false
    }
  });

  useEffect(() => {
    if (error) {
      onFormError(error);
    }
  }, [error, onFormError]);

  const onSubmit = async (data: RegisterFormValues) => {
    onFormError(null);
    try {
      await registerUser(data.name, data.email, data.password);
    } catch (error) {
      // Error is handled by the store
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="name">Full Name</Label>
          <Input 
            id="name" 
            type="text" 
            placeholder="John Doe" 
            {...register("name")} 
            aria-invalid={errors.name ? "true" : "false"}
          />
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>

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

        <div className="grid gap-3">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input 
            id="confirmPassword" 
            type="password" 
            placeholder="••••••••" 
            {...register("confirmPassword")}
            aria-invalid={errors.confirmPassword ? "true" : "false"}
          />
          {errors.confirmPassword && (
            <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Checkbox 
            id="terms"
            {...register("terms")}
          />
          <Label htmlFor="terms" className="text-sm font-medium">
            I agree to the Terms of Service and Privacy Policy
          </Label>
          {errors.terms && (
            <p className="text-sm text-red-500">{errors.terms.message}</p>
          )}
        </div>

        <Button 
          type="submit" 
          className="text-lg font-bold py-5 w-full"
          disabled={isLoading}
        >
          {isLoading ? "Creating Account..." : "Create Account"}
        </Button>
      </div>
    </form>
  );
}