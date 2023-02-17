import { pool } from "../database.js";
const axios = require('axios');


pool.connect;


//todo recuperer La liste des commandes d’un client
export const getCustomerOrders = async (customerId) => {
  try {
    // Utilisez l'URL de l'API pour récupérer les commandes d'un client spécifique
    const response = await axios.get(`https://615f5fb4f7254d0017068109.mockapi.io/api/v1/customers/${customerId}/orders`);
    const orders = response.data;
    // Renvoyer la liste des commandes
    return orders;
  } catch (error) {
    console.error(error);
  }
}


export const test = async (req, res) => {
    try {
      return res.json("cc");
    } catch (error) {
      console.log(
        "🚀 ~ file: test ",
        error
      );
    }
  };