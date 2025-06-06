
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Search,
  Plus,
  Mail,
  Send,
  Inbox,
  Archive,
  Trash2,
  Clock,
  CheckCircle,
  Users,
  MessageSquare
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const MessagesManagementPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("inbox");
  const queryClient = useQueryClient();

  // Fetch messages
  const { data: messages, isLoading } = useQuery({
    queryKey: ['admin-messages', searchTerm, activeTab],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:profiles!messages_sender_id_fkey (
            name,
            first_name,
            last_name
          ),
          recipient:profiles!messages_recipient_id_fkey (
            name,
            first_name,
            last_name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  // Fetch members for bulk messaging
  const { data: members } = useQuery({
    queryKey: ['admin-members-for-messaging'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('members')
        .select('id, first_name, last_name, email')
        .eq('status', 'active');

      if (error) throw error;
      return data;
    },
  });

  const getMessageTypeColor = (type: string) => {
    switch (type) {
      case 'announcement': return 'bg-blue-100 text-blue-800';
      case 'reminder': return 'bg-yellow-100 text-yellow-800';
      case 'personal': return 'bg-green-100 text-green-800';
      case 'promotional': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredMessages = messages?.filter(message => {
    const matchesSearch = searchTerm === "" || 
      message.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.content.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  // Calculate stats
  const stats = messages ? {
    total: messages.length,
    unread: messages.filter(m => !m.is_read).length,
    announcements: messages.filter(m => m.message_type === 'announcement').length,
    personal: messages.filter(m => m.message_type === 'personal').length,
  } : { total: 0, unread: 0, announcements: 0, personal: 0 };

  if (isLoading) {
    return <LoadingSpinner size={40} className="min-h-screen flex items-center justify-center" />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Messages</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Communicate with members and trainers
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <Users className="h-4 w-4 mr-2" />
            Bulk Message
          </Button>
          <Button className="bg-fitness-red hover:bg-red-700">
            <Plus className="h-4 w-4 mr-2" />
            Compose
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {stats.total}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Messages</p>
              </div>
              <MessageSquare className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-orange-600">
                  {stats.unread}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Unread</p>
              </div>
              <Mail className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {stats.announcements}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Announcements</p>
              </div>
              <Send className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {stats.personal}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Personal</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
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
                placeholder="Search messages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Messages Table */}
      <Card>
        <CardHeader>
          <CardTitle>Message List</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="inbox">
                <Inbox className="h-4 w-4 mr-2" />
                Inbox
              </TabsTrigger>
              <TabsTrigger value="sent">
                <Send className="h-4 w-4 mr-2" />
                Sent
              </TabsTrigger>
              <TabsTrigger value="archived">
                <Archive className="h-4 w-4 mr-2" />
                Archived
              </TabsTrigger>
            </TabsList>

            <TabsContent value="inbox" className="mt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>From</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMessages?.map((message) => (
                    <TableRow key={message.id} className={!message.is_read ? 'bg-blue-50 dark:bg-blue-950/20' : ''}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>
                              {message.sender?.first_name?.charAt(0) || message.sender?.name?.charAt(0) || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">
                              {message.sender?.first_name && message.sender?.last_name
                                ? `${message.sender.first_name} ${message.sender.last_name}`
                                : message.sender?.name || 'Unknown'
                              }
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className={`font-medium ${!message.is_read ? 'font-bold' : ''}`}>
                            {message.subject || 'No Subject'}
                          </div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            {message.content}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getMessageTypeColor(message.message_type)}>
                          {message.message_type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          {new Date(message.created_at).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={message.is_read ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}>
                          {message.is_read ? 'Read' : 'Unread'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            <Mail className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Archive className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="sent" className="mt-6">
              <div className="text-center py-8 text-gray-500">
                Sent messages will appear here
              </div>
            </TabsContent>

            <TabsContent value="archived" className="mt-6">
              <div className="text-center py-8 text-gray-500">
                Archived messages will appear here
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default MessagesManagementPage;
