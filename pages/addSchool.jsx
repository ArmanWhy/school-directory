"use client";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

export default function AddSchool() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("address", data.address);
      formData.append("city", data.city);
      formData.append("state", data.state);
      formData.append("contact", data.contact);
      formData.append("email_id", data.email_id);
      formData.append("image", data.image[0]); // Upload first file

      await axios.post("/api/addSchool", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      reset();
      router.push("/showSchools"); // Redirect to school list
    } catch (err) {
      console.error(err);
      alert("Error adding school");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <head>
        <title>Add School | My App</title>
      </head>
      <div className="min-h-screen flex items-center justify-center bg-pink-200 p-4">
        <div className="bg-pink-300 rounded-lg shadow-md w-full max-w-lg p-6">
          <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Add School</h1>

          <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data" className="space-y-4">
            <input {...register("name", { required: true })} placeholder="School Name" className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
            {errors.name && <span className="text-red-600 text-sm">Name is required</span>}

            <input {...register("address", { required: true })} placeholder="Address" className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
            {errors.address && <span className="text-red-600 text-sm">Address is required</span>}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input {...register("city", { required: true })} placeholder="City" className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
              {errors.city && <span className="text-red-600 text-sm">City is required</span>}

              <input {...register("state", { required: true })} placeholder="State" className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
              {errors.state && <span className="text-red-600 text-sm">State is required</span>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input {...register("contact", { required: true, pattern: /^[0-9]+$/ })} placeholder="Contact Number" className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
              {errors.contact && <span className="text-red-600 text-sm">Valid contact is required</span>}

              <input {...register("email_id", { required: true, pattern: /^\S+@\S+$/i })} placeholder="Email" className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
              {errors.email_id && <span className="text-red-600 text-sm">Valid email is required</span>}
            </div>

            <input type="file" {...register("image", { required: true })} className="w-full p-2 border rounded" />
            {errors.image && <span className="text-red-600 text-sm">Image is required</span>}

            <button type="submit" disabled={loading} className={`w-full p-3 rounded bg-gray-600 text-white font-bold hover:bg-gray-900 transition ${loading ? "opacity-50 cursor-not-allowed" : ""}`}>
              {loading ? "Adding..." : "Add School"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
