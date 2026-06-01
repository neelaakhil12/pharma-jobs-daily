import { Suspense } from 'react';
import JobsClient from '@/components/JobsClient';
import { Loader2 } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function JobsPage() {
  return (
    <div className="bg-[#F8FAFC] min-h-screen">
      <Suspense
        fallback={
          <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
            <Loader2 className="w-10 h-10 text-[#16A34A] animate-spin" />
            <span className="text-slate-500 text-xs font-semibold">Loading opportunities board...</span>
          </div>
        }
      >
        <JobsClient />
      </Suspense>
    </div>
  );
}
