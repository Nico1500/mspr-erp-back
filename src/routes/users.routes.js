import { Router } from "express";
import { getUsers, test,login,register,IsFirstLogin,getUsersFromCRM } from "../controllers/users.controller.js";
const router = Router();

//router.post("/", createUser);
router.get("/all", getUsers);
router.get("/", test);
router.get("/login", login);
router.post("/register", register);
router.get("/isFirstLogin", IsFirstLogin);

// Route pour récupérer la liste de tous les clients du CRM
router.get("/usersFromCrm", async (req, res) => {
    try {
      // Utiliser la fonction getAllCustomers pour récupérer la liste de tous les clients du CRM
      const customers = await getAllCustomers();
      // Renvoyer la liste des clients
      res.status(200).send(customers);
    } catch (error) {
      console.error(error);
      res.status(500).send("Erreur lors de la récupération des clients");
    }
});



export default router;