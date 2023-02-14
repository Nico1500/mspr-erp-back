import { Router } from "express";
import users from "./users.routes.js";
//import commandes from "./commandes.routes.js";
//import article from "./article.routes.js";

const router = Router();

router.use("/users", users);
//router.use("/commandes", commandes);
//router.use("/article", article);

export default router;