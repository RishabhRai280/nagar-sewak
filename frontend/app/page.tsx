// frontend/app/page.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function StunningLandingPage() {
  return (
    <div className="min-h-screen w-full bg-white text-gray-900 overflow-x-hidden">
      
      {/* HERO SECTION */}
      <section className="relative w-full pt-28 pb-32 bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-700 text-white">
        {/* Background Image Source: Unsplash */}
        <div className="absolute inset-0 opacity=40 bg-[url('https://images.unsplash.com/photo-1520975918318-3a8c04f7e6b0?auto=format&fit=crop&w=1400&q=80')] bg-cover bg-center"></div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-10 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-6xl font-extrabold leading-tight drop-shadow-xl"
            >
              Transforming Cities with
              <span className="text-yellow-300"> Transparent Governance</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mt-6 text-xl opacity-90 max-w-xl"
            >
              A next-gen civic technology platform enabling citizens, administrators,
              and contractors to collaborate seamlessly for cleaner, safer, and more
              accountable cities.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="mt-10 flex flex-wrap gap-4"
            >
              <Link
                href="/register"
                className="bg-yellow-300 text-black px-8 py-4 rounded-xl text-lg font-bold shadow-xl hover:bg-yellow-400 transition flex items-center gap-2"
              >
                Start Reporting <ArrowRight size={20} />
              </Link>

              <Link
                href="#features"
                className="bg-white/20 backdrop-blur px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white/30 transition"
              >
                Explore Features
              </Link>
            </motion.div>
          </div>

          {/* Animated Illustration */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex justify-center relative"
          >
            <Image
              src="https://cdn.dribbble.com/users/117152/screenshots/4601264/media/1a6cd9b8efb4f2c0a9f50b0c035b2c22.gif"
              alt="City Illustration"
              width={520}
              height={520}
              unoptimized={true} // Needed for GIFs, but we'll fix the host error below
              className="rounded-3xl shadow-2xl border-4 border-white/20"
            />
          </motion.div>
        </div>
      </section>

      {/* PROBLEMS */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          
          <h2 className="text-5xl font-bold text-center mb-16 text-gray-800">
            Problems We Solve
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {[
              {
                title: "Lack of Transparency",
                desc: "Citizens have no visibility into projects, funds, or contractors.",
                img: "https://cdn-icons-png.flaticon.com/512/992/992651.png",
              },
              {
                title: "Slow Grievance Handling",
                desc: "Reporting and resolving local issues is slow and inefficient.",
                img: "https://cdn-icons-png.flaticon.com/512/565/565547.png",
              },
              {
                title: "Poor Accountability",
                desc: "Contractors and officials lack performance tracking.",
                img: "https://cdn-icons-png.flaticon.com/512/9131/9131529.png",
              },
              {
                title: "No Real-Time Insights",
                desc: "Administrators rely on manual data instead of live analytics.",
                img: "https://cdn-icons-png.flaticon.com/512/4149/4149678.png",
              },
            ].map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-white p-8 rounded-2xl shadow-xl text-center border-t-4 border-blue-600"
              >
                <Image
                  src={p.img}
                  alt={p.title}
                  width={80}
                  height={80}
                  className="mx-auto mb-4"
                  unoptimized={true} // Optimization off for icons
                />
                <h4 className="text-2xl font-bold mb-3">{p.title}</h4>
                <p className="text-gray-600">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          
          <h2 className="text-5xl font-bold text-center text-blue-700 mb-20">
            Powerful Features
          </h2>

          <div className="space-y-24">

            {/* Feature 1 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
              <div>
                <h3 className="text-4xl font-extrabold text-gray-900 mb-6">
                  Live Project Tracking
                </h3>
                <p className="text-lg text-gray-700 mb-6">
                  Citizens can track all development works with budget transparency,
                  contractor details, and geo-locations.
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-3">
                  <li>Full Budget Breakdown</li>
                  <li>Contractor Identity & Ratings</li>
                  <li>Interactive City Map</li>
                </ul>
              </div>

              <Image
                src="https://cdn.dribbble.com/users/23070/screenshots/17687566/media/b4bc8269aa8c6941a978c6361da3adc3.png"
                alt="Tracking"
                width={500}
                height={500}
                className="rounded-2xl shadow-2xl"
                unoptimized={true} // Optimization off for external PNGs
              />
            </div>

            {/* Feature 2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center md:flex-row-reverse">
              <Image
                src="https://cdn.dribbble.com/users/99875/screenshots/14118289/media/1bb157ccd44fcbb40f19a1e0122972a7.png"
                alt="Report"
                width={500}
                height={500}
                className="rounded-2xl shadow-2xl"
                unoptimized={true} // Optimization off for external PNGs
              />

              <div>
                <h3 className="text-4xl font-extrabold text-gray-900 mb-6">
                  Smart Geo-Tagged Complaints
                </h3>
                <p className="text-lg text-gray-700 mb-6">
                  Report issues instantly with photos, GPS location, and real-time
                  resolution tracking.
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-3">
                  <li>Instant Zone Routing</li>
                  <li>Live Status Updates</li>
                  <li>Photo-Based Verification</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gradient-to-br from-indigo-700 to-purple-700 text-white text-center">
        <h2 className="text-5xl font-extrabold mb-6">Join the Movement for Better Cities</h2>
        <p className="text-xl opacity-90 max-w-3xl mx-auto mb-10">
          Together, let&apos;s build a transparent, responsive, and citizen-driven governance system.
        </p>
        <Link
          href="/register"
          className="bg-white text-indigo-700 px-10 py-4 rounded-full text-xl font-bold shadow-2xl hover:bg-gray-200 transition"
        >
          Get Started
        </Link>
      </section>

    </div>
  );
}