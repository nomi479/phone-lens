"use client";

import React, { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";

// Mock brands (consistent with PhoneLenz)
const brands = [
  "Apple", "Samsung", "OnePlus", "Xiaomi", "Realme",
  "Oppo", "Vivo", "Nothing", "Google Pixel", "Motorola",
];

interface ListingForm {
  brand: string;
  model: string;
  condition: "Fair" | "Good" | "Superb";
  price: string;
  description: string;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [phonePhotoFile, setPhonePhotoFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState<ListingForm>({
    brand: "",
    model: "",
    condition: "Good",
    price: "",
    description: "",
  });

  // Mock user stats
  const stats = [
    { label: "Phones Sold", value: "12", icon: "📱" },
    { label: "Total Earnings", value: "PKR 1,84,750", icon: "PKR" },
    { label: "Active Listings", value: "3", icon: "🔥" },
  ];

  if (status === "loading") {
    return (
      <main className="min-h-[calc(100vh-5rem)] flex items-center justify-center bg-slate-50 px-4 py-12">
        <div className="rounded-3xl bg-white p-10 shadow-lg ring-1 ring-slate-200 flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent animate-spin rounded-full" />
          Loading your dashboard…
        </div>
      </main>
    );
  }

  if (!session?.user) {
    return (
      <main className="min-h-[calc(100vh-5rem)] flex items-center justify-center bg-slate-50 px-4 py-12">
        <div className="max-w-xl rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-lg">
          <h1 className="text-3xl font-semibold text-slate-900">You are not signed in</h1>
          <p className="mt-4 text-sm text-slate-600">Please sign in to access your PhoneLenz dashboard and start selling or buying phones.</p>
          <Link
            href="/auth/signin"
            className="mt-6 inline-flex rounded-2xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
          >
            Go to Sign In
          </Link>
        </div>
      </main>
    );
  }

  const firstName = session.user.name?.split(" ")[0] ?? session.user.email?.split("@")[0] ?? "User";

  const avatarSrc = "/phonestore.avif";

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
      setPhonePhotoFile(file);
      setErrorMessage(null);
      setSuccessMessage(null);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitListing = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!phonePhotoFile) {
      setErrorMessage("Please upload a phone photo before listing.");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = new FormData();
      payload.append("brand", formData.brand);
      payload.append("model", formData.model);
      payload.append("condition", formData.condition);
      payload.append("price", formData.price);
      payload.append("description", formData.description);
      payload.append("phonePhoto", phonePhotoFile);

      const response = await fetch("/api/listings", {
        method: "POST",
        body: payload,
      });

      const result = await response.json();
      if (!response.ok) {
        setErrorMessage(result.error ?? "Unable to list your phone. Please try again.");
        return;
      }

      setSuccessMessage("✅ Your phone has been listed successfully and is now visible in the marketplace.");
      setFormData({ brand: "", model: "", condition: "Good", price: "", description: "" });
      setImagePreview(null);
      setPhonePhotoFile(null);
    } catch (err) {
      setErrorMessage("Unable to submit listing, please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh-5rem)] bg-slate-50 px-4 py-12">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 rounded-2xl overflow-hidden ring-2 ring-blue-100">
              <Image
                src={avatarSrc}
                alt={`${firstName}'s profile picture`}
                width={64}
                height={64}
                className="object-cover"
                priority
              />
            </div>
            <div>
              <p className="text-sm uppercase tracking-widest text-blue-600 font-semibold">Welcome back</p>
              <h1 className="text-4xl font-bold text-slate-900 tracking-tight">
                {firstName}’s Dashboard
              </h1>
              <p className="text-slate-600 mt-1">Manage your listings • Sell faster • Earn more</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/market"
              className="rounded-2xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 hover:border-blue-600 hover:text-blue-700 transition-all flex items-center gap-2"
            >
              <span>🛒</span>
              Explore Market
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="rounded-2xl bg-red-600 px-6 py-3 text-sm font-semibold text-white hover:bg-red-700 transition-colors flex items-center gap-2"
            >
              <span>🚪</span>
              Logout
            </button>
          </div>
        </header>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow"
            >
              <div className="text-4xl">{stat.icon}</div>
              <div>
                <div className="text-3xl font-semibold text-slate-900">{stat.value}</div>
                <div className="text-sm text-slate-500">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Sell Your Phone Section */}
        <section className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 md:p-10 mb-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-slate-900">Sell Your Phone Today</h2>
              <p className="text-slate-600 mt-2 max-w-md">
                Upload a photo, set your price, and get instant visibility on PhoneLenz marketplace.
              </p>
            </div>
            <div className="text-blue-600 text-sm font-medium flex items-center gap-1 mt-4 md:mt-0">
              <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-2xl text-xs">FAST CASH</span>
              Free pickup • Instant payment
            </div>
          </div>

          <form onSubmit={handleSubmitListing} className="grid md:grid-cols-12 gap-8">
            {/* Image Upload */}
            <div className="md:col-span-5">
              <label className="block text-sm font-medium text-slate-700 mb-2">Phone Photo</label>
              <div
                className={`border-2 border-dashed rounded-3xl h-80 flex flex-col items-center justify-center transition-all ${
                  imagePreview
                    ? "border-blue-300 bg-blue-50"
                    : "border-slate-200 hover:border-blue-300"
                }`}
              >
                {imagePreview ? (
                  <div className="relative w-full h-full">
                    <Image
                      src={imagePreview}
                      alt="Phone preview"
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-contain p-4 rounded-3xl"
                    />
                    <button
                      type="button"
                      onClick={() => setImagePreview(null)}
                      className="absolute top-4 right-4 bg-white text-red-500 text-xs px-3 py-1 rounded-2xl shadow hover:bg-red-50"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="text-6xl mb-4">📸</div>
                    <p className="text-slate-600 font-medium">Drag photo or</p>
                    <label className="cursor-pointer mt-2 inline-flex items-center px-6 py-3 bg-blue-600 text-white text-sm font-semibold rounded-2xl hover:bg-blue-700">
                      Choose File
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                    <p className="text-xs text-slate-400 mt-6">JPG, PNG • Max 5MB</p>
                  </>
                )}
              </div>
            </div>

            {/* Form Fields */}
            <div className="md:col-span-7 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Brand</label>
                  <select
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    required
                    className="w-full rounded-2xl border border-slate-200 px-5 py-4 focus:border-blue-500 focus:outline-none text-slate-900"
                  >
                    <option value="">Select brand</option>
                    {brands.map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Model</label>
                  <input
                    type="text"
                    name="model"
                    value={formData.model}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g. iPhone 15 Pro"
                    className="w-full rounded-2xl border border-slate-200 px-5 py-4 focus:border-blue-500 focus:outline-none text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Condition</label>
                  <select
                    name="condition"
                    value={formData.condition}
                    onChange={handleInputChange}
                    className="w-full rounded-2xl border border-slate-200 px-5 py-4 focus:border-blue-500 focus:outline-none text-slate-900"
                  >
                    <option value="Fair">Fair</option>
                    <option value="Good">Good</option>
                    <option value="Superb">Superb</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Asking Price (PKR)</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    placeholder="12999"
                    className="w-full rounded-2xl border border-slate-200 px-5 py-4 focus:border-blue-500 focus:outline-none text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Mention storage, RAM, scratches, battery health, accessories, etc."
                  className="w-full rounded-3xl border border-slate-200 px-5 py-4 focus:border-blue-500 focus:outline-none text-slate-900 resize-none"
                />
              </div>

              {errorMessage && (
                <div className="rounded-3xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
                  {errorMessage}
                </div>
              )}

              {successMessage && (
                <div className="rounded-3xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-700">
                  {successMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full md:w-auto px-10 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold text-lg rounded-3xl hover:from-blue-700 hover:to-blue-800 transition-all flex items-center justify-center gap-3 disabled:opacity-70"
              >
                {isSubmitting ? (
                  <>
                    <span className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                    Listing your phone…
                  </>
                ) : (
                  "🚀 List Phone for Sale"
                )}
              </button>
            </div>
          </form>
        </section>

        {/* Active Listings & Account Info sections remain the same as previous version */}
        {/* (I kept them unchanged for brevity – they had no external images) */}

        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-slate-900">Your Active Listings</h2>
            <Link href="/market/my-listings" className="text-blue-600 hover:underline text-sm font-medium">
              View all →
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Mock listings... (same as before) */}
            <div className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all">
              <div className="h-48 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-6xl">📱</div>
              <div className="p-5">
                <p className="font-semibold">iPhone 14 Pro • 128GB</p>
                <p className="text-sm text-emerald-600 font-medium">Superb • PKR 52,000</p>
                <p className="text-xs text-slate-500 mt-3">3 views • 2 offers</p>
              </div>
            </div>

            <div className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all">
              <div className="h-48 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-6xl">📱</div>
              <div className="p-5">
                <p className="font-semibold">Samsung S23 Ultra • 256GB</p>
                <p className="text-sm text-emerald-600 font-medium">Good • PKR 68,000</p>
                <p className="text-xs text-slate-500 mt-3">7 views • Live</p>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-dashed border-slate-300 flex flex-col items-center justify-center text-center p-8 hover:border-blue-300 transition-colors">
              <div className="text-5xl mb-4">➕</div>
              <p className="font-medium text-slate-700">Create another listing</p>
              <p className="text-xs text-slate-400 mt-1">Your next phone sale is just a click away</p>
            </div>
          </div>
        </section>

        {/* Account Info */}
        <div className="bg-white rounded-3xl p-8 grid md:grid-cols-2 gap-8 border border-slate-100">
          <div>
            <h3 className="font-semibold text-slate-900 mb-4">Account Details</h3>
            <p className="text-sm text-slate-600">
              Signed in as <span className="font-medium text-slate-900">{session.user.email}</span>
            </p>
            <p className="text-xs text-slate-400 mt-6">Member since March 2025</p>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 mb-4">Quick Actions</h3>
            <div className="flex flex-wrap gap-3">
              <Link href="/market" className="px-5 py-3 bg-slate-100 hover:bg-slate-200 rounded-2xl text-sm">Browse Refurbished Phones</Link>
              <Link href="#" className="px-5 py-3 bg-slate-100 hover:bg-slate-200 rounded-2xl text-sm">Update Profile</Link>
              <Link href="#" className="px-5 py-3 bg-slate-100 hover:bg-slate-200 rounded-2xl text-sm">View Earnings History</Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}