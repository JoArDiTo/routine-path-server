import { User } from "./model.ts";
import { db } from "@config/databaseConnection";

export class UserDatabase {
  async createUser(user: User) {
    const { id, firstname, lastname, email, password } = user;
    
    await db.none(
      'INSERT INTO "users" (id, firstname, lastname, email, password) VALUES($1, $2, $3, $4, $5);',
      [id, firstname, lastname, email, password]
    );
  }

  async getUserByEmail(email: string) {
    return db.oneOrNone('SELECT * FROM "users" WHERE email = $1;', [email]);
  }

  async getUserById(id: string) {
    return db.oneOrNone('SELECT firstname, lastname, email FROM "users" WHERE id = $1;', [id]);
  }

  async updateUser(id: string, data: string, value: string) {
    db.none(`UPDATE "users" SET ${data} = $1 WHERE id = $2;`, [value, id]);
  }
}