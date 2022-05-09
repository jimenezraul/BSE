import { gql } from "@apollo/client";

// Login
export const LOGIN_USER = gql`
  mutation login($password: String!, $email: String) {
    login(password: $password, email: $email) {
    token
    user {
      _id
      username
      email
    }
  }
}
`;

// Register
export const ADD_USER = gql`
  mutation addUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

// Add book
export const SAVE_BOOK = gql`
  mutation saveBook(
    $title: String!
    $description: String!
    $bookId: String!
    $authors: [String]
    $image: String
    $link: String
  ) {
    saveBook(
      title: $title
      description: $description
      bookId: $bookId
      authors: $authors
      image: $image
      link: $link
    ) {
      _id
      title
    }
  }
`;
