import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LogIn } from "lucide-react";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

type FormValues = z.infer<typeof formSchema>;

const LoginForm = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    setError(null);

    try {
      // For demo purposes - simulate successful login
      if (data.email === "demo@example.com" && data.password === "password") {
        // Create mock user data
        const userData = {
          userId: "demo-user-id",
          userName: "Demo User",
          token: "demo-token",
          isSubscriber: false,
        };

        // Store in localStorage
        localStorage.setItem("token", userData.token);
        localStorage.setItem("userId", userData.userId);
        localStorage.setItem("userName", userData.userName);
        localStorage.setItem("isSubscriber", "false");

        // Update auth context
        login(userData);

        // Redirect to subscription page
        navigate("/subscription");
        return;
      }

      // Actual API call
      const response = await fetch(
        "https://7cvccltb-3100.inc1.devtunnels.ms/api/users/signin",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: data.email,
            password: data.password,
          }),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Login failed");
      }

      // Store token and user info in localStorage
      localStorage.setItem("token", result.data[0].token);
      localStorage.setItem("userId", result.data[0].userId);
      localStorage.setItem("userName", result.data[0].userName);
      localStorage.setItem(
        "isSubscriber",
        result.data[0].isSubscriber.toString(),
      );
      localStorage.setItem(
        "subscriptionStartDate",
        result.data[0].subscriptionStartDate || "",
      );
      localStorage.setItem(
        "subscriptionValidTill",
        result.data[0].subscriptionValidTill || "",
      );

      // Update auth context
      const userData = {
        userId: result.data[0].userId,
        userName: result.data[0].userName,
        token: result.data[0].token,
        isSubscriber: result.data[0].isSubscriber,
        subscriptionStartDate: result.data[0].subscriptionStartDate,
        subscriptionValidTill: result.data[0].subscriptionValidTill,
      };

      // Use the login function from AuthContext
      login(userData);

      // Redirect to dashboard or subscription page based on subscription status
      if (userData.isSubscriber) {
        navigate("/");
      } else {
        navigate("/subscription");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An error occurred during login",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="your.email@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="text-sm text-gray-500 mb-2">
            <p>Demo credentials:</p>
            <p>Email: demo@example.com</p>
            <p>Password: password</p>
          </div>

          <Button
            type="submit"
            className="w-full bg-sky-600 hover:bg-sky-700"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Logging in...
              </span>
            ) : (
              <span className="flex items-center justify-center">
                <LogIn className="mr-2 h-4 w-4" /> Login
              </span>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default LoginForm;
