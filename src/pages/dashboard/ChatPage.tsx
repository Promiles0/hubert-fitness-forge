
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Send, Phone, Video, MoreVertical } from "lucide-react";

const ChatPage = () => {
  const [selectedChat, setSelectedChat] = useState("trainer");
  const [messageInput, setMessageInput] = useState("");

  const conversations = [
    {
      id: "trainer",
      name: "Michael Thompson",
      role: "Personal Trainer",
      avatar: "MT",
      lastMessage: "Great job in today's session! Remember to stay hydrated.",
      time: "2 min ago",
      unread: 2,
      online: true
    },
    {
      id: "admin",
      name: "Admin Support",
      role: "Support Team",
      avatar: "AS",
      lastMessage: "Your membership renewal is due next week.",
      time: "1 hour ago",
      unread: 0,
      online: true
    },
    {
      id: "nutritionist",
      name: "Sarah Wilson",
      role: "Nutritionist",
      avatar: "SW",
      lastMessage: "I've updated your meal plan. Check it out!",
      time: "Yesterday",
      unread: 1,
      online: false
    }
  ];

  const messages = {
    trainer: [
      { id: 1, sender: "trainer", content: "Hi! How are you feeling after yesterday's workout?", time: "10:30 AM", isMe: false },
      { id: 2, sender: "me", content: "I'm feeling great! A bit sore but in a good way.", time: "10:32 AM", isMe: true },
      { id: 3, sender: "trainer", content: "That's perfect! The soreness means your muscles are adapting.", time: "10:33 AM", isMe: false },
      { id: 4, sender: "trainer", content: "Great job in today's session! Remember to stay hydrated.", time: "Just now", isMe: false }
    ],
    admin: [
      { id: 1, sender: "admin", content: "Welcome to HUBERT FITNESS! How can we help you today?", time: "9:00 AM", isMe: false },
      { id: 2, sender: "admin", content: "Your membership renewal is due next week.", time: "1 hour ago", isMe: false }
    ],
    nutritionist: [
      { id: 1, sender: "nutritionist", content: "I've updated your meal plan. Check it out!", time: "Yesterday", isMe: false }
    ]
  };

  const currentChat = conversations.find(chat => chat.id === selectedChat);
  const currentMessages = messages[selectedChat] || [];

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      // In a real app, this would send the message to the backend
      console.log("Sending message:", messageInput);
      setMessageInput("");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Messages</h1>
        <p className="text-gray-400">Connect with your trainers and support team</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
        {/* Conversations List */}
        <Card className="bg-fitness-darkGray border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Conversations</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-1">
              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  onClick={() => setSelectedChat(conversation.id)}
                  className={`p-4 cursor-pointer transition-colors ${
                    selectedChat === conversation.id 
                      ? "bg-fitness-red bg-opacity-20 border-l-4 border-fitness-red" 
                      : "hover:bg-gray-800"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-fitness-red text-white">
                          {conversation.avatar}
                        </AvatarFallback>
                      </Avatar>
                      {conversation.online && (
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-fitness-darkGray"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-white font-medium truncate">{conversation.name}</p>
                          <p className="text-xs text-gray-400">{conversation.role}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-400">{conversation.time}</p>
                          {conversation.unread > 0 && (
                            <Badge className="bg-fitness-red text-white text-xs mt-1">
                              {conversation.unread}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-gray-400 truncate mt-1">{conversation.lastMessage}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Chat Messages */}
        <Card className="lg:col-span-2 bg-fitness-darkGray border-gray-800 flex flex-col">
          {currentChat && (
            <>
              {/* Chat Header */}
              <CardHeader className="border-b border-gray-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-fitness-red text-white">
                        {currentChat.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-white font-semibold">{currentChat.name}</h3>
                      <p className="text-sm text-gray-400">{currentChat.role}</p>
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
                <div className="space-y-4">
                  {currentMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.isMe ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.isMe
                            ? "bg-fitness-red text-white"
                            : "bg-gray-800 text-white"
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p className="text-xs opacity-75 mt-1">{message.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-800">
                <div className="flex gap-2">
                  <Input
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder="Type your message..."
                    className="bg-gray-800 border-gray-700 text-white"
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  />
                  <Button 
                    onClick={handleSendMessage}
                    className="bg-fitness-red hover:bg-red-700"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </Card>
      </div>
    </div>
  );
};

export default ChatPage;
