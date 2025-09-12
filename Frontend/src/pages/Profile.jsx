import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useLocation } from "react-router-dom";
import { User, Mail, Phone, Calendar, UserCircle2 } from "lucide-react"; // icons
import api from "../services/api";

export default function Profile() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const location = useLocation();
  const isEditing = location.pathname.includes("/edit");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
  }, [navigate]);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    age: "",
    gender: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const { data: profileResponse, isLoading, isError, error: queryError } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const response = await api.get("/api/users/profile");
      return response.data;
    },
    onError: (error) => {
      setError(error.response?.data?.message || "Failed to load profile");
    },
  });

  const profile = profileResponse?.success ? profileResponse.data : profileResponse;

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || "",
        phone: profile.phone || "",
        age: profile.age ? profile.age.toString() : "",
        gender: profile.gender || "",
      });
    }
  }, [profile]);

  const mutation = useMutation({
    mutationFn: async (updatedData) => {
      const response = await api.put("/users/profile", updatedData);
      return response.data;
    },
    onSuccess: (responseData) => {
      queryClient.setQueryData(["profile"], responseData);
      setMessage(responseData?.message || "Profile updated successfully!");
      setError("");
      navigate("/profile");
    },
    onError: (err) => {
      setError(err.response?.data?.message || "Failed to update profile");
      setMessage("");
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "age" ? (value === "" ? "" : value) : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    const submitData = {
      ...formData,
      age: formData.age === "" ? undefined : parseInt(formData.age, 10),
    };
    mutation.mutate(submitData);
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        name: profile.name || "",
        phone: profile.phone || "",
        age: profile.age ? profile.age.toString() : "",
        gender: profile.gender || "",
      });
    }
    setMessage("");
    setError("");
    navigate("/profile");
  };

  const handleEdit = () => {
    navigate("/profile/edit");
  };

  if (isLoading)
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading your profile...</p>
        </div>
      </div>
    );

  if (isError)
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-red-600 font-bold text-xl mb-2">Error loading profile</p>
          <p className="text-gray-600">{queryError?.message}</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Main Card */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden">
          {/* Banner with stronger scrim for readability */}
          <div className="h-48 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 relative">
            <div className="absolute inset-0 bg-black/40"></div>
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/60 to-transparent"></div>
          </div>

          {/* Profile Header on a frosted card (fixes text readability) */}
          <div className="relative px-6 sm:px-8 lg:px-10 -mt-20 pb-6">
            <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4">
                {/* Avatar */}
                <div className="relative">
                  <div className="w-32 h-32 rounded-full border-4 border-white shadow-2xl bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-5xl font-bold text-white">
                    {profile?.name ? profile.name.charAt(0).toUpperCase() : <UserCircle2 size={64} />}
                  </div>
                  <div className="absolute bottom-0 right-0 w-10 h-10 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>

                {/* Name and Role (left aligned) */}
                <div className="flex-1 text-left">
                  <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 mb-1">
                    {profile?.name || "Anonymous User"}
                  </h1>
                  <div className="flex items-center gap-2 text-gray-600">
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">
                      {profile?.role || "Member"}
                    </span>
                    <span className="text-sm">
                      Joined{" "}
                      {profile?.createdAt
                        ? new Date(profile.createdAt).toLocaleDateString("en-US", {
                            month: "long",
                            year: "numeric",
                          })
                        : "Recently"}
                    </span>
                  </div>
                </div>

                {/* Edit Button */}
                {!isEditing && (
                  <button
                    onClick={handleEdit}
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit Profile
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Alerts */}
          {message && (
            <div className="mx-6 sm:mx-8 lg:mx-10 mb-6">
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200">
                <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-green-800 font-medium">{message}</p>
              </div>
            </div>
          )}
          {error && (
            <div className="mx-6 sm:mx-8 lg:mx-10 mb-6">
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-gradient-to-r from-red-50 to-pink-50 border border-red-200">
                <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-red-800 font-medium">{error}</p>
              </div>
            </div>
          )}

          {/* Profile Content */}
          <div className="px-6 sm:px-8 lg:px-10 pb-8">
            {!isEditing ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 hover:shadow-lg transition-shadow duration-300">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-xl shadow-md flex items-center justify-center">
                      <Mail className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-medium">Email Address</p>
                      <p className="text-gray-900 font-semibold">{profile?.email || "Not provided"}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 hover:shadow-lg transition-shadow duration-300">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-xl shadow-md flex items-center justify-center">
                      <Phone className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-medium">Phone Number</p>
                      <p className="text-gray-900 font-semibold">{profile?.phone || "Not provided"}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 hover:shadow-lg transition-shadow duration-300">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-xl shadow-md flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-medium">Age</p>
                      <p className="text-gray-900 font-semibold">{profile?.age ? `${profile.age} years old` : "Not provided"}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-6 hover:shadow-lg transition-shadow duration-300">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-xl shadow-md flex items-center justify-center">
                      <User className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-medium">Gender</p>
                      <p className="text-gray-900 font-semibold capitalize">{profile?.gender || "Not provided"}</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-gray-50 rounded-2xl p-6 sm:p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit Your Information
                  </h3>

                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Full Name *</label>
                      <input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-purple-500 focus:outline-none transition-colors duration-200"
                        placeholder="Enter your full name"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                      <input
                        value={profile?.email || ""}
                        readOnly
                        className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 bg-gray-100 text-gray-600 cursor-not-allowed"
                      />
                      <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
                      <input
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-purple-500 focus:outline-none transition-colors duration-200"
                        placeholder="Enter your phone number"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Age</label>
                        <input
                          type="number"
                          name="age"
                          value={formData.age}
                          onChange={handleChange}
                          className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-purple-500 focus:outline-none transition-colors duration-200"
                          placeholder="Enter your age"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Gender</label>
                        <select
                          name="gender"
                          value={formData.gender}
                          onChange={handleChange}
                          className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-purple-500 focus:outline-none transition-colors duration-200"
                        >
                          <option value="">Select gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 mt-8">
                    <button
                      type="submit"
                      disabled={mutation.isPending}
                      className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {mutation.isPending ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          Saving Changes...
                        </span>
                      ) : (
                        "Save Changes"
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={handleCancel}
                      disabled={mutation.isPending}
                      className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-300 transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}