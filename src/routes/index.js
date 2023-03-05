import { Router } from "express";
import users from "./users.routes.js";
import commandes from "./commandes.routes.js";
import produits from "./produits.routes.js";

const router = Router();

router.use("/users", users);
router.use("/orders", commandes);
router.use("/products", produits);

export default router;  