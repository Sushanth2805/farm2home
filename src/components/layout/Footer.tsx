
import React from "react";
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
  return (
    <footer className="mt-auto bg-organic-50 border-t border-organic-100">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-organic-500 flex items-center justify-center">
                <span className="text-white font-bold text-xl">O</span>
              </div>
              <span className="font-bold text-xl text-organic-800">OrganicMart</span>
            </Link>
            <p className="mt-4 text-organic-700">
              Connecting organic farmers with health-conscious consumers. Fresh, local, and sustainable.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg text-organic-800 mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-organic-700 hover:text-organic-600">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/browse" className="text-organic-700 hover:text-organic-600">
                  Browse Produce
                </Link>
              </li>
              <li>
                <Link to="/signup" className="text-organic-700 hover:text-organic-600">
                  Create Account
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg text-organic-800 mb-4">Contact</h3>
            <p className="text-organic-700">
              Have questions? <br />
              Email: info@organicmart.com <br />
              Phone: (123) 456-7890
            </p>
            <div className="mt-4 flex space-x-4">
              {/* Social media icons could go here */}
              <span className="w-8 h-8 rounded-full bg-organic-200 flex items-center justify-center">
                <span className="text-organic-700">F</span>
              </span>
              <span className="w-8 h-8 rounded-full bg-organic-200 flex items-center justify-center">
                <span className="text-organic-700">T</span>
              </span>
              <span className="w-8 h-8 rounded-full bg-organic-200 flex items-center justify-center">
                <span className="text-organic-700">I</span>
              </span>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-organic-200 text-center text-organic-600 text-sm">
          <p>© {new Date().getFullYear()} OrganicMart. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
