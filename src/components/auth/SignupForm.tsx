
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const SignupForm: React.FC = () => {
  const { signInWithGoogle, isLoading } = useAuth();
  const [authLoading, setAuthLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setAuthLoading(true);
      await signInWithGoogle();
    } catch (error) {
      console.error("Google sign-in error:", error);
      toast.error("Google sign-in failed", {
        description: "Please try again later",
      });
    } finally {
      setAuthLoading(false);
    }
  };

  const isSubmitting = authLoading || isLoading;

  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-organic-900">Create Your Account</h1>
        <p className="text-organic-600 mt-1">
          Join our community of farmers and conscious consumers
        </p>
      </div>

      <Button
        type="button"
        className="w-full py-6 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 mb-6"
        onClick={handleGoogleSignIn}
        disabled={isSubmitting}
      >
        <div className="flex items-center justify-center">
          <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          {isSubmitting ? (
            <>
              <Loader2 className="ml-2 h-5 w-5 animate-spin" />
              Connecting...
            </>
          ) : (
            "Sign up with Google"
          )}
        </div>
      </Button>

      <div className="text-center mt-6">
        <p className="text-organic-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-organic-500 hover:text-organic-600 font-medium"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupForm;
