import { Router } from "express";
import { UserController } from "./controllers.ts";
import { UserDatabase } from "./database.ts";
import { UserService } from "./services.ts";
import { authMiddleware } from '@middlewares/validTokenMiddleware.ts';

const userRouter = Router();
const userRepository = new UserDatabase();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

userRouter.post("/register", userController.register.bind(userController));
userRouter.post("/login", userController.login.bind(userController));
userRouter.get("/profile", authMiddleware, userController.getProfile.bind(userController));
userRouter.put("/profile", authMiddleware, userController.updateProfile.bind(userController));

export default userRouter;