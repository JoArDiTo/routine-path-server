import { Router } from 'express';
import { GoalController } from './controllers.ts';
import { GoalDatabase } from './database.ts';
import { GoalService } from './services.ts';

const goalRouter = Router();
const goalRepository = new GoalDatabase();
const goalService = new GoalService(goalRepository);
const goalController = new GoalController(goalService);

goalRouter.post('/register', goalController.register.bind(goalController));
goalRouter.get('/list', goalController.listGoalsByUserLogged.bind(goalController));
goalRouter.put('/update/:id', goalController.updateGoal.bind(goalController));
goalRouter.delete('/delete/:id', goalController.removeGoal.bind(goalController));
goalRouter.post('/register-with-steps', goalController.registerWithSteps.bind(goalController));

export default goalRouter;