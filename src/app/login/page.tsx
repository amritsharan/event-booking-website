// src/app/login/page.tsx
import { Suspense } from 'react';
import { LoginForm } from '@/components/login-form';
import { Loader2 } from 'lucide-react';

// A fallback component to show while the main form is loading
function Loading() {
  return (
    <div className="container flex items-center justify-center py-12 md:py-24">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
    </div>
  );
}

export default function LoginPageWrapper() {
  return (
    <Suspense fallback={<Loading />}>
      <LoginForm />
    </Suspense>
  );
}
