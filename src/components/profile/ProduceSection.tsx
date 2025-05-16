
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import ProduceCard from "@/components/marketplace/ProduceCard";
import ProduceForm from "@/components/marketplace/ProduceForm";
import type { Produce, Profile } from "@/lib/supabase";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle } from "lucide-react";

interface ProduceSectionProps {
  userProduce: Produce[];
  setUserProduce: React.Dispatch<React.SetStateAction<Produce[]>>;
  profile: Profile | null;
  isLoading: boolean;
}

const ProduceSection: React.FC<ProduceSectionProps> = ({
  userProduce,
  setUserProduce,
  profile,
  isLoading,
}) => {
  const { toast } = useToast();
  const [isAddingProduce, setIsAddingProduce] = useState(false);
  const [editingProduceId, setEditingProduceId] = useState<number | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleDeleteProduce = async (id: number) => {
    if (!confirm("Are you sure you want to delete this produce?")) return;
    
    setDeleteError(null);
    
    try {
      // First check if this produce is referenced in any orders
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .select("id")
        .eq("produce_id", id)
        .limit(1);
        
      if (orderError) throw orderError;
      
      // If we have orders using this produce, show an error
      if (orderData && orderData.length > 0) {
        setDeleteError("Cannot delete produce that has existing orders. This would break order history for customers.");
        toast({
          title: "Unable to delete",
          description: "This produce has existing orders and cannot be deleted.",
          variant: "destructive",
        });
        return;
      }
      
      // If no orders reference this produce, proceed with deletion
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
      setDeleteError("Failed to delete produce. It may be referenced in orders or another error occurred.");
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
      }
    }
  };

  const dismissError = () => {
    setDeleteError(null);
  };

  return (
    <>
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-organic-900">My Produce</h2>
        <Button
          className="bg-organic-500 hover:bg-organic-600"
          onClick={() => setIsAddingProduce(true)}
        >
          Add New Produce
        </Button>
      </div>

      {deleteError && (
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription className="flex justify-between items-center">
            <span>{deleteError}</span>
            <Button variant="outline" size="sm" onClick={dismissError}>Dismiss</Button>
          </AlertDescription>
        </Alert>
      )}

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
    </>
  );
};

export default ProduceSection;
