"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { User, Loader2, Edit3, XCircle, Mail, Phone, Check } from "lucide-react";
import { useAuth } from "@/context/AuthProvider";
import toast from "react-hot-toast";

const ProfilePage = () => {
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  const [originalUser, setOriginalUser] = useState(profile);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const {user, setUser } = useAuth();
  const id = user?._id


  useEffect(() => {
    if (!id) return;

    const fetchUser = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/api/auth/users/${id}`);
        if (res.data?.success && res.data?.data) {
          setProfile(res.data.data);
          setOriginalUser(res.data.data);
        } else {
          setError("User data not found.");
        }
      } catch (err) {
        setError("Failed to load user profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

const handleSave = async () => {
  try {
    setSaving(true);
    const res = await axios.put(`/api/auth/users/${id}`, profile);
    if (res.data?.success && res.data?.data) {
      const updatedUser = res.data.data;

      setProfile(updatedUser);
      setOriginalUser(updatedUser);
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      window.dispatchEvent(new Event("userUpdate"));
      toast.success("Profile updated successfully!");
      setIsEditing(false);
    }
  } catch (error) {
    toast.error("Update failed");
  } finally {
    setSaving(false);
  }
};


  const handleCancel = () => {
    setProfile(originalUser);
    setIsEditing(false);
  };

  const getInitials = () => {
    return `${profile.firstName.charAt(0)}${profile.lastName.charAt(0)}`.toUpperCase();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 py-12 px-4 animate-pulse">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-lg bg-slate-200" />
              <div>
                <div className="h-5 bg-slate-200 rounded w-32 mb-2" />
                <div className="h-3 bg-slate-100 rounded w-48" />
              </div>
            </div>
            <div className="h-10 w-32 bg-slate-200 rounded-lg" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col items-center">
                <div className="w-28 h-28 rounded-full bg-slate-200 mb-4" />
                <div className="h-4 bg-slate-200 rounded w-24 mb-2" />
                <div className="h-3 bg-slate-100 rounded w-32" />
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
                <div className="h-4 bg-slate-200 rounded w-28" />
                <div className="space-y-3 mt-4">
                  {[1, 2].map((_, i) => (
                    <div key={i} className="flex gap-3 items-center">
                      <div className="w-8 h-8 rounded-lg bg-slate-200" />
                      <div className="flex-1 space-y-2">
                        <div className="h-3 bg-slate-100 w-24 rounded" />
                        <div className="h-4 bg-slate-200 w-40 rounded" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-3 bg-white rounded-xl shadow-sm border border-slate-200 p-8 space-y-6">
              <div className="h-6 bg-slate-200 w-48 rounded mb-4" />
              <div className="space-y-6">
                {[1, 2, 3, 4].map((_, i) => (
                  <div key={i} className="h-12 bg-slate-100 rounded-lg" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="bg-white p-8 rounded-xl shadow-lg border-l-4 border-red-500">
          <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 font-semibold text-center">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center shadow-lg">
                <User className="text-white" size={28} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">My Profile</h1>
                <p className="text-slate-500 text-sm">Manage your personal information</p>
              </div>
            </div>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-sm"
              >
                <Edit3 size={16} /> Edit Profile
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex flex-col items-center">
                <div className="relative mb-4">
                  <div className="w-28 h-28 rounded-full bg-gradient-to-br from-teal-400 via-cyan-500 to-blue-500 flex items-center justify-center shadow-xl">
                    <span className="text-white text-3xl font-bold">{getInitials()}</span>
                  </div>
                </div>
                <h3 className="text-lg font-bold text-slate-900 text-center">
                  {profile.firstName} {profile.lastName}
                </h3>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h4 className="font-semibold text-slate-900 mb-4 text-sm uppercase tracking-wide">Quick Info</h4>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center flex-shrink-0">
                    <Mail size={16} className="text-teal-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-500 mb-1">Email</p>
                    <p className="text-sm text-slate-900 font-medium truncate">{profile.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-cyan-100 flex items-center justify-center flex-shrink-0">
                    <Phone size={16} className="text-cyan-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-500 mb-1">Phone</p>
                    <p className="text-sm text-slate-900 font-medium">{profile.phone || 'Not provided'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
              <div className="flex items-center justify-between mb-6 pb-6 border-b border-slate-200">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Personal Details</h2>
                  <p className="text-slate-500 text-sm mt-1">
                    {isEditing ? "Make changes to your account information" : "Your account information is displayed below"}
                  </p>
                </div>
                {isEditing && (
                  <div className="flex items-center gap-2 bg-gray-50 text-gray-700 px-4 py-2 rounded-lg border border-gray-200">
                    <Edit3 size={16} />
                    <span className="text-sm font-medium">Editing Mode</span>
                  </div>
                )}
              </div>

              <div className="space-y-8">
                <div>
                  <h3 className="text-sm font-semibold text-slate-700 mb-4 uppercase tracking-wide flex items-center gap-2">
                    <div className="w-1 h-4 bg-teal-600 rounded-full"></div>
                    Full Name
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-600 text-sm font-medium mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={profile.firstName}
                        onChange={handleChange}
                        readOnly={!isEditing}
                        className={`w-full border-2 rounded-lg px-4 py-3 text-slate-900 transition-all ${
                          !isEditing
                            ? "bg-slate-50 border-slate-200 cursor-not-allowed"
                            : "bg-white border-slate-300 focus:border-teal-500 focus:ring-4 focus:ring-teal-100 outline-none"
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 text-sm font-medium mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={profile.lastName}
                        onChange={handleChange}
                        readOnly={!isEditing}
                        className={`w-full border-2 rounded-lg px-4 py-3 text-slate-900 transition-all ${
                          !isEditing
                            ? "bg-slate-50 border-slate-200 cursor-not-allowed"
                            : "bg-white border-slate-300 focus:border-teal-500 focus:ring-4 focus:ring-teal-100 outline-none"
                        }`}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-slate-700 mb-4 uppercase tracking-wide flex items-center gap-2">
                    <div className="w-1 h-4 bg-cyan-600 rounded-full"></div>
                    Contact Information
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-slate-600 text-sm font-medium mb-2">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                          type="email"
                          name="email"
                          value={profile.email}
                          onChange={handleChange}
                          readOnly={!isEditing}
                          className={`w-full border-2 rounded-lg pl-12 pr-4 py-3 text-slate-900 transition-all ${
                            !isEditing
                              ? "bg-slate-50 border-slate-200 cursor-not-allowed"
                              : "bg-white border-slate-300 focus:border-teal-500 focus:ring-4 focus:ring-teal-100 outline-none"
                          }`}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-slate-600 text-sm font-medium mb-2">
                        Phone Number
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                          type="number"
                          name="phone"
                          value={profile.phone}
                          onChange={handleChange}
                          readOnly={!isEditing}
                          className={`no-spinner w-full border-2 rounded-lg pl-12 pr-4 py-3 text-slate-900 transition-all ${
                            !isEditing
                              ? "bg-slate-50 border-slate-200 cursor-not-allowed"
                              : "bg-white border-slate-300 focus:border-teal-500 focus:ring-4 focus:ring-teal-100 outline-none"
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {isEditing && (
                <div className="flex items-center justify-end gap-3 mt-8 pt-8 border-t border-slate-200">
                  <button
                    onClick={handleCancel}
                    disabled={saving}
                    className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-6 py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                  >
                    <XCircle size={18} /> Discard Changes
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium shadow-lg shadow-teal-600/30"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" /> Saving...
                      </>
                    ) : (
                      <>
                        <Check size={18} /> Save Changes
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;