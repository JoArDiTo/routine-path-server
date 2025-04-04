import { Request, Response } from 'express';
import { GoalService } from './services';

export class GoalController {
  constructor(private goalService: GoalService) {}

  async register(req: Request, res: Response) {
    try {
      const token = req.headers.authorization as string;

      const { title, description, deadline } = req.body;

      if (!title || !description || !deadline) {
        res.status(400).json({ error: 'Missing required fields' });
      }

      const goal = await this.goalService.createGoal(token, { title, description, deadline });
      res.status(201).json(goal);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      res.status(500).json({ error: errorMessage });
    }
  }

  async listGoalsByUserLogged(req: Request, res: Response) {
    try {
      const token = req.headers.authorization as string;

      const goals = await this.goalService.getGoalsByUser(token);
      res.status(200).json(goals);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      res.status(500).json({ error: errorMessage });
    }
  }

  async updateGoal(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { title, description, deadline, status } = req.body;

      if (!id || !title || !description || !deadline || !status) {
        res.status(400).json({ error: 'Missing required fields' });
      } 
      
      const goal = await this.goalService.updateGoalData({ id, title, description, deadline, status });
      res.status(200).json(goal);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      res.status(500).json({ error: errorMessage });
    }
  }

  async removeGoal(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!id) res.status(400).json({ error: 'Missing required fields' });

      const message = await this.goalService.deleteGoal(id);
      res.status(200).json({ message });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      res.status(500).json({ error: errorMessage });
    }
  }
}