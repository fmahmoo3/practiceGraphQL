const { GraphQLServer } = require("graphql-yoga");
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/test", { useNewUrlParser: true });

const User = mongoose.model("User", {
    firstName: String,
    lastName: String,
    userEmailAddress: String,
    userPassword: String
});

const typeDefs = `
  type Query {
    hello(name: String): String!
  }
  type User {
    id: ID!
    firstName: String!
    lastName: String!
    userEmailAddress: String!
    userPassword: String!
  }
  type Mutation {
      createUser(fN: String!, lN: String!, eA: String!, p: String! ): User
  }
`;

const resolvers = {
    Query: {
        hello: (_, { name }) => `Hello ${name || "World"}`
    },
    Mutation: {
        createUser: async (_, { fN, lN, eA, p }) => {
            // 1. Create User instance
            const user = new User({
                firstName: fN,
                lastName: lN,
                userEmailAddress: eA,
                userPassword: p
            });
            // 2. Save User and wait for promise form server
            await user.save();
            // 3. return User
            return user;
        }
    }
};

const server = new GraphQLServer({ typeDefs, resolvers });
mongoose.connection.once("open", function() {
    server.start(() => console.log("Server is running on localhost:4000"));
});
