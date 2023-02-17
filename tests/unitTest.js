
import { getProductById } from '../src/controllers/produits.controller';
import { getAllProducts} from '../src/controllers/produits.controller';
import { getOrderProducts } from '../src/controllers/produits.controller';
import { getCustomerOrders } from '../src/controllers/commandes.controller';

describe('Tests unitaires pour les fonctions d\'API', () => {
  test('Test de la fonction getAllProducts', async () => {
    const products = await getAllProducts();
    expect(products).toHaveLength(3);
    expect(products[0].name).toEqual('Produit 1');
  });

  test('Test de la fonction getProductById', async () => {
    const product = await getProductById('1');
    expect(product.name).toEqual('Produit 1');
  });

  test('Test de la fonction getOrderProducts', async () => {
    const products = await getOrderProducts('1', '1');
    expect(products).toHaveLength(2);
    expect(products[0].name).toEqual('Produit 1');
  });

  test('Test de la fonction getCustomerOrders', async () => {
    const orders = await getCustomerOrders('1');
    expect(orders).toHaveLength(2);
    expect(orders[0].id).toEqual('1');
  });
});