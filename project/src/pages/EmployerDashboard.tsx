import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ReTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useStore } from "../store";
import { useFetchCurrentUser } from "../hooks/useFetchCurrentUser";
import AddJobModal from "../components/FormModel";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

interface DashboardData {
  activeJobsCount: number;
  totalApplications: number;
  pendingCount: number;
  acceptedCount: number;
  monthlyData: { month: string; jobs: number }[];
  categoryData: { name: string; value: number }[];
  recentApplications: {
    id: string;
    jobTitle: string;
    applicant: string;
    appliedDate: string;
    status: "pending" | "accepted" | "rejected";
  }[];
}

export default function EmployerDashboard() {
  // fetch and set current user on mount
  useFetchCurrentUser();

  const isDarkMode = useStore((s) => s.isDarkMode);
  const currentUser = useStore((s) => s.currentUser);

  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await axios.get<DashboardData>(
          "https://jobportal-assignment.onrender.com/api/v1/job/employer/dashboard"
        );
        setData(res.data);
      } catch (err: any) {
        setError(err.response?.data?.msg || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className={`${isDarkMode ? "text-white" : "text-gray-900"}`}>      
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Employer Dashboard</h1>
          <p className="text-gray-500">Welcome back, {currentUser?.name}</p>
        </div>
        {/* Add Job Button Modal */}
        {currentUser?.role === 'employer' && <AddJobModal />}
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Active Jobs"
          value={data!.activeJobsCount}
          color="text-blue-600"
          isDark={isDarkMode}
        />
        <StatCard
          title="Total Applications"
          value={data!.totalApplications}
          color="text-green-600"
          isDark={isDarkMode}
        />
        <StatCard
          title="Pending Review"
          value={data!.pendingCount}
          color="text-yellow-600"
          isDark={isDarkMode}
        />
        <StatCard
          title="Hired"
          value={data!.acceptedCount}
          color="text-purple-600"
          isDark={isDarkMode}
        />
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <Panel title="Monthly Job Postings" isDark={isDarkMode}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data!.monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <ReTooltip />
              <Bar dataKey="jobs" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="Jobs by Category" isDark={isDarkMode}>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data!.categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} ${(percent! * 100).toFixed(0)}%`
                }
                outerRadius={80}
                dataKey="value"
              >
                {data!.categoryData.map((_, idx) => (
                  <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <ReTooltip />
            </PieChart>
          </ResponsiveContainer>
        </Panel>
      </div>

      {/* Recent Applications */}
      <div
        className={`${isDarkMode ? "bg-gray-800" : "bg-white"} rounded-lg shadow-md"`}
      >
        <h2 className="text-xl font-bold p-6 border-b border-gray-200">
          Recent Applications
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={`${isDarkMode ? "bg-gray-700" : "bg-gray-50"}`}>
              <tr>
                <th className="px-6 py-3 text-left">Job Title</th>
                <th className="px-6 py-3 text-left">Applicant</th>
                <th className="px-6 py-3 text-left">Date</th>
                <th className="px-6 py-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {data!.recentApplications.map((app) => (
                <tr
                  key={app.id}
                  className={`${isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"}`}
                >
                  <td className="px-6 py-4">{app.jobTitle}</td>
                  <td className="px-6 py-4">{app.applicant}</td>
                  <td className="px-6 py-4">{app.appliedDate}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        app.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : app.status === "accepted"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ——— Helper Components ——————————————————————————

function StatCard({
  title,
  value,
  color,
  isDark,
}: {
  title: string;
  value: number;
  color: string;
  isDark: boolean;
}) {
  return (
    <div
      className={`${isDark ? "bg-gray-800" : "bg-white"} p-6 rounded-lg shadow-md`}
    >
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className={`text-3xl font-bold ${color}`}>{value}</p>
    </div>
  );
}

function Panel({
  title,
  isDark,
  children,
}: {
  title: string;
  isDark: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`${isDark ? "bg-gray-800" : "bg-white"} p-6 rounded-lg shadow-md`}
    >
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      {children}
    </div>
  );
}
