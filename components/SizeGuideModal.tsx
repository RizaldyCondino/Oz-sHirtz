import React, { useState } from "react";
import { X, Shirt, Footprints } from "lucide-react";
import { sizeGuideData, Tab, Category } from "@/constants/data";

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: Tab;
  defaultCategory?: Category;
}

export default function SizeGuideModal({
  isOpen,
  onClose,
  defaultTab,
  defaultCategory,
}: SizeGuideModalProps) {
  const [activeTab, setActiveTab] = useState<Tab>(defaultTab ?? "men");
  const [activeCategory, setActiveCategory] = useState<Category>(
    defaultCategory ?? "apparel",
  );

  if (!isOpen) return null;

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
  };

  const tabData = sizeGuideData[activeTab];
  const currentData = tabData[activeCategory] ?? tabData["apparel"];
  const showShoes = activeCategory === "shoes" && !!tabData["shoes"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-lg max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col z-10">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5">
          <div>
            <h2 className="text-xs font-semibold text-neutral-900">
              Size Guide
            </h2>
            <p className="text-xs text-neutral-400 mt-0.5 uppercase tracking-widest">
              Body Measurements · Nike Fit
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-neutral-100 transition text-neutral-400 hover:text-black"
          >
            <X size={18} />
          </button>
        </div>

        {/* Gender Tabs */}
        <div className="flex px-6 gap-1">
          {(["men", "women", "kids"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`flex-1 py-3 text-sm font-medium transition rounded-t-xl capitalize ${
                activeTab === tab
                  ? "bg-neutral-100 text-neutral-900"
                  : "text-neutral-400 hover:text-neutral-600"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1 bg-neutral-100 px-6 py-5">
          {/* Category Pills */}

          {/* Category Pills */}
          <div className="flex gap-2 mb-5">
            {(defaultCategory === undefined ||
              defaultCategory === "apparel") && (
              <button
                onClick={() => setActiveCategory("apparel")}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition border ${
                  activeCategory === "apparel"
                    ? "bg-neutral-900 text-white border-neutral-900"
                    : "bg-white text-neutral-500 border-neutral-200 hover:bg-neutral-50"
                }`}
              >
                <Shirt size={13} />
                Apparel
              </button>
            )}

            {(defaultCategory === undefined || defaultCategory === "shoes") && (
              <button
                onClick={() => setActiveCategory("shoes")}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition border ${
                  activeCategory === "shoes"
                    ? "bg-neutral-900 text-white border-neutral-900"
                    : "bg-white text-neutral-500 border-neutral-200 hover:bg-neutral-50"
                }`}
              >
                <Footprints size={13} />
                Shoes
              </button>
            )}
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            {(activeCategory === "apparel" || showShoes) && (
              <ApparelTable
                headers={currentData.headers}
                rows={currentData.rows}
              />
            )}

            {activeCategory === "shoes" && !showShoes && (
              <p className="text-[12px] text-neutral-400 mt-4">
                No shoe sizes available for this category.
              </p>
            )}

            {currentData.note && (
              <p className="text-[11px] text-neutral-400 mt-3">
                {currentData.note}
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-neutral-100 px-6 py-4 bg-white flex items-center gap-3">
          <span className="text-neutral-300 text-base">⌀</span>
          <p className="text-[11px] text-neutral-400 leading-relaxed">
            Between sizes? Size up for a relaxed fit, or down for a tighter one.
          </p>
        </div>
      </div>
    </div>
  );
}

function ApparelTable({
  headers,
  rows,
}: {
  headers: string[];
  rows: string[][];
}) {
  return (
    <table className="w-full text-sm text-neutral-600">
      <thead>
        <tr className="border-b border-neutral-200">
          {headers.map((h) => (
            <th
              key={h}
              className="py-3 text-left text-[10px] font-medium uppercase tracking-widest text-neutral-400"
            >
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-neutral-200">
        {rows.map((row) => (
          <tr key={row[0]} className="hover:bg-white transition-colors">
            <td className="py-3 font-semibold text-neutral-900 text-[13px]">
              {row[0]}
            </td>
            {row.slice(1).map((cell, i) => (
              <td key={i} className="py-3 text-[13px]">
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
