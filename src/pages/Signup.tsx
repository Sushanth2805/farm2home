
import React from "react";
import Layout from "@/components/layout/Layout";
import SignupForm from "@/components/auth/SignupForm";

const Signup: React.FC = () => {
  return (
    <Layout>
      <section className="py-12">
        <div className="container mx-auto px-6">
          <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8 border border-organic-100">
            <SignupForm />
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Signup;
