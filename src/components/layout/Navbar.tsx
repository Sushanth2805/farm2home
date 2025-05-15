
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Menu, X, ShoppingCart, User, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

type NavbarProps = {
  isLoggedIn: boolean;
  userRole?: string | null;
};

const Navbar: React.FC<NavbarProps> = ({ isLoggedIn, userRole }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account",
      });
      navigate("/");
    } catch (error) {
      toast({
        title: "Error logging out",
        description: "There was an error logging out. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-organic-100 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-organic-500 flex items-center justify-center">
            <span className="text-white font-bold text-xl">O</span>
          </div>
          <span className="font-bold text-xl text-organic-800">OrganicMart</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-organic-800 hover:text-organic-600 font-medium">
            Home
          </Link>
          <Link to="/browse" className="text-organic-800 hover:text-organic-600 font-medium">
            Browse Produce
          </Link>
          {isLoggedIn && (
            <Link to="/profile" className="text-organic-800 hover:text-organic-600 font-medium">
              Profile
            </Link>
          )}
          {isLoggedIn && userRole === "consumer" && (
            <Link to="/cart" className="text-organic-800 hover:text-organic-600 font-medium">
              <div className="relative">
                <ShoppingCart className="h-5 w-5" />
                {/* Cart count badge could go here */}
              </div>
            </Link>
          )}
        </nav>

        {/* Auth Buttons (Desktop) */}
        <div className="hidden md:flex items-center space-x-4">
          {isLoggedIn ? (
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          ) : (
            <>
              <Button variant="outline" asChild>
                <Link to="/login">Login</Link>
              </Button>
              <Button className="bg-organic-500 hover:bg-organic-600" asChild>
                <Link to="/signup">Sign Up</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-organic-800 focus:outline-none"
          onClick={toggleMenu}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-organic-100 px-4 py-3">
          <nav className="flex flex-col space-y-3">
            <Link
              to="/"
              className="flex items-center space-x-2 text-organic-800 py-2"
              onClick={toggleMenu}
            >
              <Home className="h-5 w-5" />
              <span>Home</span>
            </Link>
            <Link
              to="/browse"
              className="flex items-center space-x-2 text-organic-800 py-2"
              onClick={toggleMenu}
            >
              <span>Browse Produce</span>
            </Link>
            {isLoggedIn && (
              <Link
                to="/profile"
                className="flex items-center space-x-2 text-organic-800 py-2"
                onClick={toggleMenu}
              >
                <User className="h-5 w-5" />
                <span>Profile</span>
              </Link>
            )}
            {isLoggedIn && userRole === "consumer" && (
              <Link
                to="/cart"
                className="flex items-center space-x-2 text-organic-800 py-2"
                onClick={toggleMenu}
              >
                <ShoppingCart className="h-5 w-5" />
                <span>Cart</span>
              </Link>
            )}
            {isLoggedIn ? (
              <Button
                variant="outline"
                className="w-full justify-center"
                onClick={() => {
                  handleLogout();
                  toggleMenu();
                }}
              >
                Logout
              </Button>
            ) : (
              <div className="space-y-2 pt-2 border-t border-organic-100">
                <Button
                  variant="outline"
                  className="w-full justify-center"
                  asChild
                  onClick={toggleMenu}
                >
                  <Link to="/login">Login</Link>
                </Button>
                <Button
                  className="bg-organic-500 hover:bg-organic-600 w-full justify-center"
                  asChild
                  onClick={toggleMenu}
                >
                  <Link to="/signup">Sign Up</Link>
                </Button>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
