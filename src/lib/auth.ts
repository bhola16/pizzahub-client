import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { betterAuth } from "better-auth";
import { jwt } from "better-auth/plugins";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URL;

if (!uri) {
  throw new Error("MONGODB_URL is missing from environment variables");
}

// Reuse the MongoDB client across warm serverless invocations
// and Next.js module reloads.
const globalForMongo = globalThis as typeof globalThis & {
  pizzaHubMongoClient?: MongoClient;
  pizzaHubMongoPromise?: Promise<MongoClient>;
};

const client =
  globalForMongo.pizzaHubMongoClient ??
  new MongoClient(uri, {
    maxPoolSize: 10,
    minPoolSize: 0,
    maxIdleTimeMS: 60000,
    serverSelectionTimeoutMS: 10000,
  });

globalForMongo.pizzaHubMongoClient = client;

export const db = client.db("pizzahub");
export { client };

// Establish one reusable connection promise.
// A failed attempt clears the promise so a later request can retry.
export async function connectMongoDB(): Promise<MongoClient> {
  if (!globalForMongo.pizzaHubMongoPromise) {
    globalForMongo.pizzaHubMongoPromise = client
      .connect()
      .then(() => {
        console.log("[MongoDB] Frontend connection established");
        return client;
      })
      .catch((error) => {
        globalForMongo.pizzaHubMongoPromise = undefined;

        console.error("[MongoDB] Frontend connection failed:", error);

        throw error;
      });
  }

  return globalForMongo.pizzaHubMongoPromise;
}

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
  }),

  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,

  emailAndPassword: {
    enabled: true,
  },

  socialProviders: {
    google: {
      prompt: "select_account",
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },

  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "customer",
        input: true,
      },
      subscriptionPlan: {
        type: "string",
        required: false,
        defaultValue: "free",
        input: false,
      },
    },
  },

  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google"],
    },
  },

  plugins: [jwt()],

  session: {
    cookieCache: {
      enabled: true,
      strategy: "jwt",
      maxAge: 60 * 60 * 24 * 7,
    },
  },
});
