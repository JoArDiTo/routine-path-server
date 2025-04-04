
export interface Step {
  id: string;
  goal_id: string;
  title: string;
  is_completed: boolean;
  created_at: Date;
}

export interface GoalWithSteps {
  id: string;
  title: string;
  description: string;
  deadline: Date;
  status: string;
  created_at: Date;
  steps: Omit<Step, 'goal_id'>[];
}

export interface StepStatusUpdateRequest {
  id: string;
  is_completed: boolean;
}

export type RegisterStepRequest = Omit<Step, 'id' | 'is_completed' | 'created_at'>;
export type UpdateStepRequest = Omit<Step, 'goal_id' | 'created_at'>;