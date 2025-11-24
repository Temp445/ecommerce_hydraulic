"use client";

import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import { Loader2, Upload, X, Plus, FileImage } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter, useParams } from "next/navigation";

interface Category {
  _id: string;
  Name: string;
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
  isNewArrival: boolean;
  isActive: boolean;
  warranty?: string;
  returnPolicy?: boolean;
}

interface TechnicalDetails {
  title: string;
  value: string;
}

interface Benefit {
  title: string;
  description: string;
}

interface ErrorState {
  [key: string]: string | undefined;
}

const ProductEditPage: React.FC = () => {
  const router = useRouter();
  const { pathUrl } = useParams() as { pathUrl: string };

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
    isNewArrival: false,
    isActive: true,
    returnPolicy: false,
    warranty: "",
  });

  const [technicalDetails, setTechnicalDetails] = useState<TechnicalDetails[]>([
    { title: "", value: "" },
  ]);

  const [benefits, setBenefits] = useState<Benefit[]>([
    { title: "", description: "" },
  ]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [existingThumbnail, setExistingThumbnail] = useState<string | null>(
    null
  );
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<ErrorState>({});

  useEffect(() => {
    fetchCategories();
    fetchProduct();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get("/api/category");
      setCategories(data.data || []);
    } catch {
      toast.error("Failed to load categories");
    }
  };

  const fetchProduct = async () => {
    try {
      const { data } = await axios.get(`/api/product/${pathUrl}`);
      const product = data.data;

      setFormData({
        name: product.name || "",
        description: product.description || "",
        model: product.model || "",
        brand: product.brand || "",
        category: product.category?._id || "",
        price: product.price?.toString() || "",
        discountPrice: product.discountPrice?.toString() || "",
        stock: product.stock?.toString() || "",
        deliveryCharge: product.deliveryCharge?.toString() || "",
        isNewArrival: product.isNewArrival || false,
        isActive: product.isActive || false,
        warranty: product.warranty || "",
        returnPolicy: product.returnPolicy || false,
      });

      if (product.technicalDetails?.length > 0)
        setTechnicalDetails(product.technicalDetails);
      if (product.benefits?.length > 0) setBenefits(product.benefits);
      if (product.thumbnail) setExistingThumbnail(product.thumbnail);
      if (product.images?.length > 0) setExistingImages(product.images);
    } catch (error) {
      toast.error("Failed to fetch product data");
    }
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

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleTechChange = (
    index: number,
    field: keyof TechnicalDetails,
    value: string
  ) => {
    const updated = [...technicalDetails];
    updated[index][field] = value;
    setTechnicalDetails(updated);
  };

  const addTechnicalDetails = () =>
    setTechnicalDetails((prev) => [...prev, { title: "", value: "" }]);
  const removeTechnicalDetails = (index: number) =>
    setTechnicalDetails((prev) => prev.filter((_, i) => i !== index));

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
    if (file) {
      setThumbnail(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const handleImagesChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newFiles = [...images, ...files];
    setImages(newFiles);
    setImagePreviews(newFiles.map((f) => URL.createObjectURL(f)));
  };

  const removeThumbnail = () => {
    setThumbnail(null);
    setThumbnailPreview(null);
    setExistingThumbnail(null);
  };

  const removeImage = (index: number, isExisting: boolean = false) => {
    if (isExisting) {
      setExistingImages((prev) => prev.filter((_, i) => i !== index));
    } else {
      setImages((prev) => prev.filter((_, i) => i !== index));
      setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      const data = new FormData();

      Object.entries(formData).forEach(([key, value]) =>
        data.append(key, String(value))
      );

      data.append("technicalDetails", JSON.stringify(technicalDetails));
      data.append("benefits", JSON.stringify(benefits));

      data.append("isActive", String(formData.isActive));
      data.append("isNewArrival", String(formData.isNewArrival));
      data.append("returnPolicy", String(formData.returnPolicy));

      if (thumbnail) data.append("thumbnail", thumbnail);
      if (existingThumbnail)
        data.append("existingThumbnail", existingThumbnail);
      if (existingImages.length)
        data.append("existingImages", JSON.stringify(existingImages));
      images.forEach((img) => data.append("images", img));

      await axios.put(`/api/product/${pathUrl}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Product updated successfully!");
      router.push("/admin/product");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-8 bg-gray-50 pb-32 px-4">
      <div className="max-w-5xl mx-auto">
        <div className=" overflow-hidden">
          <h1 className="text-3xl px-5  text-gray-900">Update Product</h1>

          <div className="md:p-4">
            <div>
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <h2 className="text-lg font-bold text-gray-800">
                      Basic Information
                    </h2>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Product Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter product name"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          Brand
                        </label>
                        <input
                          type="text"
                          name="brand"
                          value={formData.brand}
                          onChange={handleChange}
                          placeholder="Brand name"
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          Model
                        </label>
                        <input
                          type="text"
                          name="model"
                          value={formData.model}
                          onChange={handleChange}
                          placeholder="Model number"
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Category <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className={`w-full px-4 py-2.5 border ${
                          errors.category
                            ? "border-red-300 bg-red-50"
                            : "border-gray-300"
                        } rounded-lg  transition`}
                      >
                        <option value="">Select Category</option>
                        {categories.map((cat) => (
                          <option key={cat._id} value={cat._id}>
                            {cat.Name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Description <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={4}
                        placeholder="Detailed product description"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg resize-none"
                      />
                    </div>
                  </div>
                </div>

                <section className="border border-gray-300 bg-white p-6 rounded-xl space-y-4">
                  <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                    Pricing & Stock
                  </h2>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      { name: "price", label: "Price" },
                      { name: "discountPrice", label: "Discount Price" },
                      { name: "stock", label: "Stock Quantity" },
                      { name: "deliveryCharge", label: "Delivery Charge" },
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
                          className="border  border-gray-300 rounded-lg p-3 w-full text-sm no-spinner"
                          placeholder={`Enter ${field.label}`}
                        />
                      </div>
                    ))}
                  </div>
                </section>

                <section className="bg-white border border-gray-200 rounded-xl p-6 space-y-5">
                  <h2 className="text-lg font-bold text-gray-800">
                    Technical Details
                  </h2>

                  <div className="w-full">
                    {technicalDetails.map((technicalDetail, i) => (
                      <div key={i} className="flex space-x-2 space-y-3">
                        <div className="w-full">
                          <label className="font-medium text-sm text-gray-700 mt-32 pt-32 py-3">
                            Title
                          </label>
                          <input
                            type="text"
                            placeholder="eg: Rod Diameter"
                            value={technicalDetail.title}
                            onChange={(e) =>
                              handleTechChange(i, "title", e.target.value)
                            }
                            className="w-full p-3 border border-gray-300 rounded-lg text-sm "
                          />
                        </div>
                        <div className="w-full">
                          <label className="font-medium text-sm text-gray-700">
                            Value
                          </label>
                          <input
                            placeholder="200 mm"
                            value={technicalDetail.value}
                            onChange={(e) =>
                              handleTechChange(i, "value", e.target.value)
                            }
                            className="w-full p-3 border border-gray-300 rounded-lg text-sm"
                          />
                        </div>
                        {removeTechnicalDetails && (
                          <button
                            type="button"
                            onClick={() => removeTechnicalDetails(i)}
                            className="text-red-500 hover:text-red-700 rounded-lg   mt-2 transition-colors"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={addTechnicalDetails}
                    className="text-blue-600 font-medium flex items-center gap-1 hover:text-blue-700 border p-2 rounded transition-colors text-sm"
                  >
                    <Plus className="w-4 h-4" /> Add Value
                  </button>
                </section>

                <section className="bg-white border border-gray-200 rounded-xl p-4 md:p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold text-gray-800">
                      Product Benefits
                    </h2>
                  </div>
                  <div className="space-y-3">
                    {benefits.map((benefit, index) => (
                      <div
                        key={index}
                        className="flex gap-3 p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex-1 space-y-2">
                          <label className="font-medium text-sm text-gray-700">
                            Title
                          </label>
                          <input
                            type="text"
                            placeholder="Benefit title"
                            value={benefit.title}
                            onChange={(e) =>
                              handleBenefitChange(
                                index,
                                "title",
                                e.target.value
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm "
                          />
                          <label className="font-medium text-sm text-gray-700">
                            Description
                          </label>
                          <textarea
                            placeholder="Benefit description"
                            value={benefit.description}
                            onChange={(e) =>
                              handleBenefitChange(
                                index,
                                "description",
                                e.target.value
                              )
                            }
                            rows={2}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm  resize-none"
                          />
                        </div>
                        {benefits.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeBenefit(index)}
                            className="text-red-500 hover:text-red-700  rounded-lg px-2 transition-colors"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={addBenefit}
                    className="text-blue-600 font-medium flex items-center border rounded p-2 gap-1 hover:text-blue-700 transition-colors text-sm"
                  >
                    <Plus className="w-4 h-4" /> Add Benefit
                  </button>
                </section>
              </div>

              <section className="grid lg:grid-cols-2 gap-6 my-8">
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h2 className="text-lg font-bold text-gray-800 mb-4">
                    Thumbnail
                  </h2>

                  {existingThumbnail && !thumbnailPreview && (
                    <div className="relative rounded-lg overflow-hidden border border-gray-200">
                      <img
                        src={existingThumbnail}
                        alt="Existing Thumbnail"
                        className="w-full h-48 object-contain"
                      />
                      <button
                        type="button"
                        onClick={removeThumbnail}
                        className="absolute top-2 right-2 bg-white text-red-600 rounded-full p-1.5 hover:bg-red-50 shadow-lg transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {thumbnailPreview && (
                    <div className="relative rounded-lg overflow-hidden border border-gray-200">
                      <img
                        src={thumbnailPreview}
                        alt="Thumbnail"
                        className="w-full h-48 object-contain"
                      />
                      <button
                        type="button"
                        onClick={removeThumbnail}
                        className="absolute top-2 right-2 bg-white text-red-600 rounded-full p-1.5 hover:bg-red-50 shadow-lg transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {!existingThumbnail && !thumbnailPreview && (
                    <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-8 cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleThumbnailChange}
                      />
                      <FileImage className="w-12 h-12 text-gray-400 mb-2" />
                      <span className="text-sm font-medium text-gray-600">
                        Upload Thumbnail
                      </span>
                    </label>
                  )}
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h2 className="text-lg font-bold text-gray-800 mb-4">
                    Gallery Images
                  </h2>

                  <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-10 cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImagesChange}
                      className="hidden"
                    />
                    <Plus className="w-8 h-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-600">Add Images</span>
                  </label>

                  {existingImages.length > 0 && (
                    <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {existingImages.map((src, index) => (
                        <div
                          key={`existing-${index}`}
                          className="relative group border border-gray-200 rounded-lg overflow-hidden shadow-sm"
                        >
                          <img
                            src={src}
                            alt={`Existing ${index + 1}`}
                            className="w-full h-28 object-contain"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index, true)}
                            className="absolute top-1 right-1 bg-white/90 text-red-600 rounded-full p-1.5 shadow hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {imagePreviews.length > 0 && (
                    <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {imagePreviews.map((src, index) => (
                        <div
                          key={`new-${index}`}
                          className="relative group border border-gray-200 rounded-lg overflow-hidden shadow-sm"
                        >
                          <img
                            src={src}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-28 object-contain"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-1 right-1 bg-white/90 text-red-600 rounded-full p-1.5 shadow hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </section>
            </div>

            <div className="bg-white p-6">
              <div className="flex items-center gap-2 mb-4">
                <h2 className="text-lg font-bold text-gray-800">
                  Warranty Information
                </h2>
              </div>
              <input
                type="text"
                name="warranty"
                value={formData.warranty}
                onChange={handleChange}
                placeholder="1 Year Warranty"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg no-spinner transition"
              />
            </div>
            <div className=" p-4">
              <div className="space-x-3 flex">
                <label className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-300 rounded cursor-pointer hover:bg-gray-100 transition">
                  <input
                    type="checkbox"
                    name="isNewArrival"
                    checked={formData.isNewArrival}
                    onChange={handleChange}
                    className="w-4 h-4 text-blue-600 rounded "
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Mark as New Arrival
                  </span>
                </label>
                <label className="flex items-center gap-3 p-3 bg-gray-50 rounded border border-gray-300 cursor-pointer hover:bg-gray-100 transition">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Active Product
                  </span>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => router.back()}
                disabled={loading}
                className="w-full bg-gray-950 text-white py-3.5 rounded-lg flex items-center justify-center font-semibold transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed mt-6"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-emerald-600 text-white py-3.5 rounded-lg flex items-center justify-center font-semibold transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed mt-6"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin mr-2 w-5 h-5" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 w-5 h-5" />
                    Update Product
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductEditPage;
