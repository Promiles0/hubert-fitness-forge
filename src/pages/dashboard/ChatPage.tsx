
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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Messages</h1>
        <p className="text-gray-400">Connect with your trainers and support team</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[700px]">
        {/* Conversations List */}
        <div className="lg:col-span-1">
          <ConversationList
            selectedConversationId={selectedConversationId}
            onSelectConversation={handleSelectConversation}
            onNewConversation={handleNewConversation}
          />
        </div>

        {/* Conversation View */}
        <div className="lg:col-span-2">
          {selectedConversationId ? (
            <ConversationView conversationId={selectedConversationId} />
          ) : (
            <div className="h-full bg-fitness-darkGray border border-gray-800 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-400">
                <svg className="h-16 w-16 mx-auto mb-4 opacity-50" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                </svg>
                <p className="text-xl font-medium">Select a conversation</p>
                <p className="text-sm mt-1">Choose a conversation from the sidebar to start messaging</p>
              </div>
            </div>
          )}
        </div>
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
