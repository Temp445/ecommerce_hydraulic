"use client";

import React from "react";
import { MapPin, Phone, Edit2, Trash2 } from "lucide-react";

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

interface AddressListProps {
  addresses: AddressType[];
  onEdit: (address: AddressType) => void;
  onDelete: (id: string) => void;
}

const AddressList: React.FC<AddressListProps> = ({
  addresses,
  onEdit,
  onDelete,
}) => {
  if (addresses.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-md p-12 text-center border border-slate-200">
        <MapPin size={48} className="mx-auto text-slate-300 mb-4" />
        <p className="text-slate-500 text-lg">No addresses found.</p>
        <p className="text-slate-400 text-sm mt-2">
          Add your first delivery address to get started
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {addresses.map((addr) => (
        <div
          key={addr._id}
          className="bg-white rounded-xl shadow-md p-5 border border-slate-200 hover:shadow-lg transition-all"
        >
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-start gap-3">
              <div className="bg-emerald-100 p-2 rounded-lg">
                <MapPin size={20} className="text-emerald-600" />
              </div>
              <div>
                <h4 className="font-semibold text-lg text-slate-900">
                  {addr.Name}
                </h4>
                <div className="flex items-center gap-2 text-sm text-slate-600 mt-1">
                  <Phone size={14} />
                  <span>{addr.MobileNumber}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => onEdit(addr)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                title="Edit"
              >
                <Edit2 size={18} />
              </button>
              <button
                onClick={() => onDelete(addr._id!)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                title="Delete"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>

          <div className="ml-11 space-y-1 text-slate-600">
            <p>{addr.Address}</p>
            {addr.LandMark && (
              <p className="text-sm text-slate-500">Landmark: {addr.LandMark}</p>
            )}
            <p className="text-sm">
              {addr.City}, {addr.State && `${addr.State}, `} {addr.Country} -{" "}
              <span className="font-medium">{addr.PinCode}</span>
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AddressList;
