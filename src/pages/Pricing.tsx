
import React from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const PricingCard = ({ 
  title, 
  price, 
  description, 
  features, 
  buttonText, 
  buttonLink, 
  highlighted = false 
}: { 
  title: string;
  price: string;
  description: string;
  features: string[];
  buttonText: string;
  buttonLink: string;
  highlighted?: boolean;
}) => (
  <div className={`rounded-lg border ${highlighted ? 'border-organic-500 shadow-lg' : 'border-organic-200'} p-6`}>
    <h3 className="text-xl font-bold text-organic-800 mb-2">{title}</h3>
    <div className="mb-4">
      <span className="text-3xl font-bold text-organic-900">{price}</span>
      {price !== 'Free' && <span className="text-organic-600 ml-1">/month</span>}
    </div>
    <p className="text-organic-600 mb-6">{description}</p>
    <ul className="mb-8 space-y-2">
      {features.map((feature, index) => (
        <li key={index} className="flex items-start">
          <Check className="h-5 w-5 text-organic-500 mr-2 mt-0.5" />
          <span className="text-organic-700">{feature}</span>
        </li>
      ))}
    </ul>
    <Button 
      asChild 
      className={`w-full ${highlighted ? 'bg-organic-500 hover:bg-organic-600' : 'bg-organic-100 text-organic-800 hover:bg-organic-200'}`}
      variant={highlighted ? "default" : "outline"}
    >
      <Link to={buttonLink}>{buttonText}</Link>
    </Button>
  </div>
);

const Pricing: React.FC = () => {
  const { isLoggedIn } = useAuth();
  const ctaLink = isLoggedIn ? "/profile" : "/signup";

  return (
    <Layout>
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-organic-900 mb-4">Transparent Pricing for Everyone</h1>
            <p className="text-xl text-organic-600 max-w-3xl mx-auto">
              Choose the plan that works best for you, whether you're a farmer looking to sell or a consumer seeking quality produce.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {/* Farmer Plans */}
            <div>
              <h2 className="text-2xl font-bold text-organic-800 mb-6 text-center">For Farmers</h2>
              <div className="space-y-8">
                <PricingCard
                  title="Basic Seller"
                  price="$49"
                  description="One-time onboarding fee to get started selling on our platform."
                  features={[
                    "Market visibility",
                    "Basic customer interaction tools",
                    "Standard logistics support",
                    "Seller dashboard",
                    "Up to 10 product listings"
                  ]}
                  buttonText={isLoggedIn ? "Upgrade Now" : "Get Started"}
                  buttonLink={ctaLink}
                />

                <PricingCard
                  title="Premium Seller"
                  price="$19"
                  description="Monthly subscription for serious farmers looking to grow their business."
                  features={[
                    "All Basic Seller features",
                    "Advanced analytics dashboard",
                    "Priority placement in search results",
                    "Unlimited product listings",
                    "Customer insights and reporting",
                    "Direct messaging with customers"
                  ]}
                  buttonText={isLoggedIn ? "Upgrade Now" : "Get Started"}
                  buttonLink={ctaLink}
                  highlighted={true}
                />
              </div>
            </div>

            {/* Consumer Plans */}
            <div>
              <h2 className="text-2xl font-bold text-organic-800 mb-6 text-center">For Consumers</h2>
              <div className="space-y-8">
                <PricingCard
                  title="Free Access"
                  price="Free"
                  description="Basic access to browse and purchase from our marketplace."
                  features={[
                    "Browse all available produce",
                    "Standard delivery options",
                    "Basic user profile",
                    "Purchase from any seller",
                    "Email support"
                  ]}
                  buttonText={isLoggedIn ? "Current Plan" : "Sign Up Free"}
                  buttonLink={ctaLink}
                />

                <PricingCard
                  title="Premium Consumer"
                  price="$9.99"
                  description="Enhanced shopping experience with exclusive benefits."
                  features={[
                    "Early access to new produce",
                    "Priority delivery scheduling",
                    "Exclusively connect with top-rated farmers",
                    "Quality assurance guarantee",
                    "Premium customer support",
                    "Special discounts and promotions"
                  ]}
                  buttonText={isLoggedIn ? "Upgrade Now" : "Get Started"}
                  buttonLink={ctaLink}
                  highlighted={true}
                />
              </div>
            </div>
          </div>

          <div className="bg-organic-50 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-organic-800 mb-4">Need a Custom Solution?</h2>
            <p className="text-organic-600 mb-6 max-w-2xl mx-auto">
              For larger farm operations or business customers with specific needs, we offer tailored solutions.
              Contact our team to discuss how we can support your unique requirements.
            </p>
            <Button size="lg" variant="outline" className="bg-white">
              Contact Sales
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Pricing;
