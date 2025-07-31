
import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Send, Phone, Video, MoreVertical, Users, ArrowLeft, Check, CheckCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuthState } from "@/hooks/useAuthState";
import { useTypingIndicator } from "@/hooks/useTypingIndicator";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  is_read: boolean;
  sent_at: string;
  sender_name?: string;
  status?: 'sending' | 'sent' | 'delivered' | 'seen';
}

interface ConversationViewProps {
  conversationId: string;
  onBack?: () => void;
}

const ConversationView = ({ conversationId, onBack }: ConversationViewProps) => {
  const [messageInput, setMessageInput] = useState("");
  const [participantName, setParticipantName] = useState("");
  const [isAdminConversation, setIsAdminConversation] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuthState();
  const queryClient = useQueryClient();
  const { typingUsers, sendTypingIndicator } = useTypingIndicator(conversationId);

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
      sendTypingIndicator(false);
      queryClient.invalidateQueries({ queryKey: ['messages', conversationId] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
    onError: (error) => {
      toast.error("Failed to send message");
      console.error("Error sending message:", error);
    },
  });

  // Mark messages as read when conversation is opened
  useEffect(() => {
    const markMessagesAsRead = async () => {
      if (!conversationId || !user?.id) return;

      const { error } = await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('conversation_id', conversationId)
        .neq('sender_id', user.id)
        .eq('is_read', false);

      if (!error) {
        queryClient.invalidateQueries({ queryKey: ['conversations'] });
      }
    };

    markMessagesAsRead();
  }, [conversationId, user?.id, queryClient]);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMessageInput(value);
    
    // Send typing indicator
    if (value.trim() && !sendMessageMutation.isPending) {
      sendTypingIndicator(true);
    } else {
      sendTypingIndicator(false);
    }
  };

  // Stop typing indicator after 3 seconds of inactivity
  useEffect(() => {
    const timer = setTimeout(() => {
      sendTypingIndicator(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [messageInput, sendTypingIndicator]);

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
    <div className="h-full flex flex-col bg-card border border-border/20 rounded-lg overflow-hidden">
      {/* Header - Fixed */}
      <div className="flex-shrink-0 p-4 border-b border-border/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {onBack && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onBack}
                className="md:hidden text-muted-foreground hover:text-foreground h-8 w-8 p-0 mr-1"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-primary text-primary-foreground">
                {isAdminConversation ? (
                  <Users className="h-5 w-5" />
                ) : (
                  participantName.split(' ').map(n => n[0]).join('').toUpperCase()
                )}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-foreground font-semibold">{participantName}</h3>
              <p className="text-sm text-muted-foreground">
                {isAdminConversation ? "Support Team" : "Online"}
              </p>
            </div>
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground h-8 w-8 p-0">
              <Phone className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground h-8 w-8 p-0">
              <Video className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground h-8 w-8 p-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Messages - Scrollable Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <div className="text-center text-muted-foreground">
              <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
              <p>Loading messages...</p>
            </div>
          </div>
        ) : !messages || messages.length === 0 ? (
          <div className="flex items-center justify-center h-32">
            <div className="text-center text-muted-foreground">
              <Send className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="font-medium">No messages yet</p>
              <p className="text-sm">Start the conversation!</p>
            </div>
          </div>
        ) : (
          <>
            <AnimatePresence>
              {messages.map((message, index) => {
                const showDateSeparator = index === 0 || 
                  formatDate(messages[index - 1].sent_at) !== formatDate(message.sent_at);
                
                return (
                  <motion.div 
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {showDateSeparator && (
                      <motion.div 
                        className="flex justify-center my-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                      >
                        <span className="bg-muted text-muted-foreground text-xs px-3 py-1 rounded-full font-medium">
                          {formatDate(message.sent_at)}
                        </span>
                      </motion.div>
                    )}
                    
                    <div className={`flex ${message.sender_id === user?.id ? "justify-end" : "justify-start"} mb-3`}>
                      <motion.div 
                        className={`max-w-[70%] px-4 py-3 rounded-2xl shadow-sm transition-all hover:shadow-md ${
                          message.sender_id === user?.id
                            ? "bg-primary text-primary-foreground rounded-br-md"
                            : "bg-muted text-foreground rounded-bl-md"
                        }`}
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        {!isAdminConversation && message.sender_id !== user?.id && (
                          <p className="text-xs opacity-75 mb-1 font-medium">{message.sender_name}</p>
                        )}
                        <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                        <div className="flex items-center justify-between mt-2">
                          <p className="text-xs opacity-75">
                            {formatTime(message.sent_at)}
                          </p>
                          {message.sender_id === user?.id && (
                            <div className="flex items-center gap-1">
                              {message.is_read ? (
                                <CheckCheck className="h-3 w-3 opacity-75" />
                              ) : (
                                <Check className="h-3 w-3 opacity-75" />
                              )}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
            
            {/* Typing indicator */}
            <AnimatePresence>
              {typingUsers.length > 0 && (
                <motion.div 
                  className="flex justify-start mb-3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="bg-muted text-foreground px-4 py-3 rounded-2xl rounded-bl-md max-w-[70%]">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {typingUsers[0].name} is typing...
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Message Input - Fixed */}
      <div className="flex-shrink-0 p-4 border-t border-border/20 bg-muted/20">
        <div className="flex gap-2">
          <Input
            value={messageInput}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="bg-background border-border text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary"
            disabled={sendMessageMutation.isPending}
          />
          <Button 
            onClick={handleSendMessage}
            disabled={!messageInput.trim() || sendMessageMutation.isPending}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-4"
          >
            {sendMessageMutation.isPending ? (
              <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConversationView;
