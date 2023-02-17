import { Router } from "express";
import { getUsers, test,login,register,IsFirstLogin } from "../controllers/users.controller.js";
const router = Router();

//router.post("/", createUser);
router.get("/all", getUsers);
router.get("/", test);
router.get("/login", login);
router.post("/register", register);
router.get("/isFirstLogin", IsFirstLogin);



export default router;