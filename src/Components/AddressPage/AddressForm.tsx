"use client";

import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { MapPin, Save } from "lucide-react";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import { CountryCode } from "libphonenumber-js";
import "react-phone-number-input/style.css";
import { Country, State } from "country-state-city";
import { postcodeValidator, postcodeValidatorExistsForCountry } from "postcode-validator";

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

interface AddressFormProps {
  userId: string;
  editingAddress: AddressType | null;
  onSave: () => void;
  onCancel: () => void;
}

const AddressForm: React.FC<AddressFormProps> = ({
  userId,
  editingAddress,
  onSave,
  onCancel,
}) => {
  const [formData, setFormData] = useState<AddressType>({
    userId,
    Name: "",
    MobileNumber: "",
    PinCode: "",
    Address: "",
    City: "",
    LandMark: "",
    State: "",
    Country: "",
  });
  const [loading, setLoading] = useState(false);
  const [country, setCountry] = useState("IN");
  const [states, setStates] = useState<any[]>([]);
  const [city, setCity]= useState<any[]>([]);
  const [postal, setPostal]= useState<any[]>([]);

  const countries = Country.getAllCountries();
  const countryCode: CountryCode = (country as CountryCode) || "IN";

  useEffect(() => {
    async function detectCountry() {
      try {
        const { data } = await axios.get("https://ipapi.co/json/");
        if (data?.country_code) {
          setCountry(data.country_code);
          setCity(data.city)
          setPostal(data.postal)
          setFormData((prev) => ({ ...prev, Country: data.country_name }));
          setStates(State.getStatesOfCountry(data.country_code));
        }
      } catch {
        console.warn("Country detection failed");
      }
    }
    detectCountry();
  }, []);

  
  useEffect(() => {
    if (editingAddress) {
      setFormData(editingAddress);
      const countryObj = countries.find((c) => c.name === editingAddress.Country);
      const isoCode = countryObj?.isoCode || "IN";
      setCountry(isoCode);
      setStates(State.getStatesOfCountry(isoCode));
    } else {
      setFormData({
        userId,
        Name: "",
        MobileNumber: "",
        PinCode: "",
        Address: "",
        City: "",
        LandMark: "",
        State: "",
        Country: "",
      });
    }
  }, [editingAddress, userId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setCountry(value);
    const selectedCountry = countries.find((c) => c.isoCode === value);
    setFormData((prev) => ({
      ...prev,
      Country: selectedCountry ? selectedCountry.name : "",
      State: "",
    }));
    setStates(State.getStatesOfCountry(value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.Name ||
      !formData.MobileNumber ||
      !formData.PinCode ||
      !formData.Address ||
      !formData.City
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    if (!isValidPhoneNumber(formData.MobileNumber)) {
      toast.error("Invalid phone number");
      return;
    }

    if (
      postcodeValidatorExistsForCountry(country) &&
      !postcodeValidator(formData.PinCode, country)
    ) {
      toast.error("Invalid postal code");
      return;
    }

    setLoading(true);
    try {
      if (editingAddress?._id) {
        const res = await axios.put(`/api/address/${editingAddress._id}`, formData);
        toast.success(res.data.message || "Address updated");
      } else {
        const res = await axios.post("/api/address", formData);
        toast.success(res.data.message || "Address added");
      }
      onSave();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl md:shadow-lg p-4 md:p-6 mb-8  border border-slate-200">
      <h2 className="text-xl font-semibold mb-6 text-slate-900 flex items-center gap-2">
        <MapPin size={24} className="text-emerald-600" />
        {editingAddress ? "Edit Address" : "Add New Address"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Country <span className="text-red-500">*</span>
          </label>
          <select
            value={country}
            onChange={handleCountryChange}
            className="w-full shadow border border-slate-300 hover:border-gray-600 p-2 rounded-lg"
            required
          >
            <option value="">Select Country</option>
            {countries.map((c) => (
              <option key={c.isoCode} value={c.isoCode}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1"> Full Name <span className="text-red-500">*</span> </label>
            <input
            name="Name"
            placeholder="Full name"
            value={formData.Name}
            onChange={handleChange}
            className="w-full border border-slate-300 p-3 rounded-lg focus:border-gray-900 outline-none transition"
            required
          />
            </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1"> Mobile Number <span className="text-red-500">*</span> </label>
            <PhoneInput
            placeholder="Enter phone number"
            value={formData.MobileNumber}
            onChange={(value) =>
              setFormData({ ...formData, MobileNumber: value || "" })
            }
            defaultCountry={countryCode}
            international
            className="!shadow-none rounded-lg border-slate-300 border focus:border-gray-900 p-3 [&>input]:border-none [&>input]:outline-none [&>input]:bg-transparent"
          />
          </div>
        </div>

        <div>
            <label className="block text-sm font-medium text-slate-700 mb-1"> Full Address <span className="text-red-500">*</span> </label>
          <textarea
          name="Address"
          placeholder="House No., Street Name, Area"
          value={formData.Address}
          onChange={handleChange}
          className="w-full border border-slate-300 p-3 rounded-lg focus:border-gray-900 outline-none transition"
          rows={3}
          required
        />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1"> City <span className="text-red-500">*</span> </label>
          <input
            name="City"
            placeholder={`${city}`}
            value={formData.City}
            onChange={handleChange}
            className="w-full border border-slate-300 p-3 rounded-lg"
            required
          />
          </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1"> Pin Code <span className="text-red-500">*</span> </label>
            <input
            name="PinCode"
            placeholder={`${postal}`}
            value={formData.PinCode}
            onChange={handleChange}
            className="w-full border border-slate-300 p-3 rounded-lg"
            required
          />
        </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium text-gray-700"> State <span className="text-red-500">*</span> </label>
          <select
            value={formData.State || ""}
            onChange={(e) => setFormData({ ...formData, State: e.target.value })}
            className="w-full shadow border border-slate-300 hover:border-gray-600 p-2 rounded-lg"
            required
          >
            <option value="">Select State</option>
            {states.map((s) => (
              <option key={s.isoCode} value={s.name}>
                {s.name}
              </option>
            ))}
          </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1"> Landmark </label>
          <input
            name="LandMark"
            placeholder="Landmark (Optional)"
            value={formData.LandMark}
            onChange={handleChange}
            className="w-full border border-slate-300 p-3 rounded-lg"
          />
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-emerald-600 text-white py-3 rounded-lg hover:bg-emerald-700 disabled:bg-slate-400 transition-all flex items-center justify-center gap-2 shadow-md"
          >
            <Save size={20} />
            {loading ? "Saving..." : editingAddress ? "Update" : "Save"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddressForm;
