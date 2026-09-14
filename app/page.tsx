import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* NAVBAR */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2 text-xl font-bold text-slate-900">
              <span className="text-indigo-600 text-2xl">🐾</span>
              PetShop<span className="text-indigo-600">Manager</span>
            </Link>

            <nav className="hidden md:flex items-center gap-8">
              <Link href="/" className="text-indigo-600 font-medium">Home</Link>
              <Link href="/pets" className="text-slate-600 hover:text-indigo-600 transition">Pets</Link>
              <Link href="/products" className="text-slate-600 hover:text-indigo-600 transition">Products</Link>
            </nav>

            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="hidden sm:inline-flex px-4 py-2 text-sm font-medium text-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-50 transition"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition"
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="bg-gradient-to-br from-indigo-50 via-white to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight">
                Manage Your Pet Shop{" "}
                <span className="text-indigo-600">Easily & Efficiently</span>
              </h1>
              <p className="mt-6 text-lg text-slate-600 max-w-lg">
                A complete system for pet shops. Manage pets, products, orders,
                staff, and customers — all in one place with secure role-based access.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/register"
                  className="inline-flex items-center px-6 py-3 text-base font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition shadow-lg shadow-indigo-200"
                >
                  Get Started Free
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center px-6 py-3 text-base font-semibold text-indigo-600 bg-white border-2 border-indigo-600 rounded-xl hover:bg-indigo-50 transition"
                >
                  Login
                </Link>
              </div>
            </div>

            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1587300003388-59208cc962cd?w=700&h=550&fit=crop"
                alt="Happy pets"
                className="rounded-2xl shadow-2xl object-cover w-full h-[400px]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">Why Choose Our System?</h2>
            <p className="mt-3 text-lg text-slate-600">Everything you need to run a modern pet shop</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: "🔒", title: "Secure Authentication", desc: "Email OTP, password recovery, and role-based access (Admin, Staff, Customer)." },
              { icon: "🐕", title: "Pet Management", desc: "Full CRUD for pets — add, edit, search, and filter by species, status, and price." },
              { icon: "📦", title: "Inventory Control", desc: "Manage products, stock levels, and get low-stock alerts in real time." },
              { icon: "📊", title: "Dashboard & Reports", desc: "View sales, available pets, activity logs, and analytics at a glance." },
              { icon: "👥", title: "Role-Based Access", desc: "Admin, Staff, and Customer have different permissions." },
              { icon: "📱", title: "Fully Responsive", desc: "Works perfectly on desktop, tablet, and mobile devices." },
            ].map((feature, i) => (
              <div key={i} className="bg-slate-50 rounded-2xl p-8 hover:shadow-lg transition">
                <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center text-xl mb-5">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-indigo-600 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to manage your pet shop better?
          </h2>
          <p className="text-indigo-100 text-lg mb-8">
            Create an account now and start organizing your business today.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center px-8 py-3.5 text-base font-semibold text-indigo-600 bg-white rounded-xl hover:bg-indigo-50 transition shadow-lg"
          >
            Create Free Account
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-3 gap-10">
            <div>
              <Link href="/" className="flex items-center gap-2 text-xl font-bold text-white mb-4">
                <span className="text-indigo-400 text-2xl">🐾</span>
                PetShop<span className="text-indigo-400">Manager</span>
              </Link>
              <p className="text-sm max-w-xs">
                Simple & powerful pet shop management system built with Next.js and Supabase.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/" className="hover:text-indigo-400 transition">Home</Link></li>
                <li><Link href="/pets" className="hover:text-indigo-400 transition">Pets</Link></li>
                <li><Link href="/login" className="hover:text-indigo-400 transition">Login</Link></li>
                <li><Link href="/register" className="hover:text-indigo-400 transition">Register</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-indigo-400 transition">Help Center</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition">Contact Us</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-10 pt-6 text-center text-sm">
            © 2026 PetShop Manager. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
