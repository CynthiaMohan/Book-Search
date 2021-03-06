const { AuthenticationError } = require('apollo-server-express');
const { sign } = require('jsonwebtoken');
const { User, Book } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        //get all User
        me: async (parent, args, context) => {
            if (context.user) {
                const usersList = await User.findOne({ _id: context.user._id })
                    .select('-__v -password')
                    .populate('books');
                return usersList;
            }
            throw new AuthenticationError('Not Logged in. Please Log in to continue.');
        }
    },
    Mutation: {
        addUser: async (parent, args) => {
            const newUser = await User.create(args);
            const token = signToken(newUser);
            return { token, newUser };
        },
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });
            if (!user) {
                throw new AuthenticationError('Incorrect email');
            }
            const correctPw = await user.isCorrectPassword(password);
            if (!correctPw) {
                throw new AuthenticationError('Incorrect password');
            }
            const token = signToken(user);
            return { token, user };
        },
        saveBook: async (parent, args, context) => {
            if (context.user) {
                const updated = await User.findByIdAndUpdate(
                    { _id: context.user._id },
                    { $addToSet: { savedBooks: args.input } },
                    { new: true }
                );
                return updated;
            }
            throw new AuthenticationError('You are Not logged in. Please Log in to continue');
        },
        removeBook: async () => {
            if (context.user) {
                const updated = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $pull: { savedBooks: args.bookId } },
                    { new: true }
                );
                return updated;
            }
            throw new AuthenticationError('You are Not logged in. Please Log in to continue');
        }
    }
}

module.exports = resolvers;