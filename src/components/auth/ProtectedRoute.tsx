
import { useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

interface ProtectedRouteProps {
  children?: React.ReactNode;
  requiredRole?: "farmer" | "consumer" | "any";
  allowUnauthenticated?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole = "any",
  allowUnauthenticated = false
}) => {
  const { isLoggedIn, isLoading, userRole } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!isLoading && !isLoggedIn && !allowUnauthenticated) {
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
  }, [isLoading, isLoggedIn, navigate, requiredRole, userRole, allowUnauthenticated]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-organic-500"></div>
      </div>
    );
  }

  // If not loading and either user is logged in with required role or page allows unauthenticated access
  if ((isLoggedIn && (requiredRole === "any" || requiredRole === userRole)) || allowUnauthenticated) {
    return children ? <>{children}</> : <Outlet />;
  }

  // This should never render as the useEffect should redirect
  return null;
};

export default ProtectedRoute;
