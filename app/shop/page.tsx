"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  description: string;
  image_url: string | null;
};

const categoryFilters = [
  { value: "", label: "All", icon: "✨" },
  { value: "food", label: "Food", icon: "🍖" },
  { value: "toy", label: "Toys", icon: "🧸" },
  { value: "accessory", label: "Accessories", icon: "🦮" },
  { value: "medicine", label: "Medicine", icon: "💊" },
];

export default function ShopPage() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [user, setUser] = useState<User | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);

    let query = supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (search) {
      query = query.ilike("name", `%${search}%`);
    }

    if (category) {
      query = query.eq("category", category);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching products:", error.message);
    } else {
      setProducts(data || []);
    }

    setLoading(false);
  }, [category, search, supabase]);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    checkUser();
  }, [supabase]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- the async query updates the loading and product state.
    fetchProducts();
  }, [fetchProducts]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ========== NAVBAR ========== */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2 text-xl font-bold text-slate-900">
              <span className="text-indigo-600 text-2xl">🐾</span>
              PetShop<span className="text-indigo-600">Manager</span>
            </Link>

            <nav className="hidden md:flex items-center gap-8">
              <Link href="/" className="text-slate-600 hover:text-indigo-600 transition">Home</Link>
              <Link href="/shop" className="text-indigo-600 font-medium">Shop</Link>
            </nav>

            <div className="flex items-center gap-3">
              {user ? (
                <>
                  <span className="hidden sm:inline text-sm text-slate-600">
                    {user.email}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 text-sm font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="px-4 py-2 text-sm font-medium text-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-50 transition"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ========== MAIN CONTENT ========== */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Title + Search */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Shop</h1>
            <p className="text-slate-500 mt-1">Browse our products for your pets</p>
          </div>

          <div className="w-full sm:w-64">
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none w-full"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mb-8" aria-label="Product categories">
          {categoryFilters.map((filter) => {
            const isActive = category === filter.value;

            return (
              <button
                key={filter.value || "all"}
                type="button"
                onClick={() => setCategory(filter.value)}
                aria-pressed={isActive}
                className={`flex flex-col items-center justify-center gap-1 min-w-20 px-4 py-3 rounded-xl border transition ${
                  isActive
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                    : "bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-600"
                }`}
              >
                <span className="text-2xl" aria-hidden="true">{filter.icon}</span>
                <span className="text-xs font-medium">{filter.label}</span>
              </button>
            );
          })}
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-20">
            <p className="text-slate-500">Loading products...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && products.length === 0 && (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No products found</h3>
            <p className="text-slate-500">Try changing your search or filter.</p>
          </div>
        )}

        {/* Products Grid */}
        {!loading && products.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/shop/${product.id}`}
                className="bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-lg transition group"
              >
                {/* Image */}
                <div className="aspect-square bg-slate-100 overflow-hidden">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl text-slate-300">
                      📦
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-5">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-slate-900 line-clamp-1">
                      {product.name}
                    </h3>
                    {product.stock <= 5 && product.stock > 0 && (
                      <span className="text-xs font-medium text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">
                        Low stock
                      </span>
                    )}
                    {product.stock === 0 && (
                      <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                        Out of stock
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-slate-500 mt-1 capitalize">
                    {product.category || "Uncategorized"}
                  </p>

                  <div className="mt-3 flex items-center justify-between">
                    <p className="text-lg font-bold text-indigo-600">
                      ₱{Number(product.price).toLocaleString()}
                    </p>
                    <span className="text-sm text-slate-500">
                      Stock: {product.stock}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
