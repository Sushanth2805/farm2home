
import React, { useState } from "react";
import Layout from "@/components/layout/Layout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import ProduceForm from "@/components/marketplace/ProduceForm";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const SellProduce: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { profile } = useAuth();

  const handleComplete = () => {
    toast({
      title: "Success",
      description: "Your produce has been listed for sale!",
    });
    navigate("/profile");
  };

  return (
    <ProtectedRoute>
      <Layout>
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold text-organic-900 mb-2">
                  Sell Your Produce
                </h1>
                <p className="text-organic-600">
                  List your fresh organic produce for sale on our marketplace.
                </p>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6 border border-organic-100">
                <ProduceForm 
                  onComplete={handleComplete}
                  defaultValues={{
                    location: profile?.location || "",
                  }}
                />
              </div>
            </div>
          </div>
        </section>
      </Layout>
    </ProtectedRoute>
  );
};

export default SellProduce;
