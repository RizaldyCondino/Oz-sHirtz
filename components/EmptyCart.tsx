"use client";

import React from "react";
import { motion } from "framer-motion";
// import Image from "next/image";
// // import { emptyCart } from "@/images";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";

const EmptyCart = () => {
  return (
    <div className="py-10 md:py-20 bg-gradient-to-b from-shop_light_green/3 to-white flex items-center justify-center p-4">
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
          {/* <Image
            src={emptyCart}
            alt="Empty shopping cart"
            fill
            className="object-contain drop-shadow-lg"
          /> */}

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
            className="absolute -top-4 -right-4 bg-shop_dark_green rounded-full p-2"
          >
            <ShoppingCart size={24} className="text-white" />
          </motion.div>
        </motion.div>

        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold text-gray-800">
            Your cart is feeling lonely.
          </h2>

          <p className="text-gray-600">
            It looks like you haven&apos;t added anything to your cart yet.
            Let&apos;s change that and find some amazing products for you!
          </p>
        </div>

        <div>
          <Link
            href="/"
            className="block bg-shop_dark_green border text-white border-darkColor/20 text-center py-2.5 rounded-full text-sm font-semibold tracking-wide hover:opacity-80 hoverEffect"
          >
            Discover Products
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default EmptyCart;