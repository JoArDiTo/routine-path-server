import crypto from 'crypto';
import { StepDatabase } from './database.ts';
import { Step, RegisterStepRequest, GoalWithSteps, UpdateStepRequest, StepStatusUpdateRequest } from './model.ts';

export class StepService {
  constructor(private stepDatabase: StepDatabase) { }

  public async createStep(registerStepRequest: RegisterStepRequest) {
    const { goal_id, title } = registerStepRequest;
  
    if (typeof goal_id !== 'string' || goal_id.length < 1) throw new Error('Invalid goal_id');
    if (typeof title !== 'string' || title.length < 1) throw new Error('Invalid title');

    const existingGoal = await this.stepDatabase.getGoalById(goal_id);
    if (!existingGoal) throw new Error('Goal with this id does not exist');

    const id = crypto.randomUUID();
    const created_at = new Date();
    const is_completed = false;
    const step: Step = { id, goal_id, title, is_completed, created_at }

    await this.stepDatabase.createStep(step);
    return step;
  }

  public async getStepsByGoal(goalId: string) {
    if (typeof goalId !== 'string' || goalId.length < 1) throw new Error('Invalid goal_id');

    const goal = await this.stepDatabase.getGoalById(goalId);
    if (!goal) throw new Error('Goal with this id does not exist');

    const { id, title, description, deadline, status, created_at, updated_at } = goal;

    const steps = await this.stepDatabase.getStepsByGoalId(goalId);
    const GoalWithSteps: GoalWithSteps = {
      id,
      title,
      description,
      deadline,
      status,
      created_at,
      updated_at,
      steps
    }

    return GoalWithSteps;
  }

  public async updateStepData(updateStepRequest: UpdateStepRequest) {
    const { id, title, is_completed } = updateStepRequest;
    if (typeof id !== 'string' || id.length < 1) throw new Error('Invalid id');
    if (title && ( typeof title !== 'string' || title.length < 1)) throw new Error('Invalid title');
    if (is_completed !== undefined && typeof is_completed !== 'boolean') throw new Error('Invalid is_completed');

    const step:Step = await this.stepDatabase.getStepById(id);
    if (!step) throw new Error('Step with this id does not exist');

    if (title && step.title !== title) await this.stepDatabase.updateStep(id, 'title', title);

    if (is_completed !== undefined && step.is_completed !== is_completed) {
      await this.stepDatabase.updateStep(id, 'is_completed', is_completed);
      await this.checkGoalStatus(step.goal_id);
    }

    return updateStepRequest;
  }

  public async deleteStep(id: string) {
    const step:Step = await this.stepDatabase.getStepById(id)
    if (!step) throw new Error('Step not found');

    await this.stepDatabase.deleteStepById(step.id);

    return 'Step deleted successfully';
  }

  public async checkStepsStatus(goalId: string, stepStatusUpdateRequest: StepStatusUpdateRequest[]) {
    const goal = await this.stepDatabase.getGoalById(goalId)
    if (!goal) throw new Error('Goal with this id does not exist');
    
    const isStepsIdCorrect = await this.validateStepIds(goalId , stepStatusUpdateRequest)
    if (!isStepsIdCorrect) throw new Error('Any Step not found')
    
      for (const step of stepStatusUpdateRequest) {
        await this.stepDatabase.updateStep(step.id, 'is_completed', step.is_completed);
      }

    await this.checkGoalStatus(goalId);

    return 'Steps udpated succesfully';
  }

  private async validateStepIds(goalId: string, stepStatusUpdateRequest: StepStatusUpdateRequest[]) {
    const stepIds = stepStatusUpdateRequest.map(request => request.id);
    const steps = await this.stepDatabase.getStepsByGoalId(goalId);

    const allStepsBelongToGoal = stepIds.every(stepId => 
      steps.some(step => step.id === stepId)
    );

    return allStepsBelongToGoal;
  }

  private async checkGoalStatus(goalId: string) {
    const steps = await this.stepDatabase.getStepsByGoalId(goalId);
    const isGoalCompleted = steps.every(step => step.is_completed );
    const isAllStepsIncompleted = steps.every(step => !step.is_completed);
    
    const newStatus = isGoalCompleted 
      ? 'Completado'
      : isAllStepsIncompleted
        ? 'Pendiente'
        : 'En Progreso'

    await this.stepDatabase.updateGoalStatus(goalId, newStatus);
  }
}