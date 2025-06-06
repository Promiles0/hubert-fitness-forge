
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search,
  Plus,
  Download,
  Filter,
  DollarSign,
  CreditCard,
  AlertCircle,
  TrendingUp,
  Calendar,
  User
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type PaymentStatus = 'pending' | 'successful' | 'failed' | 'refunded';
type PaymentMethod = 'card' | 'paypal' | 'cash' | 'mobile_money' | 'bank_transfer';

const PaymentsManagementPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | "all">("all");
  const [methodFilter, setMethodFilter] = useState<PaymentMethod | "all">("all");
  const queryClient = useQueryClient();

  // Fetch payments with member and plan details
  const { data: payments, isLoading } = useQuery({
    queryKey: ['admin-payments', searchTerm, statusFilter, methodFilter],
    queryFn: async () => {
      let query = supabase
        .from('payments')
        .select(`
          *,
          members (
            first_name,
            last_name,
            email
          ),
          membership_plans (
            name
          )
        `)
        .order('payment_date', { ascending: false });

      if (statusFilter !== "all") {
        query = query.eq('payment_status', statusFilter);
      }

      if (methodFilter !== "all") {
        query = query.eq('payment_method', methodFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'successful': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'refunded': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'card': return 'bg-blue-100 text-blue-800';
      case 'cash': return 'bg-green-100 text-green-800';
      case 'paypal': return 'bg-purple-100 text-purple-800';
      case 'mobile_money': return 'bg-orange-100 text-orange-800';
      case 'bank_transfer': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Calculate stats
  const stats = payments ? {
    total: payments.reduce((sum, p) => sum + Number(p.amount), 0),
    successful: payments.filter(p => p.payment_status === 'successful').reduce((sum, p) => sum + Number(p.amount), 0),
    pending: payments.filter(p => p.payment_status === 'pending').length,
    failed: payments.filter(p => p.payment_status === 'failed').length,
  } : { total: 0, successful: 0, pending: 0, failed: 0 };

  const filteredPayments = payments?.filter(payment => {
    const memberName = payment.members ? 
      `${payment.members.first_name} ${payment.members.last_name}` : '';
    const matchesSearch = searchTerm === "" || 
      memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.transaction_id?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  if (isLoading) {
    return <LoadingSpinner size={40} className="min-h-screen flex items-center justify-center" />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Payments</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track and manage all financial transactions
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button className="bg-fitness-red hover:bg-red-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Payment
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-green-600">
                  ${stats.total.toFixed(2)}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Revenue</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  ${stats.successful.toFixed(2)}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Successful</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-yellow-600">
                  {stats.pending}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
              </div>
              <CreditCard className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-red-600">
                  {stats.failed}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Failed</p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search payments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as PaymentStatus | "all")}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="successful">Successful</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
              </SelectContent>
            </Select>
            <Select value={methodFilter} onValueChange={(value) => setMethodFilter(value as PaymentMethod | "all")}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Methods</SelectItem>
                <SelectItem value="card">Card</SelectItem>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="paypal">PayPal</SelectItem>
                <SelectItem value="mobile_money">Mobile Money</SelectItem>
                <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Payments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Member</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments?.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>
                    <div className="font-medium">
                      {payment.transaction_id || `TXN-${payment.id.slice(0, 8)}`}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <div>
                        <div className="font-medium">
                          {payment.members ? 
                            `${payment.members.first_name} ${payment.members.last_name}` : 
                            'Unknown Member'
                          }
                        </div>
                        <div className="text-sm text-gray-500">
                          {payment.members?.email}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {payment.membership_plans?.name || 'No Plan'}
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-green-600">
                      ${Number(payment.amount).toFixed(2)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getMethodColor(payment.payment_method)}>
                      {payment.payment_method.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(payment.payment_status)}>
                      {payment.payment_status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {new Date(payment.payment_date).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                      {payment.payment_status === 'successful' && (
                        <Button variant="ghost" size="sm">
                          Refund
                        </Button>
                      )}
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

export default PaymentsManagementPage;
