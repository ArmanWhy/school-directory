"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

export default function ShowSchools() {
  const router = useRouter();
  const [schools, setSchools] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const schoolsPerPage = 4; // Show 4 schools per page

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const res = await axios.get("/api/getSchools");
        setSchools(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchSchools();
  }, []);

  // Pagination calculations
  const indexOfLastSchool = currentPage * schoolsPerPage;
  const indexOfFirstSchool = indexOfLastSchool - schoolsPerPage;
  const currentSchools = schools.slice(indexOfFirstSchool, indexOfLastSchool);
  const totalPages = Math.ceil(schools.length / schoolsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
    <head>
      <title>Schools Directory | My App</title>
    </head>
    <div className="p-10 bg-pink-200 min-h-screen">
      <div className="flex justify-center mb-12">
        <button
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-900"
          onClick={() => router.push("/addSchool")}
        >
          Add Another School
        </button>
      </div>

      <h1 className="text-3xl font-bold mb-8 text-center text-gray-700">Schools Directory</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {currentSchools.map((school) => (
          <div
            key={school.id}
            className="bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition transform hover:-translate-y-5"
            >
            <div className="h-48 overflow-hidden rounded-t-lg">
              <img
                src={school.image || "/placeholder.png"}
                alt={school.name}
                className="w-full h-full object-cover"
                onError={(e) => (e.currentTarget.src = "/placeholder.png")}
              />
            </div>
            <div className="p-4">
              <h2 className="font-bold text-xl mb-1 text-white">{school.name}</h2>
              <p className="text-gray-600 mb-1">{school.address}</p>
              <p className="text-gray-500">{school.city}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination buttons */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 space-x-2">
          {[...Array(totalPages)].map((_, idx) => (
            <button
            key={idx + 1}
            className={`px-3 py-1 rounded border ${currentPage === idx + 1 ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}
              onClick={() => paginate(idx + 1)}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      )}

      {schools.length === 0 && (
        <p className="text-center text-gray-500 mt-10">No schools added yet.</p>
      )}
    </div>
  </>
  );
}
