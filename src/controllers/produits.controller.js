import { pool } from "../database.js";
const axios = require('axios');

pool.connect;

// La fonction getAllProducts récupère tous les produits de l'ERP
export const getAllProducts = async () => {
  try {
    // Utilisez l'URL de l'API pour récupérer tous les produits de l'ERP
    const response = await axios.get('https://615f5fb4f7254d0017068109.mockapi.io/api/v1/products');
    const products = response.data;
    // Renvoyer la liste des produits
    return products;
  } catch (error) {
    console.error(error);
  }
}

//todo recuperer le detail d'un produit de lerp
// La fonction getProductById prend un paramètre : productId
export const getProductById = async (productId) => {
  try {
    // Utilisez l'URL de l'API pour récupérer les détails d'un produit spécifique
    const response = await axios.get(`https://615f5fb4f7254d0017068109.mockapi.io/api/v1/products/${productId}`);
    const product = response.data;
    // Renvoyer les détails du produit spécifique
    return product;
  } catch (error) {
    console.error(error);
  }
}

//todo recuperer La liste des produits d'une commande du crm
export const getOrderProducts = async (customerId, orderId) => {
  try {
    // Utilisez l'URL de l'API pour récupérer les produits d'une commande spécifique pour un client spécifique
    const response = await axios.get(`https://615f5fb4f7254d0017068109.mockapi.io/api/v1/customers/${customerId}/orders/${orderId}/products`);
    const products = response.data;
    // Renvoyer la liste des produits pour la commande spécifique
    return products;
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