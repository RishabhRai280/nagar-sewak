// frontend/app/login/page.tsx

import LoginForm from '../components/auth/LoginForm';
import { ArrowRight, Lock, Globe, Users } from 'lucide-react';

export default function LoginPage() {
  return (
    <div className="min-h-[calc(100vh-120px)] flex items-center justify-center py-12">
      <div className="w-full max-w-6xl mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Value Proposition */}
          <div className="hidden lg:block">
            <div className="mb-8">
              <h1 className="text-5xl font-bold text-slate-900 mb-4">
                Welcome to
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"> Nagar Sewak</span>
              </h1>
              <p className="text-xl text-slate-600 leading-relaxed">
                Access your account to track projects, report issues, and be part of transparent governance in your city.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-blue-100">
                    <Globe className="text-blue-600" size={24} />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Real-Time Tracking</h3>
                  <p className="text-slate-600 mt-1">Monitor all projects and complaints as they happen</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-emerald-100">
                    <Lock className="text-emerald-600" size={24} />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Secure & Private</h3>
                  <p className="text-slate-600 mt-1">Your data is protected with enterprise-grade security</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-orange-100">
                    <Users className="text-orange-600" size={24} />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Community Driven</h3>
                  <p className="text-slate-600 mt-1">Be part of a movement for transparent governance</p>
                </div>
              </div>
            </div>

            <div className="mt-12 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
              <p className="text-sm text-slate-700">
                <strong>New here?</strong> Create a free account to start reporting issues and tracking projects in real-time.
              </p>
            </div>
          </div>

          {/* Right Side - Form */}
          <div>
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}