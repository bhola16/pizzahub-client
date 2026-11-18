import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URL as string);
const db = client.db("pizzahub");

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
  }),

  emailAndPassword: {
    enabled: true,
  },

  
  user: {
  additionalFields: {
    role: {
      type: "string",
      required: false,
      defaultValue: "customer",
      input: true,
    },
  },
},
 

});
