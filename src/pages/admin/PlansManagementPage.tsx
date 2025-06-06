
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search,
  Plus,
  Edit,
  Trash2,
  DollarSign,
  Calendar,
  Users,
  Crown,
  Star,
  Zap
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

const PlansManagementPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const queryClient = useQueryClient();

  // Fetch membership plans with member counts
  const { data: plans, isLoading } = useQuery({
    queryKey: ['admin-plans', searchTerm],
    queryFn: async () => {
      let query = supabase
        .from('membership_plans')
        .select(`
          *,
          members (
            id,
            status
          )
        `)
        .order('price', { ascending: true });

      if (searchTerm) {
        query = query.ilike('name', `%${searchTerm}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const handleDeletePlan = async (planId: string) => {
    if (!confirm('Are you sure you want to delete this plan?')) return;

    try {
      const { error } = await supabase
        .from('membership_plans')
        .delete()
        .eq('id', planId);

      if (error) throw error;

      toast.success('Plan deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['admin-plans'] });
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const getPlanTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'basic': return 'bg-gray-100 text-gray-800';
      case 'premium': return 'bg-blue-100 text-blue-800';
      case 'pro': return 'bg-purple-100 text-purple-800';
      case 'vip': return 'bg-gold-100 text-gold-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPlanIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'basic': return <Users className="h-4 w-4" />;
      case 'premium': return <Star className="h-4 w-4" />;
      case 'pro': return <Zap className="h-4 w-4" />;
      case 'vip': return <Crown className="h-4 w-4" />;
      default: return <Users className="h-4 w-4" />;
    }
  };

  // Calculate statistics
  const stats = plans ? {
    totalPlans: plans.length,
    totalMembers: plans.reduce((sum, plan) => sum + (plan.members?.length || 0), 0),
    averagePrice: plans.reduce((sum, plan) => sum + Number(plan.price), 0) / plans.length,
    mostPopular: plans.reduce((popular, plan) => 
      (plan.members?.length || 0) > (popular.members?.length || 0) ? plan : popular
    , plans[0])
  } : { totalPlans: 0, totalMembers: 0, averagePrice: 0, mostPopular: null };

  if (isLoading) {
    return <LoadingSpinner size={40} className="min-h-screen flex items-center justify-center" />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Membership Plans</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage subscription plans and pricing
          </p>
        </div>
        <Button className="bg-fitness-red hover:bg-red-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Plan
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {stats.totalPlans}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Plans</p>
              </div>
              <Star className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {stats.totalMembers}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Subscriptions</p>
              </div>
              <Users className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  ${stats.averagePrice.toFixed(2)}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Average Price</p>
              </div>
              <DollarSign className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-lg font-bold text-orange-600">
                  {stats.mostPopular?.name || 'N/A'}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Most Popular</p>
              </div>
              <Crown className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search plans..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Plans Table */}
      <Card>
        <CardHeader>
          <CardTitle>Membership Plans</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Plan Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Active Members</TableHead>
                <TableHead>Features</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {plans?.map((plan) => (
                <TableRow key={plan.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{plan.name}</div>
                      <div className="text-sm text-gray-500">{plan.description}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getPlanTypeColor(plan.plan_type)}>
                      <div className="flex items-center gap-1">
                        {getPlanIcon(plan.plan_type)}
                        {plan.plan_type}
                      </div>
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      <span className="font-medium text-lg">${Number(plan.price).toFixed(2)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {plan.duration_days} days
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span className="font-medium">
                        {plan.members?.filter(m => m.status === 'active').length || 0}
                      </span>
                      <span className="text-gray-500">
                        / {plan.members?.length || 0} total
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-xs">
                      {plan.features ? (
                        <div className="space-y-1">
                          {Object.entries(plan.features as Record<string, any>).slice(0, 2).map(([key, value]) => (
                            <div key={key} className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                              {key}: {String(value)}
                            </div>
                          ))}
                          {Object.keys(plan.features as Record<string, any>).length > 2 && (
                            <div className="text-xs text-gray-500">
                              +{Object.keys(plan.features as Record<string, any>).length - 2} more
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-500">No features</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDeletePlan(plan.id)}
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

export default PlansManagementPage;
