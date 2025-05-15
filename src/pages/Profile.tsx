import React, { useEffect, useState } from "react";
import Layout from "@/components/layout/Layout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import type { Profile as ProfileType, Produce, Order } from "@/lib/supabase";
import ProduceCard from "@/components/marketplace/ProduceCard";
import ProduceForm from "@/components/marketplace/ProduceForm";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

const profileSchema = z.object({
  full_name: z.string().min(2, {
    message: "Full name must be at least 2 characters",
  }),
  location: z.string().min(2, {
    message: "Location must be at least 2 characters",
  }),
  bio: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const Profile: React.FC = () => {
  const { profile, updateProfile, userRole } = useAuth();
  const { toast } = useToast();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isAddingProduce, setIsAddingProduce] = useState(false);
  const [editingProduceId, setEditingProduceId] = useState<number | null>(null);
  const [userProduce, setUserProduce] = useState<Produce[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Form setup
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: profile?.full_name || "",
      location: profile?.location || "",
      bio: profile?.bio || "",
    },
  });

  // Set form values when profile changes
  useEffect(() => {
    if (profile) {
      form.reset({
        full_name: profile.full_name || "",
        location: profile.location || "",
        bio: profile.bio || "",
      });
    }
  }, [profile, form]);

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
  }, [profile]);

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
  }, [profile, userRole, userProduce]);

  const onSubmitProfile = async (data: ProfileFormValues) => {
    await updateProfile(data);
    setIsEditingProfile(false);
  };

  const handleDeleteProduce = async (id: number) => {
    if (!confirm("Are you sure you want to delete this produce?")) return;
    
    try {
      const { error } = await supabase
        .from("produce")
        .delete()
        .eq("id", id);
        
      if (error) throw error;
      
      setUserProduce(userProduce.filter(p => p.id !== id));
      
      toast({
        title: "Produce deleted",
        description: "Your produce has been deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting produce:", error);
      toast({
        title: "Error",
        description: "Failed to delete produce",
        variant: "destructive",
      });
    }
  };

  const handleProduceFormComplete = async () => {
    setIsAddingProduce(false);
    setEditingProduceId(null);
    
    // Refresh the produce list
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
        console.error("Error refreshing produce:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Fix the issue with displaying consumer_id instead of buyer_id
  const displayCustomerId = (order: Order) => {
    return order.consumer_id || "Unknown"; 
  };

  // When handling produce items, make sure to use location from profile if not in produce
  const getProduceLocation = (produce: Produce, profileLocation: string = "") => {
    return produce.location || profileLocation || "";
  };

  return (
    <ProtectedRoute>
      <Layout>
        <section className="py-12">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-5xl mx-auto">
              {/* Profile Header */}
              <div className="bg-white rounded-lg shadow-md p-6 md:p-8 border border-organic-100 mb-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                  <div>
                    <h1 className="text-3xl font-bold text-organic-900">
                      {profile?.full_name || "Your Profile"}
                    </h1>
                    <p className="text-organic-600 mt-1 capitalize">
                      {profile?.role || "User"} Account
                    </p>
                  </div>
                  {!isEditingProfile && (
                    <Button
                      variant="outline"
                      className="mt-4 md:mt-0"
                      onClick={() => setIsEditingProfile(true)}
                    >
                      Edit Profile
                    </Button>
                  )}
                </div>

                {isEditingProfile ? (
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmitProfile)} className="space-y-6">
                      <FormField
                        control={form.control}
                        name="full_name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Your name"
                                {...field}
                                className="organic-input"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Location</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="City, State"
                                {...field}
                                className="organic-input"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="bio"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Bio</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Tell us about yourself..."
                                {...field}
                                className="organic-input min-h-[100px]"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="flex justify-end space-x-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsEditingProfile(false)}
                        >
                          Cancel
                        </Button>
                        <Button className="bg-organic-500 hover:bg-organic-600">
                          Save Changes
                        </Button>
                      </div>
                    </form>
                  </Form>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-organic-600">Location</h3>
                      <p className="mt-1">{profile?.location || "Not specified"}</p>
                    </div>
                    {profile?.bio && (
                      <div>
                        <h3 className="text-sm font-medium text-organic-600">About</h3>
                        <p className="mt-1">{profile.bio}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Tabs for different sections */}
              <Tabs defaultValue={userRole === "farmer" ? "produce" : "orders"}>
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
                    <div className="mb-6 flex justify-between items-center">
                      <h2 className="text-2xl font-bold text-organic-900">My Produce</h2>
                      <Button
                        className="bg-organic-500 hover:bg-organic-600"
                        onClick={() => setIsAddingProduce(true)}
                      >
                        Add New Produce
                      </Button>
                    </div>

                    {isLoading ? (
                      <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-organic-500"></div>
                      </div>
                    ) : userProduce.length === 0 ? (
                      <Card>
                        <CardHeader>
                          <CardTitle>No produce yet</CardTitle>
                          <CardDescription>
                            You haven't added any produce to your farm profile yet.
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <Button
                            className="bg-organic-500 hover:bg-organic-600"
                            onClick={() => setIsAddingProduce(true)}
                          >
                            Add Your First Produce
                          </Button>
                        </CardContent>
                      </Card>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {userProduce.map((produce) => (
                          <div key={produce.id} className="relative">
                            <ProduceCard produce={produce} />
                            <div className="absolute top-2 right-2 flex gap-2">
                              <Button
                                size="sm"
                                variant="secondary"
                                className="bg-white border border-organic-300 hover:bg-organic-50 text-organic-800"
                                onClick={() => setEditingProduceId(produce.id)}
                              >
                                Edit
                              </Button>
                              <Button
                                size="sm"
                                variant="secondary"
                                className="bg-white border border-red-300 hover:bg-red-50 text-red-600"
                                onClick={() => handleDeleteProduce(produce.id)}
                              >
                                Delete
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </TabsContent>
                )}

                <TabsContent value="orders">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-organic-900">
                      {userRole === "farmer" ? "Orders for My Produce" : "My Orders"}
                    </h2>
                  </div>

                  {isLoading ? (
                    <div className="flex justify-center py-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-organic-500"></div>
                    </div>
                  ) : orders.length === 0 ? (
                    <Card>
                      <CardHeader>
                        <CardTitle>No orders yet</CardTitle>
                        <CardDescription>
                          {userRole === "farmer"
                            ? "You haven't received any orders for your produce yet."
                            : "You haven't placed any orders yet."}
                        </CardDescription>
                      </CardHeader>
                      {userRole === "consumer" && (
                        <CardContent>
                          <Button
                            className="bg-organic-500 hover:bg-organic-600"
                            onClick={() => window.location.href = "/browse"}
                          >
                            Browse Produce
                          </Button>
                        </CardContent>
                      )}
                    </Card>
                  ) : (
                    <div className="overflow-x-auto rounded-lg border border-organic-100">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Order ID</TableHead>
                            {userRole === "farmer" && <TableHead>Customer</TableHead>}
                            <TableHead>Produce</TableHead>
                            <TableHead>Quantity</TableHead>
                            <TableHead>Total Price</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Date</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {orders.map((order) => (
                            <TableRow key={order.id}>
                              <TableCell className="font-medium">{order.id}</TableCell>
                              {userRole === "farmer" && (
                                <TableCell>
                                  {/* Handle the buyer/consumer display here without referencing the type */}
                                  {/* Display just the consumer ID for now, which we'll need to fix later */}
                                  {displayCustomerId(order)}
                                </TableCell>
                              )}
                              <TableCell>
                                {order.produce?.name || "Unknown"}
                              </TableCell>
                              <TableCell>{order.quantity}</TableCell>
                              <TableCell>${order.total_price.toFixed(2)}</TableCell>
                              <TableCell>
                                <span className="capitalize px-2 py-1 bg-organic-100 text-organic-800 rounded-full text-xs">
                                  {order.status}
                                </span>
                              </TableCell>
                              <TableCell>
                                {new Date(order.created_at).toLocaleDateString()}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </section>
        
        {/* ProduceForm Dialog */}
        <Dialog open={isAddingProduce} onOpenChange={setIsAddingProduce}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Produce</DialogTitle>
              <DialogDescription>
                Fill out the details for your new organic produce.
              </DialogDescription>
            </DialogHeader>
            <ProduceForm onComplete={handleProduceFormComplete} />
          </DialogContent>
        </Dialog>

        {/* Edit Produce Dialog */}
        <Dialog
          open={!!editingProduceId}
          onOpenChange={(open) => !open && setEditingProduceId(null)}
        >
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Produce</DialogTitle>
              <DialogDescription>
                Update the details for your produce.
              </DialogDescription>
            </DialogHeader>
            {editingProduceId && (
              <ProduceForm
                produceId={editingProduceId}
                defaultValues={
                  userProduce.find(p => p.id === editingProduceId) || undefined
                }
                onComplete={handleProduceFormComplete}
              />
            )}
          </DialogContent>
        </Dialog>
      </Layout>
    </ProtectedRoute>
  );
};

export default Profile;
