import Logo from "@/components/Logo";
import Link from "next/link";
import React from "react";

const NotFoundPage = () => {
  return (
    <div className="bg-[#FAF8F4] flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-10 md:py-32 min-h-screen">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Logo className="text-6xl"/>
          <h2 className="mt-6 text-3xl font-extrabold text-black">
            Looking for something?
          </h2>
          <p className="mt-2 text-sm text-neutral-600">
            We&apos;re sorry. The Web address you entered is not a functioning
            page on our site.
          </p>
        </div>

        <div className="mt-8 space-y-6">
          <div className="rounded-md  space-y-4">
            {/* Primary Black Button */}
            <Link
              href="/"
              className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-sm font-semibold rounded-xs
                    text-white bg-black hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-offset-2
                    focus:ring-black transition-all hoverEffect
                    "
            >
              Go to OzCrtz&apos;s home page
            </Link>

            {/* Secondary Button */}
            <Link
              href="/help"
              className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 text-sm font-semibold rounded-xs
                    text-black bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black
                    transition-all
                    "
            >
              Need Help?
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;