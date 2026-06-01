import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import SuccessClient from "./SuccessClient";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAF8F4] flex items-center justify-center">
          <Loader2 className="animate-spin text-[#8C6227]" size={32} />
        </div>
      }
    >
      <SuccessClient />
    </Suspense>
  );
}