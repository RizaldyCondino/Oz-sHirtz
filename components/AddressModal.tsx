"use client";

import React, { useState } from "react";
import { addAddress } from "@/lib/actions/address.actions";
import toast from "react-hot-toast";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, MapPin } from "lucide-react";

interface AddressModalProps {
  onAddressAdded: () => void;
  trigger?: React.ReactNode;
}

const AddressModal = ({ onAddressAdded, trigger }: AddressModalProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "Philippines",
    isDefault: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addAddress(formData);
      toast.success("Address added successfully! ✓");
      
      // Reset form
      setFormData({
        name: "",
        address: "",
        city: "",
        state: "",
        zip: "",
        country: "Philippines",
        isDefault: false,
      });
      
      setOpen(false);
      onAddressAdded();
    } catch (error: any) {
      toast.error(error.message || "Failed to add address");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button 
            variant="outline" 
            className="w-full rounded-full border-[#8C6227]/30 text-[#8C6227] hover:bg-[#8C6227]/10 hover:text-[#8C6227] transition-colors"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add New Address
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#8C6227]/10 flex items-center justify-center">
              <MapPin className="text-[#8C6227]" size={22} />
            </div>
            <div>
              <DialogTitle className="text-xl">Add New Delivery Address</DialogTitle>
              <DialogDescription>
                Please provide accurate delivery information
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-2">
          {/* Address Label */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              Address Label
            </Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Home, Office, Parents House"
              required
              className="h-11"
            />
          </div>

          {/* Street Address */}
          <div className="space-y-2">
            <Label htmlFor="address">Street Address</Label>
            <Input
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="House number, street name, barangay"
              required
              className="h-11"
            />
          </div>

          {/* City & State */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City / Municipality</Label>
              <Input
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">Province</Label>
              <Input
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
                required
                className="h-11"
              />
            </div>
          </div>

          {/* ZIP & Country */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="zip">ZIP Code</Label>
              <Input
                id="zip"
                name="zip"
                value={formData.zip}
                onChange={handleChange}
                required
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="h-11"
              />
            </div>
          </div>

          {/* Default Address Checkbox */}
          <div className="flex items-center space-x-3 bg-neutral-50 p-3 rounded-lg">
            <Checkbox
              id="isDefault"
              checked={formData.isDefault}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({ ...prev, isDefault: !!checked }))
              }
            />
            <Label htmlFor="isDefault" className="cursor-pointer text-sm">
              Set this as my default delivery address
            </Label>
          </div>

          {/* Submit Button */}
          <Button 
            type="submit" 
            className="w-full h-12 bg-[#8C6227] hover:bg-[#7a5420] text-white rounded-full text-base font-medium"
            disabled={loading}
          >
            {loading ? "Saving Address..." : "Save & Continue"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddressModal;