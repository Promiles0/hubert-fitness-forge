
import { useState } from "react";
import ConversationList from "@/components/messaging/ConversationList";
import ConversationView from "@/components/messaging/ConversationView";
import NewConversationDialog from "@/components/messaging/NewConversationDialog";

const ChatPage = () => {
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [showNewConversationDialog, setShowNewConversationDialog] = useState(false);

  const handleSelectConversation = (conversationId: string) => {
    setSelectedConversationId(conversationId);
  };

  const handleNewConversation = () => {
    setShowNewConversationDialog(true);
  };

  const handleConversationCreated = (conversationId: string) => {
    setSelectedConversationId(conversationId);
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      {/* Header - Fixed */}
      <div className="flex-shrink-0 p-4 md:p-6 border-b border-border/20 bg-card shadow-sm">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Messages</h1>
          <p className="text-muted-foreground text-sm md:text-base">Connect with your trainers and support team</p>
        </div>
      </div>

      {/* Chat Layout - Flexible with proper constraints */}
      <div className="flex-1 flex min-h-0 max-w-7xl mx-auto w-full">
        {/* Conversations Sidebar - Fixed width on desktop, full width on mobile */}
        <div className="w-full md:w-80 lg:w-96 flex-shrink-0 border-r border-border/20 bg-background">
          <div className="h-full p-4">
            <ConversationList
              selectedConversationId={selectedConversationId}
              onSelectConversation={handleSelectConversation}
              onNewConversation={handleNewConversation}
            />
          </div>
        </div>

        {/* Conversation View - Takes remaining space */}
        <div className="flex-1 hidden md:flex p-4">
          {selectedConversationId ? (
            <ConversationView conversationId={selectedConversationId} />
          ) : (
            <div className="w-full bg-card rounded-lg border border-border/20 flex items-center justify-center shadow-sm">
              <div className="text-center text-muted-foreground max-w-md mx-auto px-6">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center shadow-inner">
                  <svg className="h-12 w-12 opacity-40" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Welcome to Messages</h3>
                <p className="text-sm leading-relaxed">Select a conversation from the sidebar to start messaging, or create a new conversation to connect with trainers and support.</p>
              </div>
            </div>
          )}
        </div>

        {/* Mobile: Show conversation view as overlay when selected */}
        {selectedConversationId && (
          <div className="md:hidden fixed inset-0 z-50 bg-background p-4">
            <ConversationView 
              conversationId={selectedConversationId} 
              onBack={() => setSelectedConversationId(null)}
            />
          </div>
        )}
      </div>

      <NewConversationDialog
        open={showNewConversationDialog}
        onOpenChange={setShowNewConversationDialog}
        onConversationCreated={handleConversationCreated}
      />
    </div>
  );
};

export default ChatPage;
