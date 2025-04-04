import { Request, Response } from 'express';
import { StepService } from './services.ts';

export class StepController {
  constructor(private stepService: StepService) { }

  async register(req: Request, res: Response) {
    try {     
      const { goal_id } = req.params; 
      const { title } = req.body;
      
      if (!goal_id || !title) {
        res.status(400).json({ error: 'Missing required fields' });
      }

      const step = await this.stepService.createStep({ goal_id, title });
      res.status(201).json(step);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      res.status(500).json({ error: errorMessage });
    }
  }

  async listStepsByGoal(req: Request, res: Response) {
    try {
      const { goal_id } = req.params;
      if (!goal_id) {
        res.status(400).json({ error: 'Missing required fields' });
      }

      const steps = await this.stepService.getStepsByGoal(goal_id);
      res.status(200).json(steps);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      res.status(500).json({ error: errorMessage });
    }
  }

  async updateStep(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { title, is_completed } = req.body;

      if (!id || !title || is_completed === undefined) {
        res.status(400).json({ error: 'Missing required fields' });
      }

      const step = await this.stepService.updateStepData({ id, title, is_completed });
      res.status(200).json(step);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      res.status(500).json({ error: errorMessage });
    }
  }

  async removeStep(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!id) res.status(400).json({ error: 'Missing required fields' });

      const message = await this.stepService.deleteStep(id)
      res.status(200).json({ message });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      res.status(500).json({ error: errorMessage });
    }
  }
}