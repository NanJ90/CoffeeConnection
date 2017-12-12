const graphql = require('graphql');
const {
  GraphQLObjectType,
  GraphQLString
} = graphql;
const UserType = require ('./types/user_type');
const AuthService = require('../services/auth');

const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    signup: {
      type: UserType,
      args: {
        email: { type: GraphQLString },
        password: { type: GraphQLString },
        first_name: { type: GraphQLString},
        last_name: {type: GraphQLString}
      },
      resolve(parentValue, { email, password, first_name, last_name }, req) {
        return AuthService.signup({ email, password, first_name, last_name, req });
      }
    },
    logout: {
     type: UserType,
     resolve(parentValue, args, req) {
       const { user } = req;
       req.logout();
       return user;
     }
   },
   login: {
     type: UserType,
     args: {
       email: { type: GraphQLString },
       password: { type: GraphQLString }
     },
     resolve(parentValue, { email, password }, req) {
       return AuthService.login({ email, password, req });
     }
   }
  }
});

module.exports = mutation;
