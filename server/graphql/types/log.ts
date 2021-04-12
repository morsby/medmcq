import { gql } from "apollo-server-express";
import Log from "models/log.model";
import { Resolvers } from "types/resolvers-types";

export const logTypeDefs = gql`
    extend type Mutation {
        createLog(data: LogInput): String
    }

    input LogInput {
        name: String
    }
    
    type Log {
        name: String
        createdAt: String
    }
`;

export const logResolvers: Resolvers = {
    Mutation: {
        createLog: async (root, { data }, ctx) => {
            await Log.query().insert({ ...data, userId: ctx.user?.id })
            return "Success"
        }
    }
}