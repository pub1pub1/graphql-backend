import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { GraphQLError } from "graphql";
import dao from "./data_access.js"; // Ensure this exists

// Sample in-memory product list (replace with a database)
let products = [
  { id: 1, name: "Laptop", price: 1200, description: "Gaming laptop" },
  { id: 2, name: "Smartphone", price: 800, description: "Latest model" },
  { id: 3, name: "Headphones", price: 200, description: "Noise-canceling" }
];

// Define the GraphQL schema
const typeDefs = `#graphql
  type Product {
    id: Int!
    name: String!
    price: Float!
    description: String
  }

  type Query {
    products: [Product!]!
    product(id: Int!): Product
  }

  type Mutation {
    addProduct(name: String!, price: Float!, description: String): Product!
    updateProduct(id: Int!, name: String, price: Float, description: String): Product!
    deleteProduct(id: Int!): Product
  }
`;

// Define the resolvers
const resolvers = {
  Query: {
    products: () => products,
    product: (_, { id }) => products.find((product) => product.id === id),
  },
  Mutation: {
    addProduct: (_, { name, price, description }) => {
      const newProduct = {
        id: products.length + 1,
        name,
        price,
        description,
      };
      products.push(newProduct);
      return newProduct;
    },
    updateProduct: (_, { id, name, price, description }) => {
      const productIndex = products.findIndex((product) => product.id === id);

      if (productIndex === -1) {
        throw new GraphQLError(`Product with ID ${id} not found`);
      }

      const existingProduct = products[productIndex];
      const updatedProduct = {
        ...existingProduct,
        name: name !== undefined ? name : existingProduct.name,
        price: price !== undefined ? price : existingProduct.price,
        description: description !== undefined ? description : existingProduct.description,
      };

      products[productIndex] = updatedProduct;
      return updatedProduct;
    },
    deleteProduct: (_, { id }) => {
      const productIndex = products.findIndex((product) => product.id === id);
      if (productIndex === -1) {
        throw new GraphQLError(`Product with ID ${id} not found`);
      }
      const deletedProduct = products[productIndex];
      products = products.filter((product) => product.id !== id);
      return deletedProduct;
    },
  },
};

// Create the Apollo Server instance
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Start the server
async function startServer() {
  const { url } = await startStandaloneServer(server, {
    listen: { port: 8080 },
  });
  console.log(`🚀 Server ready at ${url}`);
}

startServer();