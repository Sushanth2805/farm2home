
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { FcGoogle } from "react-icons/fc";

const LoginForm: React.FC = () => {
  const { signInWithGoogle, isLoading } = useAuth();

  const handleGoogleSignIn = async () => {
    await signInWithGoogle();
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-organic-900 mb-2">Welcome Back</h1>
        <p className="text-organic-700">Log in to continue to OrganicMart</p>
      </div>
      
      <div className="space-y-6">
        <Button 
          type="button" 
          variant="outline"
          className="w-full flex items-center justify-center gap-2 h-12"
          disabled={isLoading}
          onClick={handleGoogleSignIn}
        >
          <FcGoogle className="w-5 h-5" />
          <span>{isLoading ? "Logging in..." : "Sign in with Google"}</span>
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-organic-200"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="px-2 bg-white text-organic-500">OrganicMart</span>
          </div>
        </div>
      </div>

      <div className="mt-6 text-center">
        <p className="text-organic-800">
          New to OrganicMart?{" "}
          <Link to="/" className="text-organic-600 hover:text-organic-700 font-medium">
            Go back to the homepage
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
