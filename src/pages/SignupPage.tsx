import React from "react";
import { Link } from "react-router-dom";
import AuthLayout from "@/components/auth/AuthLayout";
import SignupForm from "@/components/auth/SignupForm";

const SignupPage = () => {
  return (
    <AuthLayout
      title="Create an Account"
      description="Sign up to get started with our inventory system"
      footer={
        <div className="text-center text-sm">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-sky-600 hover:underline font-medium"
          >
            Login
          </Link>
        </div>
      }
    >
      <SignupForm />
    </AuthLayout>
  );
};

export default SignupPage;
