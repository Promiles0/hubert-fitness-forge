
import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Send, Phone, Video, MoreVertical, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuthState } from "@/hooks/useAuthState";
import { toast } from "sonner";

interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  is_read: boolean;
  sent_at: string;
  sender_name?: string;
}

interface ConversationViewProps {
  conversationId: string;
}

const ConversationView = ({ conversationId }: ConversationViewProps) => {
  const [messageInput, setMessageInput] = useState("");
  const [participantName, setParticipantName] = useState("");
  const [isAdminConversation, setIsAdminConversation] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuthState();
  const queryClient = useQueryClient();

  // Fetch conversation details
  const { data: conversation } = useQuery({
    queryKey: ['conversation', conversationId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .eq('id', conversationId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!conversationId,
  });

  // Fetch messages
  const { data: messages, isLoading } = useQuery({
    queryKey: ['messages', conversationId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('sent_at', { ascending: true });

      if (error) throw error;

      // Get sender names
      const messagesWithNames = await Promise.all(
        data.map(async (message) => {
          let sender_name = "Unknown";
          
          if (message.sender_id === user?.id) {
            sender_name = "You";
          } else {
            const { data: profile } = await supabase
              .from('profiles')
              .select('name')
              .eq('id', message.sender_id)
              .single();
            
            if (profile) {
              sender_name = profile.name || "User";
            }
          }

          return {
            ...message,
            sender_name
          };
        })
      );

      return messagesWithNames;
    },
    enabled: !!conversationId,
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      const { error } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: user?.id,
          content,
          is_read: false
        });

      if (error) throw error;
    },
    onSuccess: () => {
      setMessageInput("");
      queryClient.invalidateQueries({ queryKey: ['messages', conversationId] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
    onError: (error) => {
      toast.error("Failed to send message");
      console.error("Error sending message:", error);
    },
  });

  // Get participant name
  useEffect(() => {
    const getParticipantName = async () => {
      if (!conversation) return;

      if (conversation.is_admin_conversation) {
        setParticipantName("Admin Support");
        setIsAdminConversation(true);
      } else if (conversation.trainer_id) {
        const { data: trainer } = await supabase
          .from('trainers')
          .select('first_name, last_name')
          .eq('id', conversation.trainer_id)
          .single();
        
        if (trainer) {
          setParticipantName(`${trainer.first_name} ${trainer.last_name}`);
        }
      } else {
        const otherUserId = conversation.user_id === user?.id ? conversation.trainer_id : conversation.user_id;
        const { data: profile } = await supabase
          .from('profiles')
          .select('name')
          .eq('id', otherUserId)
          .single();
        
        if (profile) {
          setParticipantName(profile.name || "User");
        }
      }
    };

    getParticipantName();
  }, [conversation, user?.id]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = () => {
    if (messageInput.trim() && !sendMessageMutation.isPending) {
      sendMessageMutation.mutate(messageInput.trim());
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString();
    }
  };

  if (!conversationId) {
    return (
      <Card className="h-full bg-fitness-darkGray border-gray-800 flex items-center justify-center">
        <div className="text-center text-gray-400">
          <Send className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg">Select a conversation to start messaging</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="h-full bg-fitness-darkGray border-gray-800 flex flex-col">
      {/* Header */}
      <CardHeader className="border-b border-gray-800 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-fitness-red text-white">
                {isAdminConversation ? (
                  <Users className="h-5 w-5" />
                ) : (
                  participantName.split(' ').map(n => n[0]).join('').toUpperCase()
                )}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-white font-semibold">{participantName}</h3>
              <p className="text-sm text-gray-400">
                {isAdminConversation ? "Support Team" : "Online"}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
              <Phone className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
              <Video className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      {/* Messages */}
      <CardContent className="flex-1 p-4 overflow-y-auto">
        {isLoading ? (
          <div className="text-center text-gray-400">Loading messages...</div>
        ) : !messages || messages.length === 0 ? (
          <div className="text-center text-gray-400 mt-8">
            <Send className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No messages yet</p>
            <p className="text-sm">Start the conversation!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message, index) => {
              const showDateSeparator = index === 0 || 
                formatDate(messages[index - 1].sent_at) !== formatDate(message.sent_at);
              
              return (
                <div key={message.id}>
                  {showDateSeparator && (
                    <div className="flex justify-center my-4">
                      <span className="bg-gray-800 text-gray-400 text-xs px-3 py-1 rounded-full">
                        {formatDate(message.sent_at)}
                      </span>
                    </div>
                  )}
                  
                  <div className={`flex ${message.sender_id === user?.id ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.sender_id === user?.id
                        ? "bg-fitness-red text-white"
                        : "bg-gray-800 text-white"
                    }`}>
                      {!isAdminConversation && message.sender_id !== user?.id && (
                        <p className="text-xs opacity-75 mb-1">{message.sender_name}</p>
                      )}
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      <p className="text-xs opacity-75 mt-1 text-right">
                        {formatTime(message.sent_at)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </CardContent>

      {/* Message Input */}
      <div className="p-4 border-t border-gray-800">
        <div className="flex gap-2">
          <Input
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="bg-gray-800 border-gray-700 text-white"
            disabled={sendMessageMutation.isPending}
          />
          <Button 
            onClick={handleSendMessage}
            disabled={!messageInput.trim() || sendMessageMutation.isPending}
            className="bg-fitness-red hover:bg-red-700"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ConversationView;
