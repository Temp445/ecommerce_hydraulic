"use client";

import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { Plus } from "lucide-react";
import { useAuth } from "@/context/AuthProvider";
import AddressForm from "@/Components/AddressPage/AddressForm";
import AddressList from "@/Components/AddressPage/AddressList";

interface AddressType {
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

const AddressPage = () => {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState<AddressType[]>([]);
  const [editingAddress, setEditingAddress] = useState<AddressType | null>(null);
  const [showForm, setShowForm] = useState(false);

  const fetchAddresses = async (userId: string) => {
    try {
      const res = await axios.get(`/api/address?userId=${userId}`);
      setAddresses(res.data.data || []);
    } catch {
      toast.error("Failed to load addresses");
    }
  };

  useEffect(() => {
    if (user?._id) fetchAddresses(user._id);
  }, [user]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this address?")) return;
    try {
      const res = await axios.delete(`/api/address/${id}`);
      toast.success(res.data.message || "Address deleted");
      fetchAddresses(user?._id ?? "");
    } catch {
      toast.error("Failed to delete address");
    }
  };

  const handleFormSave = () => {
    setShowForm(false);
    setEditingAddress(null);
    fetchAddresses(user?._id ?? "");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Addresses</h1>
          <p className="text-slate-600">Manage your delivery addresses</p>
        </div>

        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="mb-6 flex items-center gap-2 text-gray-900 border px-6 py-3 rounded hover:text-white hover:bg-emerald-600 hover:border-emerald-600 transition-all shadow-md hover:shadow-lg"
          >
            <Plus size={20} />
            Add New Address
          </button>
        )}

        {showForm && user?._id && (
          <AddressForm
            userId={user._id}
            editingAddress={editingAddress}
            onSave={handleFormSave}
            onCancel={() => {
              setShowForm(false);
              setEditingAddress(null);
            }}
          />
        )}

        <AddressList
          addresses={addresses}
          onEdit={(addr) => {
            setEditingAddress(addr);
            setShowForm(true);
          }}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
};

export default AddressPage;
