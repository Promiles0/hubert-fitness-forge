
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Search,
  MessageSquare,
  Users,
  Clock,
  Send
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import LoadingSpinner from "@/components/LoadingSpinner";
import ConversationView from "@/components/messaging/ConversationView";

const MessagesManagementPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);

  // Fetch all conversations for admin view
  const { data: conversations, isLoading } = useQuery({
    queryKey: ['admin-conversations', searchTerm],
    queryFn: async () => {
      let query = supabase
        .from('conversations')
        .select(`
          *,
          messages!inner(
            content,
            sender_id,
            sent_at,
            is_read
          ),
          profiles!conversations_user_id_fkey(
            name
          )
        `)
        .order('last_message_at', { ascending: false });

      const { data, error } = await query;
      if (error) throw error;

      // Process conversations to get user names and stats
      const processedConversations = data.map((conv: any) => {
        const messages = conv.messages || [];
        const lastMessage = messages.length > 0 ? messages[messages.length - 1] : null;
        const unreadCount = messages.filter((msg: any) => !msg.is_read && msg.sender_id !== conv.user_id).length;

        return {
          ...conv,
          user_name: conv.profiles?.name || 'Unknown User',
          last_message: lastMessage,
          unread_count: unreadCount,
          total_messages: messages.length
        };
      });

      return processedConversations.filter(conv => 
        searchTerm === "" || 
        conv.user_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    },
  });

  // Calculate stats
  const stats = conversations ? {
    total: conversations.length,
    unread: conversations.filter(c => c.unread_count > 0).length,
    admin: conversations.filter(c => c.is_admin_conversation).length,
    trainer: conversations.filter(c => !c.is_admin_conversation).length,
  } : { total: 0, unread: 0, admin: 0, trainer: 0 };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  if (isLoading) {
    return <LoadingSpinner size={40} className="min-h-screen flex items-center justify-center" />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Messages Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Monitor and manage all user conversations
          </p>
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
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Conversations</p>
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
                <p className="text-sm text-gray-600 dark:text-gray-400">Need Response</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {stats.admin}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Admin Conversations</p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {stats.trainer}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Trainer Conversations</p>
              </div>
              <Send className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[700px]">
        {/* Conversations List */}
        <Card className="bg-fitness-darkGray border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              <span>All Conversations</span>
              <Badge variant="secondary">{conversations?.length || 0}</Badge>
            </CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-fitness-black border-gray-700 text-white pl-10"
              />
            </div>
          </CardHeader>
          <CardContent className="p-0 flex-1 overflow-y-auto">
            {conversations?.length === 0 ? (
              <div className="p-4 text-center text-gray-400">
                <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No conversations found</p>
              </div>
            ) : (
              <div className="space-y-1 p-2">
                {conversations?.map((conversation) => (
                  <div
                    key={conversation.id}
                    onClick={() => setSelectedConversationId(conversation.id)}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedConversationId === conversation.id
                        ? "bg-fitness-red bg-opacity-20 border-l-4 border-fitness-red"
                        : "hover:bg-gray-800"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-fitness-red text-white">
                          {conversation.is_admin_conversation ? (
                            <Users className="h-5 w-5" />
                          ) : (
                            conversation.user_name.split(' ').map((n: string) => n[0]).join('').toUpperCase()
                          )}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-white font-medium truncate">
                              {conversation.user_name}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge 
                                variant={conversation.is_admin_conversation ? "default" : "secondary"} 
                                className="text-xs"
                              >
                                {conversation.is_admin_conversation ? "Admin" : "Trainer"}
                              </Badge>
                              <span className="text-xs text-gray-400">
                                {conversation.total_messages} messages
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-gray-400">
                              {conversation.last_message ? formatTime(conversation.last_message.sent_at) : ''}
                            </p>
                            {conversation.unread_count > 0 && (
                              <Badge className="bg-fitness-red text-white text-xs mt-1">
                                {conversation.unread_count}
                              </Badge>
                            )}
                          </div>
                        </div>
                        {conversation.last_message && (
                          <p className="text-sm text-gray-400 truncate mt-1">
                            {conversation.last_message.content}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Conversation View */}
        <div className="lg:col-span-2">
          {selectedConversationId ? (
            <ConversationView conversationId={selectedConversationId} />
          ) : (
            <Card className="h-full bg-fitness-darkGray border-gray-800 flex items-center justify-center">
              <div className="text-center text-gray-400">
                <MessageSquare className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-xl font-medium">Select a conversation</p>
                <p className="text-sm mt-1">Choose a conversation to view and respond to messages</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagesManagementPage;
