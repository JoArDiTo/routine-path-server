import crypto from 'crypto';
import { GoalDatabase } from './database.ts';
import { Goal, GoalResponse, RegisterGoalRequest, UpdateGoalRequest, RegisterGoalWithStepsRequest } from './model.ts';
import { TOKEN_SECRET_KEY } from '@config/constants.ts';
import jwt, { JwtPayload } from 'jsonwebtoken';

export class GoalService {
  constructor(private goalDatabase: GoalDatabase) {}

  public async createGoal(token:string, registerGoalRequest: RegisterGoalRequest) {
    const decoded = jwt.verify(token, TOKEN_SECRET_KEY) as JwtPayload;
    const { id: user_id } = decoded;
    
    const { title, description, deadline } = registerGoalRequest;
    if (typeof title !== 'string' || title.length < 1) throw new Error('Invalid title');
    if (typeof description !== 'string' || description.length < 1) throw new Error('Invalid description');
    if (typeof deadline !== 'string' || isNaN(Date.parse(deadline))) throw new Error('Invalid deadline');

    const id = crypto.randomUUID();
    const status = 'Pendiente';
    const created_at = new Date();
    const updated_at = null;

    const goal: Goal = { id, user_id, title, description, deadline, status, created_at, updated_at };
    
    await this.goalDatabase.createGoal(goal);

    return goal;
  }

  public async getGoalsByUser(token:string) {
    const decoded = jwt.verify(token, TOKEN_SECRET_KEY) as JwtPayload;
    const { id: user_id } = decoded;

    const goals: GoalResponse[] = await this.goalDatabase.getGoalsByUserId(user_id);
    return goals;
  }

  public async updateGoalData(updateGoalRequest: UpdateGoalRequest) {
    const { id, title, description, deadline } = updateGoalRequest;
    
    if (typeof id !== 'string' || id.length < 1) throw new Error('Invalid id');
    if (title && (typeof title !== 'string' || title.length < 1)) throw new Error('Invalid title');
    if (description && (typeof description !== 'string' || description.length < 1)) throw new Error('Invalid description');
    if (deadline && (typeof deadline !== 'string' || isNaN(Date.parse(deadline)))) throw new Error('Invalid deadline');

    const goal:Goal = await this.goalDatabase.getGoalById(id);
    if (!goal) throw new Error('Goal not found');

    if (title && goal.title !== title) await this.goalDatabase.updateGoal(id, 'title', title);
    if (description && goal.description !== description) await this.goalDatabase.updateGoal(id, 'description', description);
    if (deadline && goal.deadline !== deadline) await this.goalDatabase.updateGoal(id, 'deadline', deadline);

    await this.goalDatabase.updateGoal(id, 'updated_at', new Date());

    return { id, title, description, deadline };

  }

  public async deleteGoal(id: string) {
    const goal: Goal = await this.goalDatabase.getGoalById(id);
    if (!goal) throw new Error('Goal not found');

    await this.goalDatabase.deleteGoalById(goal.id);

    return 'Goal deleted successfully';
  }

  public async createGoalWithSteps(token:string, registerGoalWithStepsRequest: RegisterGoalWithStepsRequest) {
    const decoded = jwt.verify(token, TOKEN_SECRET_KEY) as JwtPayload;
    const { id: user_id } = decoded;
    
    const { title, description, deadline, steps = [] } = registerGoalWithStepsRequest;

    if (typeof title !== 'string' || title.length < 1) throw new Error('Invalid title');
    if (typeof description !== 'string' || description.length < 1) throw new Error('Invalid description');
    if (!Array.isArray(steps) || steps.some(step => typeof step !== 'string' || step.length < 1)) throw new Error('Invalid steps');
    if (typeof deadline !== 'string' || isNaN(Date.parse(deadline))) throw new Error('Invalid deadline');

    const id = crypto.randomUUID();
    const status = 'Pendiente';
    const created_at = new Date();
    const updated_at = null;

    const goal: Goal = { id, user_id, title, description, deadline, status, created_at, updated_at };
    await this.goalDatabase.createGoal(goal);

    if (steps.length > 0) {
      let baseTime = new Date().getTime();
    
      for (const step of steps) {
        const stepId = crypto.randomUUID();
        const createdAt = new Date(baseTime);
        await this.goalDatabase.createStep(stepId, goal.id, step, false, createdAt);
    
        baseTime += 5;
      }
    }

    return 'Goal created successfully';
  }
}