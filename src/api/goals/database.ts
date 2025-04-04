import { Goal } from './model.ts';
import { db } from '@config/databaseConnection.ts';

export class GoalDatabase {
  async createGoal(goal: Goal) {
    const { id, user_id, title, description, deadline, status, created_at, updated_at } = goal;
    await db.none(
      'INSERT INTO "goals" (id, user_id, title, description, deadline, status, created_at, updated_at) VALUES($1, $2, $3, $4, $5, $6, $7, $8);',
      [id, user_id, title, description, deadline, status, created_at, updated_at]
    );
  }

  async getGoalsByUserId(userId: string) {
    return await db.manyOrNone('SELECT id, title, deadline, status, created_at FROM "goals" WHERE user_id = $1;', [userId]);
  }

  async getGoalById(id: string) {
    return await db.oneOrNone('SELECT * FROM "goals" WHERE id = $1;', [id]);
  }

  async updateGoal(id: string, data: string, value: string | Date) {
    db.none(`UPDATE "goals" SET ${data} = $1 WHERE id = $2;`, [value, id]);
  }

  async deleteGoalById(goalId: string) {
    await db.none('DELETE FROM "goals" WHERE id = $1;', [goalId]);
  }
}