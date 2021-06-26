const { AuthenticationError } = require('apollo-server-express');
const { User, Book } = require('../models');

const resolvers = {
    Query: {
        //get all USers
        me: async () => {
            const usersList = await User.find()
                .select('-__v -password')
                .populate('books');
        }
    },
    Mutation: {
        addUser: async (parent, args) => {
            const newUser = await User.create(args);
            return newUser;
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
            return user;
        },
        saveBook: async () => {

        },
        removeBook: async () => {

        }
    }
}

module.exports = resolvers;