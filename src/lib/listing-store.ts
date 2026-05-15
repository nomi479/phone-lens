import { ObjectId } from "mongodb";
import { getDatabase } from "./mongodb";

interface ListingDocument {
  _id: ObjectId;
  brand: string;
  model: string;
  condition: string;
  color?: string;
  price: number;
  description: string;
  imageUrl: string;
  sellerId: string;
  sellerName: string;
  sellerEmail: string;
  createdAt: string;
}

export type ListingRecord = {
  id: string;
  brand: string;
  model: string;
  condition: string;
  color: string;
  price: number;
  description: string;
  imageUrl: string;
  sellerId: string;
  sellerName: string;
  sellerEmail: string;
  createdAt: string;
};

function mapListingDocument(doc: ListingDocument): ListingRecord {
  return {
    id: doc._id.toString(),
    brand: doc.brand,
    model: doc.model,
    condition: doc.condition,
    color: doc.color ?? "",
    price: doc.price,
    description: doc.description,
    imageUrl: doc.imageUrl,
    sellerId: doc.sellerId,
    sellerName: doc.sellerName,
    sellerEmail: doc.sellerEmail,
    createdAt: doc.createdAt,
  };
}

const listingsCollection = "listings";

export async function getAllListings(): Promise<ListingRecord[]> {
  const db = await getDatabase();
  const listings = await db
    .collection<ListingDocument>(listingsCollection)
    .find()
    .sort({ createdAt: -1 })
    .toArray();

  return listings.map(mapListingDocument);
}

export async function createListing(data: {
  brand: string;
  model: string;
  condition: string;
  color: string;
  price: number;
  description: string;
  imageUrl: string;
  sellerId: string;
  sellerName: string;
  sellerEmail: string;
}): Promise<ListingRecord> {
  const db = await getDatabase();
  const insertResult = await db
    .collection<Omit<ListingDocument, "_id">>(listingsCollection)
    .insertOne({
      ...data,
      createdAt: new Date().toISOString(),
    });

  const createdListing = await db
    .collection<ListingDocument>(listingsCollection)
    .findOne({ _id: insertResult.insertedId });

  if (!createdListing) {
    throw new Error("Unable to create listing.");
  }

  return mapListingDocument(createdListing);
}
