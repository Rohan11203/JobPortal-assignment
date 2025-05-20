import React from "react";
import { Link } from "react-router-dom";
import { Briefcase, Search, Building2 } from "lucide-react";
import { useStore } from "../store";
import { useFetchCurrentUser } from "../hooks/useFetchCurrentUser";

function Home() {
  useFetchCurrentUser();
  const isDarkMode = useStore((state) => state.isDarkMode);
  const isAuth = localStorage.getItem("isAuth");

  const currentUser = useStore((s) => s.currentUser);

  return (
    <div
      className={`min-h-screen w-full px-4 py-16 sm:px-6 md:px-12 lg:px-24 ${
        isDarkMode
          ? "bg-gray-900 text-white"
          : "bg-gradient-to-br from-gray-50 to-gray-100 text-gray-900"
      }`}
    >
      <div className="max-w-7xl mx-auto">
        {/* Hero Section with improved styling */}
        <div className="text-center mb-20">
          <h1
            className={`text-4xl sm:text-5xl md:text-6xl font-bold mb-6 ${
              isDarkMode
                ? "bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500"
                : "bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-700"
            }`}
          >
            Find Your Dream Job Today
          </h1>
          <p
            className={`text-xl md:text-2xl mb-10 ${
              isDarkMode ? "text-gray-300" : "text-gray-700"
            } max-w-2xl mx-auto`}
          >
            Connect with top employers and opportunities tailored to your career
            goals
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/jobs"
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 transition shadow-lg hover:shadow-xl transform hover:-translate-y-1 duration-300"
            >
              Browse Jobs
            </Link>
            {isAuth === "true" ? (
              <Link
                to={`/${currentUser?.role}/dashboard`}
                className={`${
                  isDarkMode
                    ? "bg-gray-700 hover:bg-gray-800"
                    : "bg-white hover:bg-gray-100"
                } px-8 py-4 rounded-xl font-medium transition shadow-lg hover:shadow-xl transform hover:-translate-y-1 duration-300 border ${
                  isDarkMode ? "border-gray-600" : "border-gray-200"
                }`}
              >
                Dashboard
              </Link>
            ) : (
              <Link
                to={`/register`}
                className={`${
                  isDarkMode
                    ? "bg-gray-700 hover:bg-gray-800"
                    : "bg-white hover:bg-gray-100"
                } px-8 py-4 rounded-xl font-medium transition shadow-lg hover:shadow-xl transform hover:-translate-y-1 duration-300 border ${
                  isDarkMode ? "border-gray-600" : "border-gray-200"
                }`}
              >
                Register Now
              </Link>
            )}
          </div>
        </div>

        {/* Features Section with improved card design */}
        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div
            className={`p-8 rounded-2xl ${
              isDarkMode
                ? "bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700"
                : "bg-white border border-gray-100"
            } shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2`}
          >
            <div className="flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-blue-100 text-blue-600">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-semibold mb-4">Search Jobs</h3>
            <p
              className={`${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              } leading-relaxed`}
            >
              Browse through thousands of job listings from top companies across
              various industries.
            </p>
          </div>

          <div
            className={`p-8 rounded-2xl ${
              isDarkMode
                ? "bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700"
                : "bg-white border border-gray-100"
            } shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2`}
          >
            <div className="flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-blue-100 text-blue-600">
              <Briefcase className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-semibold mb-4">Easy Apply</h3>
            <p
              className={`${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              } leading-relaxed`}
            >
              Apply to multiple jobs with just a few clicks using your
              professionally crafted profile.
            </p>
          </div>

          <div
            className={`p-8 rounded-2xl ${
              isDarkMode
                ? "bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700"
                : "bg-white border border-gray-100"
            } shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2`}
          >
            <div className="flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-blue-100 text-blue-600">
              <Building2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-semibold mb-4">Company Profiles</h3>
            <p
              className={`${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              } leading-relaxed`}
            >
              Learn about company culture, benefits, and work environment before
              applying to positions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
