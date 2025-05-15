
import React from "react";
import Layout from "@/components/layout/Layout";
import LoginForm from "@/components/auth/LoginForm";

const Login: React.FC = () => {
  return (
    <Layout>
      <section className="py-12">
        <div className="container mx-auto px-6">
          <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8 border border-organic-100">
            <LoginForm />
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Login;
