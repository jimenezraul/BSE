import { gql } from "@apollo/client";

// Query me model
export const QUERY_ME = gql`
  query Query {
    me {
      _id
      username
      email
      savedBooks {
        _id
        title
        authors
        description
        bookId
        image
        link
      }
    }
  }
`;
