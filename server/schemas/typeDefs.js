const { gql } = require('apollo-server-express');

const typeDefs = gql`
type User{
    _id:ID
    username:String
    email:String
    bookCount:Int
    savedBooks:[Book]
}
type Book{
    _id:ID!
    bookId:String
    authors:[String]
    description:String
    title:String
    image:String
    link:String
}
input savedBook{
    authors:[String]
    description:String
    title:String
    bookId:String
    image:String
    link:String
}
type Query{
    me: User
}
type Mutation{
    login(email:String!,password:String!):User
    addUser(username:String!,email:String!,password:String!):User
    saveBook(input:savedBook!):User
    removeBook(bookId:ID):User
}
`;

module.exports = typeDefs;