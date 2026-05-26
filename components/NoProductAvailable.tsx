"use client"
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

const NoProductAvailable = ({
  selectedTab,
  // subSlug,
  className,
}: {
  selectedTab?: string;
  // subSlug?: string;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "border border-[#E7DED2] rounded-2xl bg-white px-6 py-14 text-center flex flex-col items-center gap-3 w-full mt-10",
        className,
      )}
    >
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-xl font-medium text-gray-800"
      >
        No products available
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-sm tracking-wide text-[#7A6E61] max-w-sm leading-relaxed"
      >
        We&apos;re sorry, but there are no products matching{" "}
        {selectedTab && (
          <span className="font-medium text-gray-800">&ldquo;{selectedTab}&rdquo;</span>
        )}{" "}
        criteria at the moment.
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex items-center gap-2 text-sm text-[#7A6E61]"
      >
        <Loader2 className="w-4 h-4 animate-spin" />
        <span>We&apos;re restocking shortly</span>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="text-xs text-[#A89880]"
      >
        Please check back later or explore our other product categories.
      </motion.p>

      {/* {subSlug && process.env.NODE_ENV === "development" && (
        <p className="text-xs text-[#aaa] mt-2">
          Filtering by category slug <code>{subSlug}</code>. If this looks
          wrong, visit{" "}
          <a href="?debug=1" className="underline">
            ?debug=1
          </a>{" "}
          to inspect raw Sanity slugs.
        </p>
      )} */}
    </div>
  );
};

export default NoProductAvailable;