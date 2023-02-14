import { Router } from "express";
import { getUsers, test } from "../controllers/users.controller.js";
const router = Router();

//router.post("/", createUser);
router.get("/all", getUsers);
router.get("/", test);


export default router;