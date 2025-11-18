// frontend/app/register/page.tsx

import RegisterForm from '../components/auth/RegisterForm';
import { ArrowRight, Shield, MapPin, Users } from 'lucide-react';
import Link from 'next/link';

export default function RegisterPageWrapper() {
  return (
    <div className="min-h-[calc(100vh-120px)] flex items-center justify-center py-12">
      <div className="w-full max-w-6xl mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Side - Form (Now the first item on desktop) */}
          <div>
            <RegisterForm />
          </div>

          {/* Right Side - Value Proposition (Now the second item on desktop) */}
          <div className="lg:block lg:order-2">
            <div className="mb-8">
              <h1 className="text-5xl font-bold text-slate-900 mb-4">
                Join the
                <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent"> Citizen Movement</span>
              </h1>
              <p className="text-xl text-slate-600 leading-relaxed">
                Register now to become an active participant in improving your city's governance and infrastructure.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-emerald-100">
                    <MapPin className="text-emerald-600" size={24} />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Geo-Tagged Reporting</h3>
                  <p className="text-slate-600 mt-1">Submit issues with precise location for quick resolution.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-blue-100">
                    <Shield className="text-blue-600" size={24} />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Accountability Built-in</h3>
                  <p className="text-slate-600 mt-1">Rate contractors and ensure quality public works.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-orange-100">
                    <Users className="text-orange-600" size={24} />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Transparent Community</h3>
                  <p className="text-slate-600 mt-1">See project budgets and statuses clearly on the map.</p>
                </div>
              </div>
            </div>

            <div className="mt-12 p-6 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border border-emerald-100">
              <Link
                href="/login"
                className="text-sm font-semibold text-emerald-700 hover:text-emerald-900 flex items-center gap-2"
              >
                Already registered? Login here <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}