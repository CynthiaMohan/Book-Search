const { AuthenticationError } = require('apollo-server-express');
const { sign } = require('jsonwebtoken');
const { User, Book } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        //get all USers
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
            const token = signToken(user);
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
        saveBook: async () => {

        },
        removeBook: async () => {

        }
    }
}

module.exports = resolvers;