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
    user: async (parent, { user = null, params }, res) => {
      const foundUser = await User.findOne({
        $or: [
          { _id: user ? user._id : params.id },
          { username: params.username },
        ],
      }).populate("savedBooks");

      if (!foundUser) {
        throw new AuthenticationError("Cannot find a user with this id!");
      }

      return foundUser;
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
      console.log(token, user);
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
          { _id: "6278550885a86b1df0c00e5b" },
          { $addToSet: { savedBooks: args } },
          { new: true }
        );

        if (!updatedUser) {
          throw new AuthenticationError("Something went wrong");
        }

        return updatedUser;
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
          return res.status(400).json({ message: "Something is wrong!" });
        }
        res.json(updatedUser);
      }
      throw new AuthenticationError("You must be logged in to delete a book");
    },
  },
};

module.exports = resolvers;
