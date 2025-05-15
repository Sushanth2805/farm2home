
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "farmer" | "consumer" | "any";
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole = "any" 
}) => {
  const { isLoggedIn, isLoading, userRole } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      toast({
        title: "Authentication required",
        description: "Please log in to access this page",
      });
      navigate("/login", { 
        replace: true, 
        state: { from: window.location.pathname } 
      });
    } else if (!isLoading && isLoggedIn && requiredRole !== "any") {
      if (requiredRole !== userRole) {
        toast({
          title: "Access denied",
          description: `This page is only accessible to ${requiredRole}s`,
          variant: "destructive",
        });
        navigate("/", { replace: true });
      }
    }
  }, [isLoading, isLoggedIn, navigate, requiredRole, userRole]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-organic-500"></div>
      </div>
    );
  }

  // If not loading and user is logged in (and has required role if specified)
  if (isLoggedIn && (requiredRole === "any" || requiredRole === userRole)) {
    return <>{children}</>;
  }

  // This should never render as the useEffect should redirect
  return null;
};

export default ProtectedRoute;
