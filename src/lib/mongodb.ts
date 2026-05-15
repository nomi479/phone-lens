import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB ?? "phonelenz";

if (!uri) {
  throw new Error("Missing MONGODB_URI environment variable. Add it to .env.local.");
}

const globalWithMongo = global as typeof globalThis & {
  _mongoClientPromise?: Promise<MongoClient>;
};

const client = new MongoClient(uri, {
  maxPoolSize: 10,
});

const clientPromise = globalWithMongo._mongoClientPromise ?? client.connect();
if (!globalWithMongo._mongoClientPromise) {
  globalWithMongo._mongoClientPromise = clientPromise;
}

export async function getMongoClient() {
  return clientPromise;
}

export async function getDatabase() {
  const client = await getMongoClient();
  return client.db(dbName);
}
