
import { SetStateAction, Dispatch } from "react";

export type TrainerData = {
  first_name: string;
  last_name: string;
} | null;

export interface Member {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  status: string;
  join_date: string;
  expiry_date: string | null;
  membership_plan: {
    name: string;
  } | null;
  trainer: TrainerData;
  gender: string | null;
}

export interface MembersFilterProps {
  searchQuery: string;
  setSearchQuery: Dispatch<SetStateAction<string>>;
  statusFilter: string | null;
  setStatusFilter: Dispatch<SetStateAction<string | null>>;
  planFilter: string | null;
  setPlanFilter: Dispatch<SetStateAction<string | null>>;
  genderFilter: string | null;
  setGenderFilter: Dispatch<SetStateAction<string | null>>;
  trainerFilter: string | null;
  setTrainerFilter: Dispatch<SetStateAction<string | null>>;
  membershipPlans: { id: string; name: string; }[] | undefined;
  trainers: { id: string; first_name: string; last_name: string; }[] | undefined;
}

export interface MemberActionsProps {
  member: Member;
  onDelete: (id: string) => Promise<void>;
}

export interface MembersTableProps {
  members: Member[] | undefined;
  isLoading: boolean;
  getStatusColor: (status: string) => string;
  handleDeleteMember: (id: string) => Promise<void>;
}
