import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { MapPin, Building2, Clock, Send } from "lucide-react";
import axios from "axios";
import { useStore } from "../store";
import { jobById } from "../api";
import { useFetchCurrentUser } from "../hooks/useFetchCurrentUser";

function JobDetails() {
  useFetchCurrentUser();

  const { id } = useParams();
  const isDarkMode = useStore((state) => state.isDarkMode);
  const currentUser = useStore((state) => state.currentUser);
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [applyStatus, setApplyStatus] = useState<string>("");

  async function fetchJobById() {
    try {
      const res = await jobById(id!);
      setJob(res.data);
    } catch (err) {
      console.error("Failed to fetch job:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchJobById();
  }, [id]);

  const handleApply = async () => {
    try {
      await axios.post(`https://jobportal-assignment.onrender.com/api/v1/job/${id}/apply`);
      setApplyStatus("Application submitted successfully");
    } catch (err: any) {
      console.error("Apply error:", err);
      setApplyStatus(err.response?.data?.msg || "Failed to apply");
    }
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (!job) {
    return <div className="p-6 text-red-600">Job not found</div>;
  }

  return (
    <div className={`${isDarkMode ? "text-white" : "text-gray-900"} bg-transparent`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Job Header */}
        <div
          className={`${
            isDarkMode ? "bg-gray-800" : "bg-white"
          } rounded-lg shadow-md p-6 md:p-8 mb-8 flex flex-col md:flex-row justify-between`}
        >
          <div className="flex-1 mb-6 md:mb-0">
            <h1 className="text-2xl sm:text-3xl font-bold mb-3">{job.title}</h1>
            <div className="flex flex-wrap items-center text-gray-500 text-sm sm:text-base mb-3 space-x-4">
              <div className="flex items-center">
                <Building2 className="w-4 h-4 mr-1" />
                {job.company}
              </div>
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                {job.location}
              </div>
            </div>
            <div className="flex flex-wrap gap-2 text-sm sm:text-base">
              <span className={`px-3 py-1 rounded-full ${isDarkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                {job.type}
              </span>
              <span className={`px-3 py-1 rounded-full ${isDarkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                {job.category}
              </span>
            </div>
          </div>

          <div className="text-right">
            <div className="text-xl sm:text-2xl font-bold text-blue-600 mb-2">
              {job.salary}
            </div>
            <div className="flex items-center justify-end text-gray-500 text-sm sm:text-base">
              <Clock className="w-4 h-4 mr-1" />
              <span>Posted {new Date(job.postedDate).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Apply Button */}
        {currentUser?.role === "jobseeker" && (
          <div className="max-w-md mx-auto mb-8">
            <button
              onClick={handleApply}
              className="w-full md:w-auto bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition flex items-center justify-center"
            >
              <Send className="w-5 h-5 mr-2" />
              Apply Now
            </button>
            {applyStatus && (
              <p className={`mt-3 text-sm ${
                  applyStatus.includes("success") ? "text-green-600" : "text-red-600"
                }`}>
                {applyStatus}
              </p>
            )}
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {/* Job Description */}
          <div className="md:col-span-2">
            <div className={`${isDarkMode ? "bg-gray-800" : "bg-white"} rounded-lg shadow-md p-6 md:p-8 mb-8`}>
              <h2 className="text-xl sm:text-2xl font-bold mb-4">Job Description</h2>
              <p className="mb-6 whitespace-pre-line text-sm sm:text-base">{job.description}</p>

              <h3 className="text-lg sm:text-xl font-bold mb-3">Requirements</h3>
              <ul className="list-disc pl-5 space-y-2 text-sm sm:text-base">
                {job.requirements.map((req: any, idx: number) => (
                  <li key={idx}>{req}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Company Overview */}
          <div>
            <div className={`${isDarkMode ? "bg-gray-800" : "bg-white"} rounded-lg shadow-md p-6 md:p-8`}>
              <h2 className="text-lg sm:text-xl font-bold mb-4">Company Overview</h2>
              <div className="flex items-center mb-4">
                <Building2 className="w-10 h-10 text-blue-600 mr-3" />
                <div>
                  <h3 className="font-semibold text-base sm:text-lg">{job.company}</h3>
                  <p className="text-gray-500 text-sm sm:text-base">{job.location}</p>
                </div>
              </div>
              <p className="text-gray-500 text-sm sm:text-base">
                Leading technology company specializing in innovative solutions...
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JobDetails;
