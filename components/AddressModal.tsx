"use client";

import React, { useEffect, useState } from "react";
import { addAddress, updateAddress } from "@/lib/actions/address.actions";
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
  editAddress?: {
    id: string;
    name: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    isDefault: boolean;
  } | null;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const EMPTY_FORM = {
  name: "",
  address: "",
  city: "",
  state: "",
  zip: "",
  country: "Philippines",
  isDefault: false,
};

const AddressModal = ({
  onAddressAdded,
  trigger,
  editAddress,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: AddressModalProps) => {
  const isEditMode = !!editAddress;

  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = controlledOnOpenChange ?? setInternalOpen;

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(EMPTY_FORM);

  useEffect(() => {
    if (editAddress) {
      setFormData({
        name: editAddress.name,
        address: editAddress.address,
        city: editAddress.city,
        state: editAddress.state,
        zip: editAddress.zip,
        country: editAddress.country || "Philippines",
        isDefault: editAddress.isDefault,
      });
    } else {
      setFormData(EMPTY_FORM);
    }
  }, [editAddress, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEditMode && editAddress) {
        await updateAddress(editAddress.id, formData);
        toast.success("Address updated successfully! ✓");
      } else {
        await addAddress(formData);
        toast.success("Address added successfully! ✓");
        setFormData(EMPTY_FORM);
      }
      setOpen(false);
      onAddressAdded();
    } catch (error: any) {
      toast.error(error.message || "Failed to save address");
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
      {!isEditMode && (
        <DialogTrigger asChild>
          {trigger || (
            // Compact "+" icon button — fits neatly in the card header
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7 rounded-full cursor-pointer border-black text-black hover:bg-black hover:text-white shrink-0"
              title="Add new address"
            >
              <Plus size={14} />
            </Button>
          )}
        </DialogTrigger>
      )}

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#8C6227]/10 flex items-center justify-center">
              <MapPin className="text-black" size={22} />
            </div>
            <div>
              <DialogTitle className="text-xl">
                {isEditMode ? "Edit Delivery Address" : "Add New Delivery Address"}
              </DialogTitle>
              <DialogDescription>
                Please provide accurate delivery information
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-2">
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

          <div className="flex items-center space-x-3 bg-neutral-50 p-3 rounded-lg">
            <Checkbox
              className="cursor-pointer"
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

          <Button
            type="submit"
            className="w-full h-12 bg-black hover:bg-neutral-800 text-white rounded-full text-base font-medium"
            disabled={loading}
          >
            {loading
              ? isEditMode
                ? "Saving Changes..."
                : "Saving Address..."
              : isEditMode
              ? "Save Changes"
              : "Save & Continue"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddressModal;