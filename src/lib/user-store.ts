import { compare, hash } from "bcryptjs";
import { ObjectId } from "mongodb";
import { getDatabase } from "./mongodb";

export type UserRecord = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  passwordHash: string;
  createdAt: string;
};

interface UserDocument {
  _id: ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  passwordHash: string;
  createdAt: string;
}

type NewUserDocument = Omit<UserDocument, "_id">;

const usersCollection = "users";

function mapUserDocument(doc: UserDocument): UserRecord {
  return {
    id: doc._id.toString(),
    firstName: doc.firstName,
    lastName: doc.lastName,
    email: doc.email,
    phone: doc.phone,
    passwordHash: doc.passwordHash,
    createdAt: doc.createdAt,
  };
}

export async function findUserByEmail(email: string): Promise<UserRecord | undefined> {
  const normalizedEmail = email.trim().toLowerCase();
  const db = await getDatabase();
  const existingUser = await db
    .collection<UserDocument>(usersCollection)
    .findOne({ email: normalizedEmail });

  return existingUser ? mapUserDocument(existingUser) : undefined;
}

export async function createUser(data: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
}): Promise<UserRecord> {
  const normalizedEmail = data.email.trim().toLowerCase();
  const db = await getDatabase();
  const users = db.collection<UserDocument>(usersCollection);
  const usersInsert = db.collection<NewUserDocument>(usersCollection);

  const existingUser = await users.findOne({ email: normalizedEmail });
  if (existingUser) {
    throw new Error("A user with that email already exists.");
  }

  const passwordHash = await hash(data.password, 10);
  const userData: NewUserDocument = {
    firstName: data.firstName.trim(),
    lastName: data.lastName.trim(),
    email: normalizedEmail,
    phone: data.phone?.trim(),
    passwordHash,
    createdAt: new Date().toISOString(),
  };

  const insertResult = await usersInsert.insertOne(userData);
  const createdUser = await users.findOne({ _id: insertResult.insertedId });

  if (!createdUser) {
    throw new Error("Unable to create user account.");
  }

  return mapUserDocument(createdUser);
}

export async function updatePassword(email: string, password: string): Promise<UserRecord> {
  const normalizedEmail = email.trim().toLowerCase();
  const db = await getDatabase();
  const users = db.collection<UserDocument>(usersCollection);

  const existingUser = await users.findOne({ email: normalizedEmail });
  if (!existingUser) {
    throw new Error("Email does not exist.");
  }

  const passwordHash = await hash(password, 10);
  await users.updateOne({ _id: existingUser._id }, { $set: { passwordHash } });

  const updatedUser = await users.findOne({ _id: existingUser._id });
  if (!updatedUser) {
    throw new Error("Unable to update password.");
  }

  return mapUserDocument(updatedUser);
}

export async function verifyCredentials(email: string, password: string): Promise<UserRecord | null> {
  const user = await findUserByEmail(email);
  if (!user) {
    return null;
  }

  const isValid = await compare(password, user.passwordHash);
  return isValid ? user : null;
}
