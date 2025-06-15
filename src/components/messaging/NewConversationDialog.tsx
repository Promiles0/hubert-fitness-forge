
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useAuthState } from "@/hooks/useAuthState";
import { toast } from "sonner";

interface NewConversationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConversationCreated: (conversationId: string) => void;
}

const NewConversationDialog = ({ open, onOpenChange, onConversationCreated }: NewConversationDialogProps) => {
  const [recipientType, setRecipientType] = useState<"admin" | "trainer">("admin");
  const [selectedTrainerId, setSelectedTrainerId] = useState<string>("");
  const [message, setMessage] = useState("");
  const { user } = useAuthState();
  const queryClient = useQueryClient();

  // Fetch trainers
  const { data: trainers } = useQuery({
    queryKey: ['trainers-for-messaging'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('trainers')
        .select('id, first_name, last_name')
        .eq('is_active', true);

      if (error) throw error;
      return data;
    },
  });

  const createConversationMutation = useMutation({
    mutationFn: async () => {
      if (!user?.id) throw new Error("User not authenticated");
      if (!message.trim()) throw new Error("Message cannot be empty");

      // Create conversation
      const conversationData = {
        user_id: user.id,
        is_admin_conversation: recipientType === "admin",
        trainer_id: recipientType === "trainer" ? selectedTrainerId : null,
      };

      const { data: conversation, error: convError } = await supabase
        .from('conversations')
        .insert(conversationData)
        .select()
        .single();

      if (convError) throw convError;

      // Send first message
      const { error: messageError } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversation.id,
          sender_id: user.id,
          content: message.trim(),
          is_read: false
        });

      if (messageError) throw messageError;

      return conversation.id;
    },
    onSuccess: (conversationId) => {
      toast.success("Conversation started successfully!");
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      onConversationCreated(conversationId);
      resetForm();
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error("Failed to start conversation");
      console.error("Error creating conversation:", error);
    },
  });

  const resetForm = () => {
    setRecipientType("admin");
    setSelectedTrainerId("");
    setMessage("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) {
      toast.error("Please enter a message");
      return;
    }

    if (recipientType === "trainer" && !selectedTrainerId) {
      toast.error("Please select a trainer");
      return;
    }

    createConversationMutation.mutate();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-fitness-darkGray border-gray-800 text-white">
        <DialogHeader>
          <DialogTitle className="text-white">Start New Conversation</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="recipient-type">Contact</Label>
            <Select value={recipientType} onValueChange={(value: "admin" | "trainer") => setRecipientType(value)}>
              <SelectTrigger className="bg-fitness-black border-gray-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-fitness-black border-gray-700 text-white">
                <SelectItem value="admin">Admin Support</SelectItem>
                <SelectItem value="trainer">Personal Trainer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {recipientType === "trainer" && (
            <div className="space-y-2">
              <Label htmlFor="trainer">Select Trainer</Label>
              <Select value={selectedTrainerId} onValueChange={setSelectedTrainerId}>
                <SelectTrigger className="bg-fitness-black border-gray-700 text-white">
                  <SelectValue placeholder="Choose a trainer..." />
                </SelectTrigger>
                <SelectContent className="bg-fitness-black border-gray-700 text-white">
                  {trainers?.map((trainer) => (
                    <SelectItem key={trainer.id} value={trainer.id}>
                      {trainer.first_name} {trainer.last_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message here..."
              className="bg-fitness-black border-gray-700 text-white min-h-24"
              required
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-gray-700 text-gray-300 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createConversationMutation.isPending}
              className="bg-fitness-red hover:bg-red-700"
            >
              {createConversationMutation.isPending ? "Starting..." : "Start Conversation"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewConversationDialog;
