import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useStore } from '../store';

interface HistoryItem { id: string; jobTitle: string; company: string; appliedDate: string; status: string; }
interface ActivityItem { week: string; applications: number; }

export default function JobSeekerDashboard() {
  const isDarkMode = useStore(state => state.isDarkMode);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, accepted: 0, rejected: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const res = await axios.get('http://localhost:3000/api/v1/job/jobseeker/dashboard', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats({
          total: res.data.totalApplications,
          pending: res.data.pendingCount,
          accepted: res.data.acceptedCount,
          rejected: res.data.rejectedCount
        });
        setActivity(res.data.activity);
        setHistory(res.data.history);
      } catch (err: any) {
        console.error(err);
        setError(err.response?.data?.msg || 'Failed to load');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className={`${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Job Seeker Dashboard</h1>
      </div>

      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Stat title="Total Applications" value={stats.total} color="text-blue-600" isDark={isDarkMode} />
        <Stat title="Under Review" value={stats.pending} color="text-yellow-600" isDark={isDarkMode} />
        <Stat title="Accepted" value={stats.accepted} color="text-green-600" isDark={isDarkMode} />
        <Stat title="Rejected" value={stats.rejected} color="text-red-600" isDark={isDarkMode} />
      </div>

      <Panel title="Application Activity" isDark={isDarkMode}>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={activity}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="week" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="applications" stroke="#3B82F6" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </Panel>

      <Panel title="Application History" isDark={isDarkMode}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <tr>
                <th className="px-6 py-3 text-left">Job Title</th>
                <th className="px-6 py-3 text-left">Company</th>
                <th className="px-6 py-3 text-left">Date</th>
                <th className="px-6 py-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {history.map(item => (
                <tr key={item.id} className={`${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}>
                  <td className="px-6 py-4">{item.jobTitle}</td>
                  <td className="px-6 py-4">{item.company}</td>
                  <td className="px-6 py-4">{item.appliedDate}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      item.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      item.status === 'accepted' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>{item.status.charAt(0).toUpperCase() + item.status.slice(1)}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}

function Stat({ title, value, color, isDark }:any) {
  return (
    <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-md`}>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className={`text-3xl font-bold ${color}`}>{value}</p>
    </div>
  );
}

function Panel({ title, isDark, children }:any) {
  return (
    <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6 mb-8`}>
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      {children}
    </div>
  );
}
