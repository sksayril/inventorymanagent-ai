import React from "react";
import { Link } from "react-router-dom";
import AuthLayout from "@/components/auth/AuthLayout";
import LoginForm from "@/components/auth/LoginForm";

const LoginPage = () => {
  return (
    <AuthLayout
      title="Login to Your Account"
      description="Enter your credentials to access your account"
      footer={
        <div className="text-center text-sm">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-sky-600 hover:underline font-medium"
          >
            Sign up
          </Link>
        </div>
      }
    >
      <LoginForm />
    </AuthLayout>
  );
};

export default LoginPage;
