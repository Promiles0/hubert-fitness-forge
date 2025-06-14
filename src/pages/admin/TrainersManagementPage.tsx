
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Mail, Phone, Star } from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Label } from "@/components/ui/label";
import AddTrainerDialog from "@/components/admin/AddTrainerDialog";
import EditTrainerDialog from "@/components/admin/EditTrainerDialog";
import { Database } from "@/integrations/supabase/types";

type TrainerSpecialty = Database["public"]["Enums"]["trainer_specialty"];

interface Trainer {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  bio?: string;
  hourly_rate?: number;
  photo_url?: string;
  specialties: TrainerSpecialty[];
  is_active: boolean;
  experience_years?: number;
}

const TrainersManagementPage = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedTrainer, setSelectedTrainer] = useState<Trainer | null>(null);
  const queryClient = useQueryClient();

  const { data: trainers, isLoading } = useQuery({
    queryKey: ['trainers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('trainers')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Trainer[];
    },
  });

  const deleteTrainerMutation = useMutation({
    mutationFn: async (trainerId: string) => {
      const { error } = await supabase
        .from('trainers')
        .delete()
        .eq('id', trainerId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trainers'] });
      toast({
        title: "Success",
        description: "Trainer deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete trainer: " + error.message,
        variant: "destructive",
      });
    }
  });

  const handleEditTrainer = (trainer: Trainer) => {
    setSelectedTrainer(trainer);
    setIsEditDialogOpen(true);
  };

  if (isLoading) {
    return <LoadingSpinner size={40} className="min-h-screen flex items-center justify-center" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Trainers Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your fitness trainers and instructors
          </p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)} className="bg-fitness-red hover:bg-red-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Trainer
        </Button>
      </div>

      {/* Trainers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trainers?.map((trainer) => (
          <Card key={trainer.id} className="overflow-hidden">
            <div className="relative">
              <div className="h-48 bg-gradient-to-br from-fitness-red to-red-700">
                {trainer.photo_url && (
                  <img
                    src={trainer.photo_url}
                    alt={`${trainer.first_name} ${trainer.last_name}`}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div className="absolute bottom-4 left-4">
                <Avatar className="h-16 w-16 border-4 border-white">
                  <AvatarImage src={trainer.photo_url} />
                  <AvatarFallback className="bg-fitness-red text-white text-lg">
                    {trainer.first_name?.[0]}{trainer.last_name?.[0]}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>
            
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {trainer.first_name} {trainer.last_name}
                  </h3>
                  {trainer.experience_years && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mt-1">
                      <Star className="h-4 w-4" />
                      {trainer.experience_years} years experience
                    </div>
                  )}
                </div>

                {trainer.bio && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    {trainer.bio}
                  </p>
                )}

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-600 dark:text-gray-400">{trainer.email}</span>
                  </div>
                  {trainer.phone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600 dark:text-gray-400">{trainer.phone}</span>
                    </div>
                  )}
                </div>

                {trainer.specialties && trainer.specialties.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Specialties</Label>
                    <div className="flex flex-wrap gap-1">
                      {trainer.specialties.map((specialty, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {trainer.hourly_rate && (
                  <div className="text-lg font-bold text-fitness-red">
                    ${trainer.hourly_rate}/hour
                  </div>
                )}

                <div className="flex justify-between items-center pt-4">
                  <Badge variant={trainer.is_active ? "default" : "destructive"}>
                    {trainer.is_active ? "Active" : "Inactive"}
                  </Badge>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEditTrainer(trainer)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => deleteTrainerMutation.mutate(trainer.id)}
                      disabled={deleteTrainerMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {(!trainers || trainers.length === 0) && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Plus className="h-16 w-16 mx-auto" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No trainers found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Start by adding your first trainer to the system.
          </p>
          <Button 
            onClick={() => setIsAddDialogOpen(true)}
            className="bg-fitness-red hover:bg-red-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Your First Trainer
          </Button>
        </div>
      )}

      <AddTrainerDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
      />

      <EditTrainerDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        trainer={selectedTrainer}
      />
    </div>
  );
};

export default TrainersManagementPage;
