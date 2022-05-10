const { User, Book } = require("../models");
const { AuthenticationError } = require("apollo-server-express");
const { signToken } = require("../utils/auth");

const resolvers = {
  Query: {
    // all users
    users: async () => {
      try {
        const users = await User.find({}).populate("savedBooks");
        return users;
      } catch (err) {
        throw new Error(err);
      }
    },

    // get a single user by either their id or their username
    me: async (parent, { username }, context) => {
      if (context.user) {
        const foundUser = await User.findOne({
          $or: [{ username: username }, { _id: context.user._id }],
        });

        if (!foundUser) {
          throw new AuthenticationError("Cannot find a user with this id!");
        }

        return foundUser;
      }
      throw new AuthenticationError("You must be logged in!");
    },
  },

  Mutation: {
    // login
    login: async (parent, args) => {
      const user = await User.findOne({
        $or: [{ username: args.username }, { email: args.email }],
      });

      if (!user) {
        throw new AuthenticationError("Incorrect username or password");
      }

      const correctPw = await user.isCorrectPassword(args.password);

      if (!correctPw) {
        throw new AuthenticationError("Incorrect username or password");
      }

      const token = signToken(user);
      return { token, user };
    },

    // create a user
    createUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);
      return { token, user };
    },

    // save a book to a user's `savedBooks` field by adding it to the set (to prevent duplicates)
    saveBook: async (parent, args, context) => {
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { savedBooks: args } },
          { new: true }
        );

        return updatedUser.savedBooks[updatedUser.savedBooks.length - 1];
      }
      throw new AuthenticationError("You must be logged in to save a book");
    },

    // remove a book from `savedBooks`
    deleteBook: async (parent, { bookId }, context) => {
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: { bookId: bookId } } },
          { new: true }
        );
        if (!updatedUser) {
          throw new AuthenticationError("Something went wrong");
        }

        return updatedUser;
      }
      throw new AuthenticationError("You must be logged in to delete a book");
    },
  },
};

module.exports = resolvers;
