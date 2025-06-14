
import { useState } from "react";
import { 
  Search, 
  UserPlus, 
  Filter, 
  FileText, 
  Edit, 
  Trash2, 
  Calendar, 
  Award,
  Dumbbell,
  Loader2
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";

interface Trainer {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  bio: string | null;
  photo_url: string | null;
  specialties: string[];
  hourly_rate: number | null;
  is_active: boolean;
}

const TrainersPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [specialtyFilter, setSpecialtyFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  
  // Fetch trainers data
  const { data: trainers, isLoading, error, refetch } = useQuery({
    queryKey: ['trainers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('trainers')
        .select('*');
      
      if (error) throw error;
      return data as Trainer[];
    },
  });

  // Apply filters and search
  const filteredTrainers = trainers?.filter(trainer => {
    const searchMatch = 
      searchQuery === "" || 
      trainer.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trainer.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trainer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (trainer.phone && trainer.phone.includes(searchQuery));
    
    const specialtyMatch = specialtyFilter === null || 
      (trainer.specialties && trainer.specialties.includes(specialtyFilter));
    
    const statusMatch = statusFilter === null || 
      (statusFilter === 'active' && trainer.is_active) || 
      (statusFilter === 'inactive' && !trainer.is_active);
    
    return searchMatch && specialtyMatch && statusMatch;
  });

  // Get specialty badge color
  const getSpecialtyColor = (specialty: string) => {
    const colorMap: Record<string, string> = {
      'strength': 'bg-blue-500 hover:bg-blue-600',
      'cardio': 'bg-green-500 hover:bg-green-600',
      'hiit': 'bg-red-500 hover:bg-red-600',
      'yoga': 'bg-purple-500 hover:bg-purple-600',
      'pilates': 'bg-pink-500 hover:bg-pink-600',
      'crossfit': 'bg-orange-500 hover:bg-orange-600',
      'nutrition': 'bg-emerald-500 hover:bg-emerald-600',
      'rehabilitation': 'bg-cyan-500 hover:bg-cyan-600'
    };
    
    return colorMap[specialty] || 'bg-gray-500 hover:bg-gray-600';
  };

  // Handle trainer deletion
  const handleDeleteTrainer = async (id: string) => {
    try {
      const { error } = await supabase
        .from('trainers')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: "Trainer deleted",
        description: "Trainer has been successfully deleted",
      });
      
      refetch();
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to delete trainer",
        variant: "destructive",
      });
      console.error(err);
    }
  };

  // Generate initials for avatar fallback
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`;
  };

  if (error) {
    return (
      <Card className="bg-fitness-darkGray border-gray-800 text-white mx-auto max-w-4xl my-8">
        <CardContent className="p-6">
          <div className="text-center">
            <Award className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Error Loading Trainers</h3>
            <p className="text-gray-400 mb-4">
              There was an error loading the trainer data. Please try again later.
            </p>
            <Button 
              variant="outline" 
              className="border-fitness-red text-fitness-red hover:bg-fitness-red hover:text-white"
              onClick={() => refetch()}
            >
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Trainers Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-white">Trainers & Staff</h2>
        
        <Button 
          className="bg-fitness-red hover:bg-red-700"
        >
          <UserPlus className="mr-2 h-4 w-4" />
          Add New Trainer
        </Button>
      </div>

      {/* Search and Filter */}
      <Card className="bg-fitness-darkGray border-gray-800">
        <CardHeader>
          <CardTitle className="text-white text-lg">
            <Filter className="inline mr-2 h-5 w-5" /> 
            Search & Filter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search by name, email or phone..."
                  className="bg-fitness-black border-gray-700 pl-10 text-white"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <Select
              value={specialtyFilter || ""}
              onValueChange={(value) => setSpecialtyFilter(value || null)}
            >
              <SelectTrigger className="bg-fitness-black border-gray-700 text-white">
                <SelectValue placeholder="Specialty" />
              </SelectTrigger>
              <SelectContent className="bg-fitness-black border-gray-700 text-white">
                <SelectItem value="">All Specialties</SelectItem>
                <SelectItem value="strength">Strength</SelectItem>
                <SelectItem value="cardio">Cardio</SelectItem>
                <SelectItem value="hiit">HIIT</SelectItem>
                <SelectItem value="yoga">Yoga</SelectItem>
                <SelectItem value="pilates">Pilates</SelectItem>
                <SelectItem value="crossfit">CrossFit</SelectItem>
                <SelectItem value="nutrition">Nutrition</SelectItem>
                <SelectItem value="rehabilitation">Rehabilitation</SelectItem>
              </SelectContent>
            </Select>
            
            <Select
              value={statusFilter || ""}
              onValueChange={(value) => setStatusFilter(value || null)}
            >
              <SelectTrigger className="bg-fitness-black border-gray-700 text-white">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-fitness-black border-gray-700 text-white">
                <SelectItem value="">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Trainers Table */}
      <Card className="bg-fitness-darkGray border-gray-800">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center items-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-fitness-red" />
              <span className="ml-2 text-white">Loading trainers...</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-fitness-black">
                  <TableRow className="border-b border-gray-800 hover:bg-fitness-black/70">
                    <TableHead className="text-white">Trainer</TableHead>
                    <TableHead className="text-white">Email</TableHead>
                    <TableHead className="text-white">Specialties</TableHead>
                    <TableHead className="text-white">Hourly Rate</TableHead>
                    <TableHead className="text-white">Status</TableHead>
                    <TableHead className="text-white">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTrainers && filteredTrainers.length > 0 ? (
                    filteredTrainers.map((trainer) => (
                      <TableRow key={trainer.id} className="border-b border-gray-800 hover:bg-fitness-black/30">
                        <TableCell className="text-white font-medium">
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-10 w-10 border border-gray-700">
                              <AvatarImage src={trainer.photo_url || undefined} alt={`${trainer.first_name} ${trainer.last_name}`} />
                              <AvatarFallback className="bg-fitness-red text-white">
                                {getInitials(trainer.first_name, trainer.last_name)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{trainer.first_name} {trainer.last_name}</div>
                              <div className="text-sm text-gray-400">{trainer.phone || 'No phone'}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-300">{trainer.email}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {trainer.specialties.map((specialty) => (
                              <Badge 
                                key={specialty} 
                                className={getSpecialtyColor(specialty)}
                              >
                                {specialty.charAt(0).toUpperCase() + specialty.slice(1)}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-300">
                          {trainer.hourly_rate ? `$${trainer.hourly_rate.toFixed(2)}/hr` : 'N/A'}
                        </TableCell>
                        <TableCell>
                          <Badge className={trainer.is_active ? 'bg-green-500' : 'bg-gray-500'}>
                            {trainer.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0 text-white">
                                <span className="sr-only">Open menu</span>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                                  <circle cx="12" cy="12" r="1" />
                                  <circle cx="12" cy="5" r="1" />
                                  <circle cx="12" cy="19" r="1" />
                                </svg>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-fitness-black border-gray-700 text-white">
                              <DropdownMenuItem className="text-white hover:bg-fitness-darkGray cursor-pointer">
                                <FileText className="mr-2 h-4 w-4" />
                                <span>View Profile</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-white hover:bg-fitness-darkGray cursor-pointer">
                                <Edit className="mr-2 h-4 w-4" />
                                <span>Edit Info</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-white hover:bg-fitness-darkGray cursor-pointer">
                                <Calendar className="mr-2 h-4 w-4" />
                                <span>View Schedule</span>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator className="bg-gray-700" />
                              <Dialog>
                                <DialogTrigger asChild>
                                  <DropdownMenuItem 
                                    className="text-red-500 hover:bg-fitness-darkGray cursor-pointer"
                                    onSelect={(e) => e.preventDefault()}
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    <span>Delete Trainer</span>
                                  </DropdownMenuItem>
                                </DialogTrigger>
                                <DialogContent className="bg-fitness-black border-gray-700 text-white">
                                  <DialogHeader>
                                    <DialogTitle className="text-white">Delete Trainer</DialogTitle>
                                    <DialogDescription className="text-gray-400">
                                      Are you sure you want to delete {trainer.first_name} {trainer.last_name} from the system? This action cannot be undone.
                                    </DialogDescription>
                                  </DialogHeader>
                                  <DialogFooter>
                                    <Button 
                                      variant="outline" 
                                      className="border-gray-700 text-white hover:bg-gray-800"
                                      onClick={() => {}}
                                    >
                                      Cancel
                                    </Button>
                                    <Button 
                                      className="bg-red-600 hover:bg-red-700 text-white"
                                      onClick={() => handleDeleteTrainer(trainer.id)}
                                    >
                                      Delete
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center text-white">
                        No trainers found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TrainersPage;
