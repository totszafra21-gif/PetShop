"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Pet = {
  id: string;
  name: string;
  species: string;
  breed: string | null;
  age_months: number | null;
  gender: string | null;
  price: number;
  description: string | null;
  image_url: string | null;
  status: string;
};

export default function PetsPage() {
  const router = useRouter();
  const supabase = createClient();

  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [species, setSpecies] = useState("");
  const [status, setStatus] = useState("available");
  const [user, setUser] = useState<any>(null);
  const [profileName, setProfileName] = useState("User");

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUser(user);

      if (!user) return;

      const { data: profileData } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user.id)
        .maybeSingle();

      setProfileName(
        profileData?.full_name ||
          user.user_metadata?.full_name ||
          user.email?.split("@")[0] ||
          "User"
      );
    };

    checkUser();
  }, [supabase]);

  useEffect(() => {
    fetchPets();
  }, [search, species, status]);

  const fetchPets = async () => {
    setLoading(true);

    let query = supabase
      .from("pets")
      .select("*")
      .order("created_at", { ascending: false });

    if (search) {
      query = query.or(`name.ilike.%${search}%,breed.ilike.%${search}%`);
    }

    if (species) {
      query = query.eq("species", species);
    }

    if (status) {
      query = query.eq("status", status);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching pets:", error.message);
    } else {
      setPets(data || []);
    }

    setLoading(false);
  };

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
              <Link href="/pets" className="text-indigo-600 font-medium">Pets</Link>
              <Link href="/shop" className="text-slate-600 hover:text-indigo-600 transition">Product</Link>
            </nav>

            <div className="flex items-center gap-3">
              {user ? (
                <>
                  <Link
                    href="/profile"
                    className="px-4 py-2 text-sm font-medium text-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-50 transition"
                  >
                    Profile
                  </Link>
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
        {/* Title + Filters */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Pets</h1>
            <p className="text-slate-500 mt-1">Find your perfect companion</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Search by name or breed..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none w-full sm:w-64"
            />

            <select
              value={species}
              onChange={(e) => setSpecies(e.target.value)}
              className="px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white"
            >
              <option value="">All Species</option>
              <option value="dog">Dog</option>
              <option value="cat">Cat</option>
              <option value="bird">Bird</option>
              <option value="rabbit">Rabbit</option>
              <option value="fish">Fish</option>
              <option value="other">Other</option>
            </select>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white"
            >
              <option value="available">Available</option>
              <option value="reserved">Reserved</option>
              <option value="sold">Sold</option>
              <option value="">All Status</option>
            </select>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-20">
            <p className="text-slate-500">Loading pets...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && pets.length === 0 && (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🐾</div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No pets found</h3>
            <p className="text-slate-500">Try changing your search or filters.</p>
          </div>
        )}

        {/* Pets Grid */}
        {!loading && pets.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {pets.map((pet) => (
              <Link
                key={pet.id}
                href={`/pets/${pet.id}`}
                className="bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-lg transition group"
              >
                {/* Image */}
                <div className="aspect-square bg-slate-100 overflow-hidden">
                  {pet.image_url ? (
                    <img
                      src={pet.image_url}
                      alt={pet.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-5xl text-slate-300">
                      🐾
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-5">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-slate-900 line-clamp-1">
                      {pet.name}
                    </h3>
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${
                        pet.status === "available"
                          ? "bg-green-50 text-green-700"
                          : pet.status === "reserved"
                          ? "bg-orange-50 text-orange-700"
                          : "bg-red-50 text-red-700"
                      }`}
                    >
                      {pet.status}
                    </span>
                  </div>

                  <p className="text-sm text-slate-500 mt-1 capitalize">
                    {pet.species}
                    {pet.breed ? ` • ${pet.breed}` : ""}
                  </p>

                  <div className="mt-2 flex items-center gap-3 text-sm text-slate-500">
                    {pet.gender && (
                      <span className="capitalize">{pet.gender}</span>
                    )}
                    {pet.age_months !== null && (
                      <span>
                        {pet.age_months < 12
                          ? `${pet.age_months} mo`
                          : `${Math.floor(pet.age_months / 12)} yr`}
                      </span>
                    )}
                  </div>

                  <div className="mt-3">
                    <p className="text-lg font-bold text-indigo-600">
                      ₱{Number(pet.price).toLocaleString()}
                    </p>
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