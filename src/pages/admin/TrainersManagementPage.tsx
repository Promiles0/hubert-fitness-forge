
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Search,
  Plus,
  Edit,
  Trash2,
  Mail,
  Phone,
  Star,
  Award,
  DollarSign,
  Calendar
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import LoadingSpinner from "@/components/LoadingSpinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const TrainersManagementPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const queryClient = useQueryClient();

  // Fetch trainers with their classes and member assignments
  const { data: trainers, isLoading } = useQuery({
    queryKey: ['admin-trainers', searchTerm],
    queryFn: async () => {
      let query = supabase
        .from('trainers')
        .select(`
          *,
          classes (
            name,
            class_type
          ),
          members!members_assigned_trainer_id_fkey (
            id,
            first_name,
            last_name
          )
        `)
        .order('created_at', { ascending: false });

      if (searchTerm) {
        query = query.or(`first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const handleDeleteTrainer = async (trainerId: string) => {
    if (!confirm('Are you sure you want to delete this trainer?')) return;

    try {
      const { error } = await supabase
        .from('trainers')
        .delete()
        .eq('id', trainerId);

      if (error) throw error;

      toast.success('Trainer deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['admin-trainers'] });
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const getSpecialtyColor = (specialty: string) => {
    const colors = [
      'bg-blue-100 text-blue-800',
      'bg-green-100 text-green-800',
      'bg-purple-100 text-purple-800',
      'bg-orange-100 text-orange-800',
      'bg-pink-100 text-pink-800'
    ];
    return colors[specialty.length % colors.length];
  };

  if (isLoading) {
    return <LoadingSpinner size={40} className="min-h-screen flex items-center justify-center" />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Trainers</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage trainer profiles and assignments
          </p>
        </div>
        <Button className="bg-fitness-red hover:bg-red-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Trainer
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-green-600">
              {trainers?.filter(t => t.is_active).length || 0}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Active Trainers</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-blue-600">
              {trainers?.reduce((sum, trainer) => sum + (trainer.classes?.length || 0), 0) || 0}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Classes</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-purple-600">
              {trainers?.reduce((sum, trainer) => sum + (trainer.members?.length || 0), 0) || 0}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Assigned Members</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-orange-600">
              ${trainers?.reduce((sum, trainer) => sum + Number(trainer.hourly_rate || 0), 0).toFixed(2) || '0.00'}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Hourly Rates</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search trainers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Trainers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Trainers List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Trainer</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Specialties</TableHead>
                <TableHead>Classes</TableHead>
                <TableHead>Members</TableHead>
                <TableHead>Rate</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {trainers?.map((trainer) => (
                <TableRow key={trainer.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={trainer.photo_url || undefined} />
                        <AvatarFallback>
                          {trainer.first_name.charAt(0)}{trainer.last_name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">
                          {trainer.first_name} {trainer.last_name}
                        </div>
                        <div className="text-sm text-gray-500">Trainer</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-3 w-3" />
                        {trainer.email}
                      </div>
                      {trainer.phone && (
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-3 w-3" />
                          {trainer.phone}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {trainer.specialties?.map((specialty, index) => (
                        <Badge key={index} className={getSpecialtyColor(specialty)}>
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {trainer.classes?.length || 0}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Award className="h-4 w-4" />
                      {trainer.members?.length || 0}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      ${trainer.hourly_rate || '0'}/hr
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={trainer.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                      {trainer.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Star className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <DollarSign className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDeleteTrainer(trainer.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrainersManagementPage;
