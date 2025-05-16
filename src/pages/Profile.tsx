
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import type { Produce, Order } from "@/lib/supabase";

// Import refactored components
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProduceSection from "@/components/profile/ProduceSection";
import OrdersSection from "@/components/profile/OrdersSection";

const Profile: React.FC = () => {
  const location = useLocation();
  const { profile, updateProfile, userRole } = useAuth();
  const { toast } = useToast();
  const [userProduce, setUserProduce] = useState<Produce[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Parse URL query parameters to get tab
  const queryParams = new URLSearchParams(location.search);
  const tabFromUrl = queryParams.get("tab");
  const defaultTab = userRole === "farmer" ? (tabFromUrl || "produce") : "orders";

  // Fetch user's produce
  useEffect(() => {
    const fetchUserProduce = async () => {
      if (profile) {
        setIsLoading(true);
        try {
          const { data, error } = await supabase
            .from("produce")
            .select("*")
            .eq("farmer_id", profile.id);

          if (error) throw error;
          
          // Ensure all required fields are present
          const producesWithLocation = (data || []).map(item => ({
            ...item,
            location: item.location || profile.location || ""
          }));
          
          setUserProduce(producesWithLocation as Produce[]);
        } catch (error) {
          console.error("Error fetching produce:", error);
          toast({
            title: "Error",
            description: "Failed to load your produce",
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchUserProduce();
  }, [profile, toast]);

  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      if (!profile) return;
      
      setIsLoading(true);
      
      try {
        let query;
        
        if (userRole === "admin" || userRole === "farmer") {
          // Farmers and admins see orders for their produce
          query = supabase.from("orders").select(`
            id, quantity, total_price, status, created_at, consumer_id, produce_id,
            produce:produce_id(id, name, price, description, location)
          `).in("produce_id", userProduce.map(p => p.id));
        } else {
          // Regular users see their own orders
          query = supabase.from("orders").select(`
            id, quantity, total_price, status, created_at, consumer_id, produce_id,
            produce:produce_id(id, name, price, description, location)
          `).eq("consumer_id", profile.id);
        }
        
        const { data, error } = await query;
        
        if (error) throw error;
        
        // Use a type assertion
        setOrders(data as unknown as Order[]);
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast({
          title: "Error",
          description: "Failed to load orders",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    // Only fetch orders if we have profile data
    if (profile) {
      fetchOrders();
    }
  }, [profile, userRole, userProduce, toast]);

  return (
    <ProtectedRoute>
      <Layout>
        <section className="py-12">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-5xl mx-auto">
              {/* Profile Header - refactored to its own component */}
              <ProfileHeader 
                profile={profile}
                updateProfile={updateProfile}
              />

              {/* Tabs for different sections */}
              <Tabs defaultValue={defaultTab}>
                <TabsList className="mb-8">
                  {userRole === "farmer" && (
                    <TabsTrigger value="produce">My Produce</TabsTrigger>
                  )}
                  <TabsTrigger value="orders">
                    {userRole === "farmer" ? "Orders for My Produce" : "My Orders"}
                  </TabsTrigger>
                </TabsList>

                {userRole === "farmer" && (
                  <TabsContent value="produce">
                    <ProduceSection
                      userProduce={userProduce}
                      setUserProduce={setUserProduce}
                      profile={profile}
                      isLoading={isLoading}
                    />
                  </TabsContent>
                )}

                <TabsContent value="orders">
                  <OrdersSection 
                    orders={orders}
                    isLoading={isLoading}
                    userRole={userRole}
                  />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </section>
      </Layout>
    </ProtectedRoute>
  );
};

export default Profile;
