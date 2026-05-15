import Image from "next/image";
import { getAllListings } from "@/lib/listing-store";

export default async function page() {
  const listings = await getAllListings();
  const priceFormatter = new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  });

  return (
    <main className="min-h-[calc(100vh-5rem)] bg-slate-50 px-4 py-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-4xl font-bold text-slate-900">Buy Phones</h1>
          <p className="mt-3 max-w-2xl text-slate-600">
            Discover the latest listings from PhoneLenz sellers. All uploads are stored safely in MongoDB and rendered live for buyers.
          </p>
        </div>

        {listings.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center text-slate-600 shadow-sm">
            <p className="text-xl font-semibold text-slate-900">No phone listings available yet.</p>
            <p className="mt-3">Ask a seller to list a phone from their dashboard.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            {listings.map((listing) => (
              <article key={listing.id} className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:shadow-xl">
                <div className="relative h-72">
                  <Image
                    src={listing.imageUrl}
                    alt={`Photo of ${listing.brand} ${listing.model}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-blue-600">{listing.condition}</p>
                      <h2 className="mt-3 text-xl font-semibold text-slate-900">{listing.brand} {listing.model}</h2>
                    </div>
                    <p className="text-lg font-semibold text-emerald-600">{priceFormatter.format(listing.price)}</p>
                  </div>

                  <p className="mt-4 text-sm leading-6 text-slate-600">{listing.description}</p>

                  <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-500">
                    <span>Seller: {listing.sellerName}</span>
                    <span>{new Date(listing.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
