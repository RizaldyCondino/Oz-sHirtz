"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { emptyCart } from "@/public/Images";

const EmptyCart = () => {
  return (
    <div className="py-10 md:py-20 bg-[#FAF8F4] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full space-y-8"
      >
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 5,
            ease: "easeInOut",
          }}
          className="relative w-48 h-48 mx-auto"
        >

          <Image
            src={emptyCart}
            alt="Empty shopping cart"
            fill
            className="object-contain drop-shadow-lg"
          />


          <motion.div
            animate={{
              x: [0, -10, 10, 0],
              y: [0, -5, 5, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 3,
              ease: "linear",
            }}
            className="absolute -top-4 -right-4 bg-black rounded-full p-3"
          >
            <ShoppingCart size={32} className="text-white" />
          </motion.div>
        </motion.div>

        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold text-black">
            Your cart is empty
          </h2>

          <p className="text-neutral-600 text-[15px] leading-relaxed">
            It looks like you haven&apos;t added anything to your cart yet.
            Let&apos;s find some amazing products for you!
          </p>
        </div>

        <div>
          <Link
            href="/"
            className="block bg-black hover:bg-neutral-800 text-white text-center py-3.5 rounded-full text-sm font-semibold tracking-wide transition-all hoverEffect"
          >
            Browse Products
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default EmptyCart;