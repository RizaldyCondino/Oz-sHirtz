import React, { useState } from 'react';
import { X } from 'lucide-react';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Tab = 'men' | 'women' | 'kids';

export default function SizeGuideModal({ isOpen, onClose }: SizeGuideModalProps) {
  const [activeTab, setActiveTab] = useState<Tab>('men');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      {/* Backdrop */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal Content */}
      <div className="relative w-full max-w-lg max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col z-10">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-100 px-6 py-5">
          <div>
            <h2 className="text-lg font-semibold text-neutral-900">Size Guide</h2>
            <p className="text-xs text-neutral-500 mt-0.5">Body Measurements • Nike Fit</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-neutral-100 transition text-neutral-400 hover:text-black"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-neutral-200 px-6">
          {(['men', 'women', 'kids'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-4 text-sm font-medium transition border-b-2 -mb-[1px] ${
                activeTab === tab
                  ? 'border-black text-black'
                  : 'border-transparent text-neutral-500 hover:text-neutral-700'
              }`}
            >
              {tab === 'men' && 'Men'}
              {tab === 'women' && 'Women'}
              {tab === 'kids' && 'Kids'}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1 p-6">
          {activeTab === 'men' && (
            <div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-neutral-600">
                  <thead>
                    <tr className="border-b text-xs uppercase tracking-widest text-neutral-500">
                      <th className="py-3 text-left font-medium">Size</th>
                      <th className="py-3 text-left font-medium">Chest (in)</th>
                      <th className="py-3 text-left font-medium">Waist (in)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y text-[13px]">
                    <tr><td className="py-3 font-semibold text-neutral-900">XS</td><td>31.5 - 35</td><td>25.5 - 29</td></tr>
                    <tr><td className="py-3 font-semibold text-neutral-900">S</td><td>35 - 37.5</td><td>29 - 32</td></tr>
                    <tr><td className="py-3 font-semibold text-neutral-900">M</td><td>37.5 - 41</td><td>32 - 35</td></tr>
                    <tr><td className="py-3 font-semibold text-neutral-900">L</td><td>41 - 44</td><td>35 - 38</td></tr>
                    <tr><td className="py-3 font-semibold text-neutral-900">XL</td><td>44 - 48.5</td><td>38 - 43</td></tr>
                    <tr><td className="py-3 font-semibold text-neutral-900">XXL</td><td>48.5 - 53.5</td><td>43 - 47.5</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'women' && (
            <div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-neutral-600">
                  <thead>
                    <tr className="border-b text-xs uppercase tracking-widest text-neutral-500">
                      <th className="py-3 text-left font-medium">Size</th>
                      <th className="py-3 text-left font-medium">Bust (in)</th>
                      <th className="py-3 text-left font-medium">Waist (in)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y text-[13px]">
                    <tr><td className="py-3 font-semibold text-neutral-900">XS</td><td>29.5 - 32.5</td><td>23.5 - 26</td></tr>
                    <tr><td className="py-3 font-semibold text-neutral-900">S</td><td>32.5 - 35.5</td><td>26 - 29</td></tr>
                    <tr><td className="py-3 font-semibold text-neutral-900">M</td><td>35.5 - 38</td><td>29 - 31.5</td></tr>
                    <tr><td className="py-3 font-semibold text-neutral-900">L</td><td>38 - 41</td><td>31.5 - 34.5</td></tr>
                    <tr><td className="py-3 font-semibold text-neutral-900">XL</td><td>41 - 44.5</td><td>34.5 - 38.5</td></tr>
                    <tr><td className="py-3 font-semibold text-neutral-900">XXL</td><td>44.5 - 48.5</td><td>38.5 - 42.5</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'kids' && (
            <div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-neutral-600">
                  <thead>
                    <tr className="border-b text-xs uppercase tracking-widest text-neutral-500">
                      <th className="py-3 text-left font-medium">Size</th>
                      <th className="py-3 text-left font-medium">Numeric</th>
                      <th className="py-3 text-left font-medium">Chest (in)</th>
                      <th className="py-3 text-left font-medium">Waist (in)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y text-[13px]">
                    <tr><td className="py-3 font-semibold text-neutral-900">XS</td><td>6-7</td><td>24 - 25.5</td><td>19.5 - 22</td></tr>
                    <tr><td className="py-3 font-semibold text-neutral-900">S</td><td>8-9</td><td>25.5 - 27.5</td><td>22 - 24.5</td></tr>
                    <tr><td className="py-3 font-semibold text-neutral-900">M</td><td>10-12</td><td>27.5 - 30</td><td>24.5 - 26.5</td></tr>
                    <tr><td className="py-3 font-semibold text-neutral-900">L</td><td>14-16</td><td>30 - 33</td><td>26.5 - 29</td></tr>
                    <tr><td className="py-3 font-semibold text-neutral-900">XL</td><td>18-20</td><td>33 - 36</td><td>29 - 31.5</td></tr>
                  </tbody>
                </table>
              </div>
              <p className="text-[11px] text-neutral-500 mt-4">Kids sizing is now unified (no longer split by boys/girls).</p>
            </div>
          )}
        </div>

        {/* Footer Tips */}
        <div className="border-t border-neutral-100 p-6 bg-neutral-50 text-[11px] text-neutral-500">
          <p className="leading-relaxed">
            If you're between sizes, we recommend sizing up for a more relaxed fit or down for a tighter fit.
          </p>
        </div>
      </div>
    </div>
  );
}