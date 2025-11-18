'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthProvider';
import { ShieldOff, Store } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading, isAdmin } = useAuth();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (!loading) setIsChecking(false);
  }, [loading]);

  if (isChecking || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-20 h-20">
            <div className="absolute inset-0 border-4 border-emerald-200 rounded-full" />
            <div className="absolute inset-0 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  if (user && isAdmin) return <>{children}</>;

  return (
    <section className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-lg w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-gray-100">
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 bg-red-50 rounded-2xl flex items-center justify-center">
              <ShieldOff className="w-10 h-10 text-red-500" />
            </div>
          </div>

          <div className="text-center mb-8">
            <div className="inline-block px-4 py-1.5 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-full mb-4">
              AUTHORIZATION ERROR
            </div>
            <h1 className="text-3xl md:text-4xl font-medium text-gray-900 mb-4">
              Admin Only <span className="text-red-600">Zone</span>
            </h1>
            <p className="text-gray-600 text-base leading-relaxed max-w-md mx-auto">
              Oops! Looks like you're trying to access an admin-only area. This section is restricted to authorized personnel with administrative privileges.
            </p>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => router.push('/')}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-emerald-600 text-white font-semibold rounded-xl shadow-lg hover:bg-emerald-700 hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
            >
              <Store className="w-5 h-5" />
              Return to Home
            </button>
          </div>

          <p className="text-sm text-gray-500 text-center mt-8">
            Want admin access? Switch to your admin account to continue.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ProtectedRoute;