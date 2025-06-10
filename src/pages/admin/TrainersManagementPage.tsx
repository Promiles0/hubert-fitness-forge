
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
  User,
  Star,
  DollarSign
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import LoadingSpinner from "@/components/LoadingSpinner";
import { toast } from "sonner";
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

const TrainersManagementPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const queryClient = useQueryClient();

  const [newTrainer, setNewTrainer] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    bio: '',
    specialties: [] as string[],
    experience_years: 0,
    hourly_rate: 0,
    photo_url: '',
    is_active: true,
    certifications: [],
    availability: {}
  });

  const { data: trainers, isLoading } = useQuery({
    queryKey: ['admin-trainers', searchTerm],
    queryFn: async () => {
      let query = supabase
        .from('trainers')
        .select('*')
        .order('created_at', { ascending: false });

      if (searchTerm) {
        query = query.or(`first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const addTrainerMutation = useMutation({
    mutationFn: async (trainerData: typeof newTrainer) => {
      const { error } = await supabase
        .from('trainers')
        .insert([trainerData]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-trainers'] });
      toast.success('Trainer added successfully');
      setShowAddDialog(false);
      setNewTrainer({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        bio: '',
        specialties: [],
        experience_years: 0,
        hourly_rate: 0,
        photo_url: '',
        is_active: true,
        certifications: [],
        availability: {}
      });
    },
    onError: (error: any) => {
      toast.error('Failed to add trainer: ' + error.message);
    }
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
      queryClient.invalidateQueries({ queryKey: ['admin-trainers'] });
      toast.success('Trainer deleted successfully');
    },
    onError: (error: any) => {
      toast.error('Failed to delete trainer: ' + error.message);
    }
  });

  const handleSpecialtyChange = (specialty: string) => {
    setNewTrainer(prev => ({
      ...prev,
      specialties: prev.specialties.includes(specialty)
        ? prev.specialties.filter(s => s !== specialty)
        : [...prev.specialties, specialty]
    }));
  };

  const specialtyOptions = [
    'strength', 'cardio', 'hiit', 'yoga', 'pilates', 
    'crossfit', 'nutrition', 'rehabilitation'
  ];

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
            Manage trainer profiles and schedules
          </p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="bg-fitness-red hover:bg-red-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Trainer
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Trainer</DialogTitle>
            </DialogHeader>
            <div className="space-y-6 py-4">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="first_name">First Name *</Label>
                  <Input
                    id="first_name"
                    value={newTrainer.first_name}
                    onChange={(e) => setNewTrainer(prev => ({ ...prev, first_name: e.target.value }))}
                    placeholder="Enter first name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="last_name">Last Name *</Label>
                  <Input
                    id="last_name"
                    value={newTrainer.last_name}
                    onChange={(e) => setNewTrainer(prev => ({ ...prev, last_name: e.target.value }))}
                    placeholder="Enter last name"
                    required
                  />
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newTrainer.email}
                    onChange={(e) => setNewTrainer(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="trainer@example.com"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={newTrainer.phone}
                    onChange={(e) => setNewTrainer(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>

              {/* Professional Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="experience_years">Experience (Years)</Label>
                  <Input
                    id="experience_years"
                    type="number"
                    min="0"
                    value={newTrainer.experience_years}
                    onChange={(e) => setNewTrainer(prev => ({ ...prev, experience_years: parseInt(e.target.value) || 0 }))}
                  />
                </div>
                <div>
                  <Label htmlFor="hourly_rate">Hourly Rate ($)</Label>
                  <Input
                    id="hourly_rate"
                    type="number"
                    min="0"
                    step="0.01"
                    value={newTrainer.hourly_rate}
                    onChange={(e) => setNewTrainer(prev => ({ ...prev, hourly_rate: parseFloat(e.target.value) || 0 }))}
                  />
                </div>
              </div>

              {/* Bio */}
              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={newTrainer.bio}
                  onChange={(e) => setNewTrainer(prev => ({ ...prev, bio: e.target.value }))}
                  placeholder="Tell us about this trainer's background and expertise..."
                  rows={3}
                />
              </div>

              {/* Photo URL */}
              <div>
                <Label htmlFor="photo_url">Photo URL</Label>
                <Input
                  id="photo_url"
                  value={newTrainer.photo_url}
                  onChange={(e) => setNewTrainer(prev => ({ ...prev, photo_url: e.target.value }))}
                  placeholder="https://example.com/photo.jpg"
                />
              </div>

              {/* Specialties */}
              <div>
                <Label>Specialties</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                  {specialtyOptions.map((specialty) => (
                    <div key={specialty} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={specialty}
                        checked={newTrainer.specialties.includes(specialty)}
                        onChange={() => handleSpecialtyChange(specialty)}
                        className="rounded border-gray-300"
                      />
                      <Label htmlFor={specialty} className="text-sm capitalize">
                        {specialty}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Active Status */}
              <div className="flex items-center justify-between">
                <Label htmlFor="is_active">Active Trainer</Label>
                <Switch
                  id="is_active"
                  checked={newTrainer.is_active}
                  onCheckedChange={(checked) => setNewTrainer(prev => ({ ...prev, is_active: checked }))}
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={() => addTrainerMutation.mutate(newTrainer)}
                  disabled={!newTrainer.first_name || !newTrainer.last_name || !newTrainer.email}
                  className="bg-fitness-red hover:bg-red-700"
                >
                  Add Trainer
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
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
              {trainers?.length || 0}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Trainers</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-purple-600">
              {trainers?.reduce((sum, t) => sum + (t.experience_years || 0), 0) || 0}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Experience (Years)</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-orange-600">
              ${trainers?.reduce((sum, t) => sum + (t.hourly_rate || 0), 0).toFixed(2) || '0.00'}
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
                <TableHead>Experience</TableHead>
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
                        <div className="text-sm text-gray-500">
                          ID: {trainer.id.slice(0, 8)}
                        </div>
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
                      {trainer.specialties?.slice(0, 3).map((specialty, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {specialty}
                        </Badge>
                      ))}
                      {trainer.specialties?.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{trainer.specialties.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4" />
                      {trainer.experience_years || 0} years
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      ${trainer.hourly_rate || 0}/hr
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      className={
                        trainer.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }
                    >
                      {trainer.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => deleteTrainerMutation.mutate(trainer.id)}
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
