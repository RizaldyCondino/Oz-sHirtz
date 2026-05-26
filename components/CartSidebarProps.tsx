// import React from 'react'

// const CartSidebarProps = () => {
//   return (
//     <div>CartSidebarProps</div>
//   )
// }

// export default CartSidebarProps
// "use client";

// import React from "react";
// import { X, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
// import PriceFormatter from "./PriceFormatter";
// import { CartItem } from "@/types/cart";

// interface CartSidebarProps {
//   isOpen: boolean;
//   onClose: () => void;
//   items: CartItem[];
//   onUpdateQuantity: (id: string, newQuantity: number) => void;
//   onRemoveItem: (id: string) => void;
// }

// export default function CartSidebar({
//   isOpen,
//   onClose,
//   items,
//   onUpdateQuantity,
//   onRemoveItem,
// }: CartSidebarProps) {
  
//   // Calculate Totals exactly like a high-end storefront
//   const subtotal = items.reduce((acc, item) => {
//     const activePrice = item.discountedPrice ?? item.price;
//     return acc + activePrice * item.quantity;
//   }, 0);

//   const totalSavings = items.reduce((acc, item) => {
//     if (item.discountedPrice) {
//       return acc + (item.price - item.discountedPrice) * item.quantity;
//     }
//     return acc;
//   }, 0);

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 z-50 overflow-hidden" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
//       {/* Backdrop overlay */}
//       <div 
//         className="absolute inset-0 bg-black/30 backdrop-blur-xs transition-opacity cursor-pointer" 
//         onClick={onClose}
//       />

//       <div className="absolute inset-y-0 right-0 pl-10 max-w-full flex">
//         <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col h-full">
          
//           {/* Header Panel */}
//           <div className="px-4 sm:px-6 py-5 border-b border-neutral-100 flex items-center justify-between">
//             <div className="flex items-center gap-2">
//               <ShoppingBag size={16} className="text-black" />
//               <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-900">
//                 Your Bag ({items.reduce((sum, item) => sum + item.quantity, 0)})
//               </h2>
//             </div>
//             <button
//               type="button"
//               className="p-1 rounded-full text-neutral-400 hover:text-black hover:bg-neutral-50 transition cursor-pointer"
//               onClick={onClose}
//             >
//               <X size={18} />
//             </button>
//           </div>

//           {/* Scrollable Items Container */}
//           <div className="flex-1 overflow-y-auto py-4 px-4 sm:px-6 scrollbar-hide">
//             {items.length === 0 ? (
//               <div className="h-full flex flex-col items-center justify-center text-center py-12">
//                 <ShoppingBag size={32} className="text-neutral-300 stroke-[1.5] mb-4" />
//                 <p className="text-xs font-medium text-neutral-900 uppercase tracking-wider">Your bag is empty</p>
//                 <p className="text-xs text-neutral-400 mt-1 max-w-[200px]">Once you add items, they’ll show up right here.</p>
//                 <button
//                   onClick={onClose}
//                   className="mt-6 px-6 py-2.5 text-[10px] uppercase tracking-wider font-semibold rounded-full bg-black text-white hover:opacity-90 transition cursor-pointer"
//                 >
//                   Continue Shopping
//                 </button>
//               </div>
//             ) : (
//               <div className="space-y-6">
//                 {items.map((item) => {
//                   const hasDiscount = !!item.discountedPrice;
                  
//                   return (
//                     <div key={item.id} className="flex gap-4 pb-6 border-b border-neutral-100 last:border-0 last:pb-0">
//                       {/* Product Thumbnail image preview wrapper */}
//                       <div className="w-20 h-24 bg-neutral-50 rounded-xs overflow-hidden flex-shrink-0 border border-neutral-100">
//                         <img 
//                           src={item.image} 
//                           alt={item.productName} 
//                           className="w-full h-full object-cover mix-blend-multiply"
//                         />
//                       </div>

//                       {/* Item Details */}
//                       <div className="flex-1 flex flex-col text-left justify-between py-0.5">
//                         <div>
//                           <div className="flex justify-between items-start gap-2">
//                             <h3 className="text-xs font-semibold text-neutral-900 line-clamp-1">
//                               {item.productName}
//                             </h3>
//                             <div className="text-xs font-semibold text-right whitespace-nowrap">
//                               {hasDiscount ? (
//                                 <div className="flex flex-col items-end">
//                                   <span className="text-[#8C6227]"><PriceFormatter amount={item.discountedPrice!} /></span>
//                                   <span className="text-[10px] text-neutral-400 line-through font-normal"><PriceFormatter amount={item.price} /></span>
//                                 </div>
//                               ) : (
//                                 <PriceFormatter amount={item.price} />
//                               )}
//                             </div>
//                           </div>
                          
//                           {item.brandTitle && (
//                             <p className="text-[10px] uppercase font-mono text-neutral-400 tracking-wider mt-0.5">
//                               {item.brandTitle}
//                             </p>
//                           )}
                          
//                           {item.selectedSize && (
//                             <span className="inline-block mt-2 px-2 py-0.5 text-[9px] font-medium bg-neutral-100 text-neutral-600 rounded-sm">
//                               Size: {item.selectedSize}
//                             </span>
//                           )}
//                         </div>

//                         {/* Interactive Quantity Adjusters */}
//                         <div className="flex items-center justify-between mt-2">
//                           <div className="flex items-center border border-neutral-200 rounded-full bg-white px-1 py-0.5">
//                             <button
//                               type="button"
//                               onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
//                               className="p-1 text-neutral-500 hover:text-black transition disabled:opacity-30 cursor-pointer"
//                               disabled={item.quantity <= 1}
//                             >
//                               <Minus size={10} />
//                             </button>
//                             <span className="text-[11px] font-medium font-mono px-2 text-neutral-900 select-none">
//                               {item.quantity}
//                             </span>
//                             <button
//                               type="button"
//                               onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
//                               className="p-1 text-neutral-500 hover:text-black transition disabled:opacity-30 cursor-pointer"
//                               disabled={item.quantity >= item.maxStock}
//                             >
//                               <Plus size={10} />
//                             </button>
//                           </div>

//                           <button
//                             type="button"
//                             onClick={() => onRemoveItem(item.id)}
//                             className="text-[10px] font-medium text-neutral-400 underline hover:text-red-600 transition cursor-pointer"
//                           >
//                             Remove
//                           </button>
//                         </div>

//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             )}
//           </div>

//           {/* Sticky Checkout Footer */}
//           {items.length > 0 && (
//             <div className="border-t border-neutral-100 py-6 px-4 sm:px-6 bg-neutral-50/50">
//               <div className="space-y-1.5 mb-4 text-xs">
//                 {totalSavings > 0 && (
//                   <div className="flex justify-between items-center text-emerald-700 font-medium">
//                     <span>Total Savings</span>
//                     <span>-<PriceFormatter amount={totalSavings} /></span>
//                   </div>
//                 )}
//                 <div className="flex justify-between items-center text-neutral-500">
//                   <span>Shipping</span>
//                   <span className="uppercase tracking-wider text-[10px] font-bold text-emerald-700">Calculated next</span>
//                 </div>
//                 <div className="flex justify-between items-center text-sm font-semibold text-neutral-900 pt-2 border-t border-neutral-100">
//                   <span>Subtotal</span>
//                   <span><PriceFormatter amount={subtotal} /></span>
//                 </div>
//               </div>

//               {/* Action Trigger Buttons Container */}
//               <div className="space-y-2">
//                 <button
//                   type="button"
//                   className="w-full flex items-center justify-center gap-2 py-3 px-4 text-[11px] uppercase tracking-wider font-semibold rounded-full bg-black text-white transition hover:opacity-90 cursor-pointer"
//                 >
//                   Proceed to Checkout
//                   <ArrowRight size={12} />
//                 </button>
//                 <button
//                   type="button"
//                   onClick={onClose}
//                   className="w-full py-3 px-4 text-[11px] uppercase tracking-wider font-semibold rounded-full border border-neutral-200 bg-white text-neutral-900 transition hover:bg-neutral-50 cursor-pointer"
//                 >
//                   View Full Bag
//                 </button>
//               </div>
//             </div>
//           )}

//         </div>
//       </div>
//     </div>
//   );
// }