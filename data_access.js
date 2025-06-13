const products = [
  {
    id: "1", // Use string-based ID for GraphQL compatibility
    name: "Laptop",
    price: 1200,
    stock: 50
  },
  {
    id: "2",
    name: "Smartphone",
    price: 800,
    stock: 100
  }
]; // In-memory database

module.exports.getProducts = () => products;

module.exports.findProductById = (id) =>
  products.find(product => product.id === id);

module.exports.insertProduct = ({ name, price, stock }) => {
  const newProduct = {
    id: String(products.length + 1), // Auto-generate a unique string ID
    name,
    price,
    stock
  };
  products.push(newProduct);
  return newProduct;
};

module.exports.updateProduct = (id, updatedProduct) => {
  const index = products.findIndex(product => product.id === id);
  if (index !== -1) {
    products[index] = { id, ...updatedProduct }; // Keep original ID
    return products[index];
  } else {
    return null; // Return null to indicate failure (GraphQL best practice)
  }
};

module.exports.deleteProduct = (id) => {
  const index = products.findIndex(product => product.id === id);
  if (index !== -1) {
    const deletedProduct = products.splice(index, 1)[0];
    return deletedProduct; // Return the deleted product as a response
  }
  return null;
};