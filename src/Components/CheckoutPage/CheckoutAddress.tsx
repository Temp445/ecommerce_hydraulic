"use client";

import React, { useEffect, useState } from "react";
import { MapPin, Plus, PhoneCall } from "lucide-react";
import { useAuth } from "@/context/AuthProvider";
import toast from "react-hot-toast";
import axios from "axios";
import AddressForm from "../AddressPage/AddressForm";
import "react-phone-number-input/style.css";

export interface AddressType {
  _id?: string;
  userId: string;
  Name: string;
  MobileNumber: string;
  PinCode: string;
  Address: string;
  City: string;
  LandMark?: string;
  State?: string;
  Country?: string;
}

interface CheckoutAddressProps {
  selectedAddressId: string;
  onSelect: React.Dispatch<React.SetStateAction<string>>;
}

const CheckoutAddress = ({
  selectedAddressId,
  onSelect,
}: CheckoutAddressProps) => {

  const { user } = useAuth();

  const [addresses, setAddresses] = useState<AddressType[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<AddressType | null>(null);

  const fetchAddresses = async (userId: string) => {
    try {
      const res = await axios.get(`/api/address?userId=${userId}`);
      setAddresses(res.data.data || []);
    } catch {
      toast.error("Failed to load addresses");
    }
  };

  useEffect(() => {
    if (user?._id) {
      fetchAddresses(user._id);
    }
  }, [user]);

  const handleSave = async () => {
    if (!user?._id) return;
    await fetchAddresses(user._id);
    setShowForm(false);
    setEditingAddress(null);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingAddress(null);
  };

  return (
    <section className="bg-white rounded-2xl p-2 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font- flex items-center gap-3 text-slate-900">
          <div className="bg-emerald-500 p-2.5 rounded-xl">
            <MapPin className="text-white w-5 h-5" />
          </div>
          Delivery Address
        </h2>
      </div>

   {addresses.length > 0 && !showForm && (
  <div className="space-y-4 mb-6">
    {addresses.map((addr) => (
      <label
        key={addr._id}
        className={`relative block border p-5 rounded-xl cursor-pointer transition-all duration-200 ${
          selectedAddressId === addr._id
            ? "border-emerald-600 bg-emerald-50/50 shadow-md"
            : "border-gray-200 hover:border-gray-400 hover:shadow-sm bg-white"
        }`}
      >
        {selectedAddressId === addr._id && (
          <div className="absolute -top-3 right-4 bg-emerald-600 text-white text-xs  px-3 py-1 rounded shadow-md">
            Delivery Here
          </div>
        )}

        <div className="flex items-start gap-4">
          <input
            type="radio"
            name="address"
            value={addr._id}
            checked={selectedAddressId === addr._id}
            onChange={(e) => onSelect(e.target.value)}
            className="mt-1 w-5 h-5 accent-emerald-600 cursor-pointer flex-shrink-0"
          />

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-medium text-lg text-slate-900">
                {addr.Name}
              </span>
            </div>

            <p className="text-slate-800 leading-relaxed mb-3">
              {addr.Address && <>{addr.Address}, </>}
              {addr.City && <>{addr.City}, </>}
              {addr.State && <>{addr.State} - </>}
              {addr.PinCode}
              {addr.Country && <>, {addr.Country}</>} 
              
               {addr.LandMark && (
                <span className="font-medium text-sm text-slate-800 mb-3"> | Landmark: {addr.LandMark} </span>
            )}
            </p>

            <div className="flex items-center gap-2 text-slate-800">
              <PhoneCall className="w-4 h-4 flex-shrink-0" />
              <span className="font-medium">{addr.MobileNumber}</span>
            </div>
          </div>
        </div>
      </label>
    ))}
  </div>
)}

      {!addresses.length && !showForm && (
        <div className="text-center py-12 bg-slate-50 rounded-xl border-2 border-dashed border-slate-300 mb-6">
          <MapPin className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <p className="text-slate-500 text-lg">No saved addresses yet.</p>
          <p className="text-slate-400 text-sm mt-1">Add your first delivery address</p>
        </div>
      )}

      {!showForm ? (
        <button
          onClick={() => {
            setShowForm(true);
            setEditingAddress(null);
          }}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gray-900 text-white  px-6 py-3 rounded-lg hover:bg-emerald-700 transition-all duration-200 shadow-sm hover:shadow-md"
        >
          <Plus size={20} /> Add New Address
        </button>
      ) : (
        <div>
          <AddressForm
            userId={user?._id || ""}
            editingAddress={editingAddress}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        </div>
      )}
    </section>
  );
}

export default CheckoutAddress;