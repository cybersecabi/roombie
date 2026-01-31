export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  houseId?: string;
  streak: number;
  totalCompleted: number;
  lastCompletedAt?: Date;
  fcmToken?: string;
  createdAt: Date;
}

export interface House {
  id: string;
  name: string;
  inviteCode: string;
  createdBy: string;
  createdAt: Date;
  roommates: string[];
}

export type Frequency = 'once' | 'daily' | 'weekly' | 'monthly' | 'custom';
export type Priority = 'low' | 'medium' | 'high';

export interface Chore {
  id: string;
  name: string;
  category: ChoreCategory;
  description?: string;
  estimatedTime: number;
  houseId: string;
  createdAt: Date;
  frequency: Frequency;
  repeatDays?: number[];
  startDate: Date;
  endDate?: Date;
  priority: Priority;
  assignedTo?: string;
}

export type ChoreCategory = 
  | 'kitchen' 
  | 'bathroom' 
  | 'living_room' 
  | 'bedroom' 
  | 'trash' 
  | 'outdoor' 
  | 'other';

export interface Assignment {
  id: string;
  choreId: string;
  choreName: string;
  userId: string;
  userName: string;
  houseId: string;
  weekStart: Date;
  weekEnd: Date;
  status: 'pending' | 'completed' | 'missed';
  completedAt?: Date;
  createdAt: Date;
}

export interface ShoppingItem {
  id: string;
  name: string;
  quantity: number;
  requestedBy: string;
  requestedByName: string;
  houseId: string;
  status: 'pending' | 'purchased';
  purchasedBy?: string;
  purchasedAt?: Date;
  createdAt: Date;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  body: string;
  type: 'assignment' | 'reminder' | 'completed' | 'system';
  read: boolean;
  createdAt: Date;
}
