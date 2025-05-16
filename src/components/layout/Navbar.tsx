
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Package, LogOut, ClipboardList, ShoppingBasket } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Navbar: React.FC = () => {
  const { isLoggedIn, signOut } = useAuth();
  const { cartCount } = useCart();
  const { toast } = useToast();
  const location = useLocation();

  const handleLogout = async () => {
    await signOut();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  // Helper function to determine if a link is active
  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-white border-b border-organic-100">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-organic-500 text-white flex items-center justify-center rounded-md">
              <Package size={20} />
            </div>
            <span className="text-xl font-bold text-organic-900">Farm2Home</span>
          </Link>

          <nav className="flex items-center space-x-6">
            <Link 
              to="/" 
              className={`transition-colors ${isActive('/') ? 'text-organic-600 font-medium' : 'text-organic-800 hover:text-organic-600'}`}
            >
              Home
            </Link>
            <Link 
              to="/browse" 
              className={`transition-colors ${isActive('/browse') ? 'text-organic-600 font-medium' : 'text-organic-800 hover:text-organic-600'}`}
            >
              Browse Produce
            </Link>
            {isLoggedIn && (
              <>
                <Link 
                  to="/profile" 
                  className={`transition-colors ${isActive('/profile') ? 'text-organic-600 font-medium' : 'text-organic-800 hover:text-organic-600'}`}
                >
                  Profile
                </Link>
                <Link 
                  to="/profile"
                  className={`transition-colors rounded-full bg-organic-50 px-3 py-1 text-organic-600 hover:bg-organic-100 flex items-center space-x-1`}
                >
                  <ClipboardList size={16} />
                  <span>My Orders</span>
                </Link>
                <Link 
                  to="/profile?tab=produce"
                  className={`transition-colors rounded-full bg-organic-50 px-3 py-1 text-organic-600 hover:bg-organic-100 flex items-center space-x-1`}
                >
                  <ShoppingBasket size={16} />
                  <span>My Products</span>
                </Link>
                <Link 
                  to="/sell" 
                  className="bg-organic-500 hover:bg-organic-600 text-white px-4 py-2 rounded-md transition-colors"
                >
                  Sell Produce
                </Link>
              </>
            )}
          </nav>

          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                <Link to="/cart" className="relative">
                  <ShoppingBag className="h-6 w-6 text-organic-800" />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-organic-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Link>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={handleLogout}
                  aria-label="Logout"
                >
                  <LogOut className="h-5 w-5 text-organic-800" />
                </Button>
              </>
            ) : (
              <div className="space-x-2">
                <Button asChild variant="outline">
                  <Link to="/login">Log In</Link>
                </Button>
                <Button asChild>
                  <Link to="/signup">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
