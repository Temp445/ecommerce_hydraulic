"use client";

import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  Loader2,
  Upload,
  X,
  Plus,
  Package,
  IndianRupee ,
  Truck,
  FileImage,
  Wrench,
} from "lucide-react";

interface Category {
  _id: string;
  Name: string;
}

interface TechnicalDetails {
  boreDiameter: string;
  rodDiameter: string;
  strokeLength: string;
  mountingType: string;
  workingPressure: string;
  material: string;
  sealType: string;
  application: string;
}

interface Benefit {
  title: string;
  description: string;
}

interface FormDataState {
  name: string;
  description: string;
  model: string;
  brand: string;
  category: string;
  price: string;
  discountPrice: string;
  stock: string;
  deliveryCharge: string;
  deliveryDate: string;
  isNewArrival: boolean;
  isActive: boolean;
  warranty?: string;
  returnPolicy?: boolean;
}

interface ErrorState {
  [key: string]: string | undefined;
}

const ProductUploadPage: React.FC = () => {
  const router = useRouter();

  const [formData, setFormData] = useState<FormDataState>({
    name: "",
    description: "",
    model: "",
    brand: "",
    category: "",
    price: "",
    discountPrice: "",
    stock: "",
    deliveryCharge: "",
    deliveryDate: "",
    isNewArrival: false,
    isActive: true,
    warranty: "",
    returnPolicy: false,
  });

  const [technicalDetails, setTechnicalDetails] = useState<TechnicalDetails>({
    boreDiameter: "",
    rodDiameter: "",
    strokeLength: "",
    mountingType: "",
    workingPressure: "",
    material: "",
    sealType: "",
    application: "",
  });

  const [benefits, setBenefits] = useState<Benefit[]>([
    { title: "", description: "" },
  ]);

  const [categories, setCategories] = useState<Category[]>([]);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [errors, setErrors] = useState<ErrorState>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get("/api/category");
      setCategories(data.data || []);
    } catch {
      toast.error("Failed to load categories");
    }
  };

  const validateForm = (): boolean => {
    const newErrors: ErrorState = {};
    if (!formData.name.trim()) newErrors.name = "Product name is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.price || parseFloat(formData.price) <= 0)
      newErrors.price = "Valid price is required";
    if (!formData.stock || parseInt(formData.stock) < 0)
      newErrors.stock = "Valid stock quantity is required";
    if (
      formData.discountPrice &&
      parseFloat(formData.discountPrice) >= parseFloat(formData.price)
    )
      newErrors.discountPrice = "Discount price must be less than price";


    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleTechChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTechnicalDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBenefitChange = (
    index: number,
    field: keyof Benefit,
    value: string
  ) => {
    const updated = [...benefits];
    updated[index][field] = value;
    setBenefits(updated);
  };

  const addBenefit = () =>
    setBenefits((prev) => [...prev, { title: "", description: "" }]);

  const removeBenefit = (index: number) =>
    setBenefits((prev) => prev.filter((_, i) => i !== index));

  const handleThumbnailChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/"))
      return toast.error("Invalid image file");
    if (file.size > 5 * 1024 * 1024)
      return toast.error("Thumbnail size < 5MB only");
    setThumbnail(file);
    setThumbnailPreview(URL.createObjectURL(file));
  };

  const handleImagesChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const valid = files.filter((f) => f.type.startsWith("image/"));
    if (images.length + valid.length > 10)
      return toast.error("Max 10 gallery images allowed");
    setImages((prev) => [...prev, ...valid]);
    setImagePreviews((prev) => [
      ...prev,
      ...valid.map((f) => URL.createObjectURL(f)),
    ]);
  };

  const removeThumbnail = () => {
    setThumbnail(null);
    setThumbnailPreview(null);
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return toast.error("Fix all errors before submitting");
    setLoading(true);

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) =>
        data.append(key, String(value))
      );

      data.append("technicalDetails", JSON.stringify(technicalDetails));
      data.append("benefits", JSON.stringify(benefits));

      if (thumbnail) data.append("thumbnail", thumbnail);
      images.forEach((img) => data.append("images", img));

      await axios.post("/api/product", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Product uploaded successfully!");
      router.push("/admin/product");
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 pb-40 px-4">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl  mb-8 text-gray-800">
           Upload New Product
        </h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          <section className="border border-gray-300 p-6 rounded-xl space-y-4">
            <h2 className="flex items-center gap-2 text-xl font-semibold text-gray-900 mb-3">
              <Package className="w-6 h-6" /> Basic Information
            </h2>

            <div className="space-y-3">
              <label className="font-medium text-gray-700">Product Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-3"
                placeholder="Enter product name"
              />
            </div>

            <div className="space-y-3">
              <label className="font-medium text-gray-700">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter detailed description"
                className="w-full border border-gray-300 rounded-lg p-3 resize-none"
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="font-medium text-gray-700">Brand</label>
                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg p-3 w-full"
                  placeholder="Enter brand name"
                />
              </div>
              <div className="space-y-2">
                <label className="font-medium text-gray-700">Model</label>
                <input
                  type="text"
                  name="model"
                  value={formData.model}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg p-3 w-full"
                  placeholder="Enter model number"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="font-medium text-gray-700">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg p-3 w-full"
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.Name}
                  </option>
                ))}
              </select>
            </div>
          </section>

          <section className="border border-gray-300 p-6 rounded-xl space-y-4">
            <h2 className="flex items-center gap-2 text-xl font-semibold text-gray-900">
              <IndianRupee  className="w-5 h-5" /> Pricing & Stock
            </h2>
            <div className="grid grid-cols-3 gap-4">
              {[
                { name: "price", label: "Price" },
                { name: "discountPrice", label: "Discount Price" },
                { name: "stock", label: "Stock Quantity" },
              ].map((field) => (
                <div key={field.name} className="space-y-2">
                  <label className="font-medium text-gray-700">
                    {field.label}
                  </label>
                  <input
                    type="number"
                    name={field.name}
                    value={(formData as any)[field.name]}
                    onChange={handleChange}
                    className="border  border-gray-300 rounded-lg p-3 w-full no-spinner"
                    placeholder={`Enter ${field.label}`}
                  />
                </div>
              ))}
            </div>
          </section>

          <section className="border border-gray-300 p-6 rounded-xl space-y-4">
            <h2 className="flex items-center gap-2 text-xl font-semibold text-gray-900">
              <Wrench className="w-6 h-6" /> Technical Details
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(technicalDetails).map(([key, value]) => (
                <div key={key} className="space-y-2">
                  <label className="font-medium text-gray-700 capitalize">
                    {key.replace(/([A-Z])/g, " $1")}
                  </label>
                  <input
                    name={key}
                    value={value}
                    onChange={handleTechChange}
                    className="w-full border border-gray-300 rounded-lg p-3"
                    placeholder={`Enter ${key.replace(/([A-Z])/g, " $1")}`}
                  />
                </div>
              ))}
            </div>
          </section>

          <section className="border border-gray-300 p-6 rounded-xl space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">
                Product Benefits
              </h2>
              <button
                type="button"
                onClick={addBenefit}
                className="text-blue-600 flex items-center gap-1"
              >
                <Plus className="w-4 h-4" /> Add Benefit
              </button>
            </div>
            {benefits.map((b, i) => (
              <div key={i} className="flex gap-3">
                <div className="flex-1 space-y-2">
                  <label className="font-medium text-gray-700">Title</label>
                  <input
                    type="text"
                    value={b.title}
                    onChange={(e) =>
                      handleBenefitChange(i, "title", e.target.value)
                    }
                    className="w-full border border-gray-300 rounded-lg p-3"
                    placeholder="Benefit title"
                  />
                  <label className="font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    value={b.description}
                    onChange={(e) =>
                      handleBenefitChange(i, "description", e.target.value)
                    }
                    className="w-full border border-gray-300 rounded-lg p-3 resize-none"
                    rows={2}
                    placeholder="Benefit description"
                  />
                </div>
                {benefits.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeBenefit(i)}
                    className="text-red-600 hover:text-red-800 mt-8"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
          </section>

          <section className="border border-gray-300 p-6 rounded-xl grid grid-cols-2 gap-6">
            <div>
              <h2 className="font-semibold mb-2 text-gray-800">Thumbnail</h2>
              {!thumbnailPreview ? (
                <label className="border-dashed border-2 border-gray-300 rounded-lg p-6 flex flex-col items-center cursor-pointer hover:bg-blue-50 transition">
                  <FileImage className="w-10 h-10 text-gray-400" />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleThumbnailChange}
                  />
                  <span className="text-sm text-gray-600 mt-2">
                    Upload Thumbnail
                  </span>
                </label>
              ) : (
                <div className="relative">
                  <img
                    src={thumbnailPreview}
                    alt="Thumbnail"
                    className="rounded-lg border w-full object-contain h-44"
                  />
                  <button
                    type="button"
                    onClick={removeThumbnail}
                    className="absolute top-2 right-2 bg-white text-red-600 rounded-full p-1 shadow"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            <div>
              <h2 className="font-semibold mb-2 text-gray-800">
                Gallery Images
              </h2>
              <label className="border-dashed border-2 border-gray-300 rounded-lg p-6 flex flex-col items-center cursor-pointer hover:bg-blue-50 transition">
                <Plus className="w-8 h-8 text-gray-400" />
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={handleImagesChange}
                />
                <span className="text-sm text-gray-600 mt-2">Add Images</span>
              </label>
              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mt-3">
                  {imagePreviews.map((src, i) => (
                    <div key={i} className="relative">
                      <img
                        src={src}
                        alt={`img-${i}`}
                        className="rounded-lg border h-24 object-contain w-full"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="absolute top-1 right-1 bg-white text-red-600 rounded-full p-1 shadow"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          <section className=" p-4 rounded-xl space-y-4">
            <h2 className="flex items-center gap-2 text-xl font-semibold text-gray-900">
              <Truck className="w-6 h-6" /> Delivery Charge 
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
               
                <input
                  type="number"
                  name="deliveryCharge"
                  value={formData.deliveryCharge}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg p-3 w-full no-spinner"
                  placeholder="Enter delivery charge"
                />
              </div>
             
            </div>
          </section>


          <section className=" p-4 rounded-xl space-y-4">
            <h2 className="flex items-center gap-2 text-xl font-semibold text-gray-900">
              Return Policy & Warranty
            </h2>
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <label className="font-medium text-gray-700">
                  Warranty Details (Optional)
                </label>
                <input
                  type="text"
                  name="warranty"
                  value={formData.warranty}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg p-3 w-full no-spinner"
                  placeholder="Enter warranty details"
                />
              </div>

         <div className="grid grid-cols-3 gap-4">
               <div className="flex gap-4 mt-3">
              <label className="flex items-center gap-2 text-gray-700">
                <input
                  type="checkbox"
                  name="returnPolicy"
                  checked={formData.returnPolicy}
                  onChange={handleChange}
                />
                Return Policy Available
              </label>
              
            </div>
            <div className="flex gap-4 mt-3">
              <label className="flex items-center gap-2 text-gray-700">
                <input
                  type="checkbox"
                  name="isNewArrival"
                  checked={formData.isNewArrival}
                  onChange={handleChange}
                />
               Mark as New Arrival
              </label>
              
            </div>
            <label className="flex items-center gap-2 text-gray-700">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                />
                Active Product
              </label>
         </div>
              
            </div>

            
          </section>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-lg font-semibold flex items-center justify-center gap-2 transition"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin w-5 h-5" /> Uploading...
              </>
            ) : (
              <>
                <Upload className="w-5 h-5" /> Upload Product
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProductUploadPage;
