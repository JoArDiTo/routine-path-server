import { Request, Response } from 'express';
import { UserService } from './services';

export class UserController {
  constructor(private userService: UserService) {}
  
  async register(req: Request, res: Response) {
    try {
      const { firstname, lastname, email, password } = req.body;
  
      if (!firstname || !lastname || !email || !password) {
        res.status(400).json({ error: 'Missing required fields' });
      }

      const user = await this.userService.createUser({ firstname, lastname, email, password });
      res.status(201).json(user);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      res.status(500).json({ error: errorMessage });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
  
      if (!email || !password) {
        res.status(400).json({ error: 'Missing required fields' });
      }

      const token = await this.userService.authUser({ email, password });
      res.status(200).json(token);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      res.status(500).json({ error: errorMessage });
    }
  }

  async getProfile(req: Request, res: Response) {
    try {
      const token = req.headers.authorization as string;

      const user = await this.userService.getUserLogged(token);
      
      res.status(200).json(user);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      res.status(500).json({ error: errorMessage });
    }
  }

  async updateProfile(req: Request, res: Response) {
    try {
      const token = req.headers.authorization as string;

      const { firstname, lastname, email } = req.body;

      if (!firstname || !lastname || !email) {
        res.status(400).json({ error: 'Missing required fields' });
      } 
        
      const user = await this.userService.updateUserData(token, { firstname, lastname, email });
      res.status(200).json(user);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      res.status(500).json({ error: errorMessage });
    }
  }

}
