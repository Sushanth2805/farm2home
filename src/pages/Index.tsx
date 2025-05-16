
import React from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

const Index: React.FC = () => {
  const { isLoggedIn } = useAuth();

  return (
    <Layout>
      {/* Hero Section */}
      <section className="organic-hero py-20 md:py-32">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Connect with Organic Farmers</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
            Fresh, local and sustainable produce delivered directly from farmers to your table.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {!isLoggedIn ? (
              <>
                <Button size="lg" className="w-full sm:w-auto bg-organic-600 hover:bg-organic-700 text-white" asChild>
                  <Link to="/signup">Sign Up</Link>
                </Button>
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-organic-600 text-organic-700 hover:bg-organic-50" asChild>
                  <Link to="/login">Log In</Link>
                </Button>
              </>
            ) : (
              <Button size="lg" className="w-full sm:w-auto bg-organic-600 hover:bg-organic-700 text-white" asChild>
                <Link to="/browse">Browse Produce</Link>
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-organic-900 text-center mb-12">
            Why Choose Farm2Home?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-lg">
              <div className="bg-organic-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-organic-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-organic-800 mb-2">100% Organic</h3>
              <p className="text-organic-600">
                All produce is grown using organic farming practices, free from harmful pesticides and chemicals.
              </p>
            </div>

            <div className="text-center p-6 rounded-lg">
              <div className="bg-organic-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-organic-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-organic-800 mb-2">Support Local Farmers</h3>
              <p className="text-organic-600">
                Buy directly from farmers in your area and support local sustainable agriculture.
              </p>
            </div>

            <div className="text-center p-6 rounded-lg">
              <div className="bg-organic-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-organic-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-organic-800 mb-2">Fresh & Seasonal</h3>
              <p className="text-organic-600">
                Get access to the freshest seasonal produce, harvested at peak ripeness for optimal nutrition.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-organic-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-organic-900 text-center mb-12">
            How It Works
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                <span className="text-organic-600 text-2xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold text-organic-800 mb-2">Create an Account</h3>
              <p className="text-organic-600">
                Sign up as a consumer or farmer to get started.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                <span className="text-organic-600 text-2xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold text-organic-800 mb-2">Browse Produce</h3>
              <p className="text-organic-600">
                Explore fresh organic produce from local farmers.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                <span className="text-organic-600 text-2xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold text-organic-800 mb-2">Add to Cart</h3>
              <p className="text-organic-600">
                Select the items you want to purchase.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                <span className="text-organic-600 text-2xl font-bold">4</span>
              </div>
              <h3 className="text-xl font-semibold text-organic-800 mb-2">Place Order</h3>
              <p className="text-organic-600">
                Complete your purchase and enjoy fresh organic produce.
              </p>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Button size="lg" className="bg-organic-600 hover:bg-organic-700 text-white" asChild>
              <Link to="/browse">Browse Now</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-organic-900 text-center mb-12">
            What Our Users Say
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md border border-organic-100">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-organic-200 flex items-center justify-center mr-4">
                  <span className="text-organic-700 font-semibold">JD</span>
                </div>
                <div>
                  <h4 className="font-semibold text-organic-900">John Doe</h4>
                  <p className="text-organic-600 text-sm">Consumer</p>
                </div>
              </div>
              <p className="text-organic-700 italic">
                "I love being able to buy directly from local farmers. The produce is always fresh and the prices are fair."
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md border border-organic-100">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-organic-200 flex items-center justify-center mr-4">
                  <span className="text-organic-700 font-semibold">JS</span>
                </div>
                <div>
                  <h4 className="font-semibold text-organic-900">Jane Smith</h4>
                  <p className="text-organic-600 text-sm">Farmer</p>
                </div>
              </div>
              <p className="text-organic-700 italic">
                "As a small organic farmer, this platform has helped me reach more customers who appreciate sustainable agriculture."
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md border border-organic-100">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-organic-200 flex items-center justify-center mr-4">
                  <span className="text-organic-700 font-semibold">RJ</span>
                </div>
                <div>
                  <h4 className="font-semibold text-organic-900">Robert Johnson</h4>
                  <p className="text-organic-600 text-sm">Consumer</p>
                </div>
              </div>
              <p className="text-organic-700 italic">
                "The quality of produce I get through Farm2Home is exceptional. I can taste the difference compared to supermarket options."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-organic-600 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to eat healthier?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join our community of organic farmers and health-conscious consumers today.
          </p>
          <Button size="lg" variant="secondary" className="bg-white text-organic-700 hover:bg-organic-50" asChild>
            <Link to="/signup">Get Started</Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
