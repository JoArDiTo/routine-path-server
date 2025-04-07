import { Router } from 'express';
import { StepController } from './controllers.ts';
import { StepDatabase } from './database.ts';
import { StepService } from './services.ts';

const stepRouter = Router();
const stepRepository = new StepDatabase();
const stepService = new StepService(stepRepository);
const stepController = new StepController(stepService);

stepRouter.post('/register/:goal_id', stepController.register.bind(stepController));
stepRouter.get('/list/:goal_id', stepController.listStepsByGoal.bind(stepController));
stepRouter.put('/update/:id', stepController.updateStep.bind(stepController));
stepRouter.put('/update/group/:goal_id', stepController.changeStateSteps.bind(stepController))
stepRouter.delete('/delete/:id', stepController.removeStep.bind(stepController));

export default stepRouter;