const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type Book {
    _id: ID
    title: String
    authors: [String]
    description: String
    bookId: String
    image: String
    link: String
  }

  type User {
    _id: ID
    username: String
    email: String
    savedBooks: [Book]
  }

  type Query {
    me: User
    users: [User]
    user(username: String, id: ID): User
    books: [Book]
  }
  type Mutation {
    createUser(username: String!, email: String!, password: String!): User
    login(username: String, email: String, password: String!): User
    saveBook(
      title: String!
      authors: [String]
      description: String!
      bookId: String!
      image: String
      link: String
    ): Book
    deleteBook(bookId: String!): Book
  }
  type Auth {
    token: ID!
    user: User
  }
`;

module.exports = typeDefs;
