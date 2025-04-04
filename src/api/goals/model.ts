export interface Goal {
  id: string;
  user_id: string;
  title: string;
  description: string;
  deadline: Date;
  status: string;
  created_at: Date;
  updated_at: null | Date;
}

export type RegisterGoalRequest = Pick<Goal, 'title' | 'description' | 'deadline'>;

export type GoalResponse = Omit<Goal, 'user_id' | 'description' | 'updated_at'>;

export type UpdateGoalRequest = Omit<Goal, 'user_id' | 'created_at' | 'updated_at'>;