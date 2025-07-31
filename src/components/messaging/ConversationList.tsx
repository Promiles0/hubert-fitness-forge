
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Plus, MessageSquare, Users, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuthState } from "@/hooks/useAuthState";
import { useRealtimeMessages } from "@/hooks/useRealtimeMessages";
import { toast } from "sonner";

interface Conversation {
  id: string;
  is_admin_conversation: boolean;
  user_id: string;
  trainer_id: string | null;
  created_at: string;
  updated_at: string;
  last_message_at: string;
  last_message?: {
    content: string;
    sender_id: string;
    sent_at: string;
  };
  unread_count: number;
  participant_name: string;
}

interface ConversationListProps {
  selectedConversationId: string | null;
  onSelectConversation: (conversationId: string) => void;
  onNewConversation: () => void;
}

const ConversationList = ({ selectedConversationId, onSelectConversation, onNewConversation }: ConversationListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const { user } = useAuthState();
  
  // Initialize real-time messaging
  useRealtimeMessages();

  const { data: conversations, isLoading } = useQuery({
    queryKey: ['conversations', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from('conversations')
        .select(`
          *,
          messages!inner(
            content,
            sender_id,
            sent_at,
            is_read
          )
        `)
        .order('last_message_at', { ascending: false });

      if (error) throw error;

      // Process conversations to get participant names and unread counts
      const processedConversations = await Promise.all(
        data.map(async (conv: any) => {
          let participant_name = "Unknown";
          
          if (conv.is_admin_conversation) {
            participant_name = "Admin Support";
          } else if (conv.trainer_id) {
            const { data: trainer } = await supabase
              .from('trainers')
              .select('first_name, last_name')
              .eq('id', conv.trainer_id)
              .single();
            
            if (trainer) {
              participant_name = `${trainer.first_name} ${trainer.last_name}`;
            }
          } else {
            const { data: profile } = await supabase
              .from('profiles')
              .select('name')
              .eq('id', conv.user_id === user.id ? conv.trainer_id : conv.user_id)
              .single();
            
            if (profile) {
              participant_name = profile.name || "User";
            }
          }

          // Get last message and unread count
          const messages = conv.messages || [];
          const lastMessage = messages.length > 0 ? messages[messages.length - 1] : null;
          const unreadCount = messages.filter((msg: any) => 
            !msg.is_read && msg.sender_id !== user.id
          ).length;

          return {
            ...conv,
            participant_name,
            last_message: lastMessage,
            unread_count: unreadCount
          };
        })
      );

      return processedConversations;
    },
    enabled: !!user?.id,
  });

  const filteredConversations = conversations?.filter(conv =>
    conv.participant_name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

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

  return (
    <div className="h-full flex flex-col bg-card">
      {/* Header */}
      <div className="flex-shrink-0 p-4 border-b border-border/20">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Messages</h2>
          <Button 
            onClick={onNewConversation}
            size="sm" 
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Plus className="h-4 w-4 mr-2" />
            New
          </Button>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-background border-border text-foreground pl-10 placeholder:text-muted-foreground focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* Conversations List - Scrollable */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {isLoading ? (
          <div className="space-y-3 p-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-3">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-12" />
                  </div>
                  <Skeleton className="h-3 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="flex items-center justify-center h-32">
            <div className="text-center text-muted-foreground p-6">
              <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="font-medium">No conversations yet</p>
              <p className="text-sm">Start a new conversation</p>
            </div>
          </div>
        ) : (
          <div className="space-y-1 p-2">
            {filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => onSelectConversation(conversation.id)}
                className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                  selectedConversationId === conversation.id
                    ? "bg-primary/10 border-l-4 border-primary shadow-sm"
                    : "hover:bg-muted/50 active:bg-muted/70"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-primary text-primary-foreground font-medium">
                        {conversation.is_admin_conversation ? (
                          <Users className="h-5 w-5" />
                        ) : (
                          conversation.participant_name.split(' ').map(n => n[0]).join('').toUpperCase()
                        )}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-card shadow-sm"></div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <div className="flex items-center gap-2 min-w-0">
                        <p className="text-foreground font-medium truncate">
                          {conversation.participant_name}
                        </p>
                        {conversation.is_admin_conversation && (
                          <Badge variant="secondary" className="text-xs shrink-0">Admin</Badge>
                        )}
                      </div>
                      <div className="text-right flex flex-col items-end gap-1 shrink-0">
                        <p className="text-xs text-muted-foreground">
                          {conversation.last_message ? formatTime(conversation.last_message.sent_at) : ''}
                        </p>
                        {conversation.unread_count > 0 && (
                          <Badge className="bg-primary text-primary-foreground text-xs min-w-5 h-5 flex items-center justify-center p-0 rounded-full">
                            {conversation.unread_count > 99 ? '99+' : conversation.unread_count}
                          </Badge>
                        )}
                      </div>
                    </div>
                    {conversation.last_message && (
                      <p className="text-sm text-muted-foreground truncate leading-relaxed">
                        {conversation.last_message.content}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversationList;
