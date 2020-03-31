const { GraphQLServer } = require("graphql-yoga");
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/test", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const User = mongoose.model("User", {
    firstName: String,
    lastName: String,
    userEmailAddress: String,
    userPassword: String
});

const typeDefs = `
  type Query {
    hello(name: String): String!
    users: [User]
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
      updateUserName(id: ID!, fN: String!, lN: String!): Boolean
      removeUser(id: ID!): Boolean
  }
`;

const resolvers = {
    Query: {
        hello: (_, { name }) => `Hello ${name || "World"}`,
        users: () => User.find()
    },
    Mutation: {
        // C(R)UD: Read [use query!]
        // (C)RUD: Create
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
        },
        // CRU(D): Delete
        removeUser: async (_, { id }) => {
            await User.findByIdAndRemove(id);
            return true;
        },
        // CR(U)D: Update
        updateUserName: async (_, { id, fN, lN }) => {
            await User.findByIdAndUpdate(id, { firstName: fN, lastName: lN });
            return true;
        }
    }
};

const server = new GraphQLServer({ typeDefs, resolvers });
mongoose.connection.once("open", function() {
    server.start(() => console.log("Server is running on localhost:4000"));
});
