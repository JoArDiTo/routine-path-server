import { Step } from './model.ts';
import { db } from '@config/databaseConnection.ts';

export class StepDatabase {
  async createStep(step: Step) {
    const { id, goal_id, title, is_completed, created_at } = step;
    
    await db.none(
      'INSERT INTO "steps" (id, goal_id, title, is_completed, created_at) VALUES($1, $2, $3, $4, $5);',
      [id, goal_id, title, is_completed, created_at]
    )
  }

  async getGoalById(id: string) {
    return await db.oneOrNone('SELECT * FROM "goals" WHERE id = $1;', [id]);
  }

  async getStepById(id: string) {
    return await db.oneOrNone('SELECT * FROM "steps" WHERE id = $1;', [id]);
  }

  async getStepsByGoalId(goal_id: string) {
    return await db.manyOrNone('SELECT id, title, is_completed, created_at FROM "steps" WHERE goal_id = $1 ORDER BY created_at ASC;', [goal_id]);
  }

  async getGoalIdByStepId(id: string) {
    return await db.oneOrNone('SELECT goal_id FROM "steps" WHERE id = $1;', [id]);
  }

  async updateStep(id: string, data: string, value: string | boolean) {
    await db.none(`UPDATE "steps" SET ${data} = $1 WHERE id = $2;`, [value, id]);
  }

  async updateGoalStatus(goal_id: string, status: string) {
    await db.none('UPDATE "goals" SET status = $1 WHERE id = $2;', [status, goal_id]);
  }

  async deleteStepById(step_id: string) {
    await db.none('DELETE FROM "steps" WHERE id = $1;', [step_id]);
  }
}