import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Building2, Clock } from 'lucide-react';
import { useStore } from '../store';
import { getJobs } from '../api';

function Jobs() {
  const isDarkMode = useStore((state) => state.isDarkMode);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [fullJobs, setFullJobs] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch all jobs once on mount
  useEffect(() => {
    const fetchAllJobs = async () => {
      setLoading(true);
      setError('');
      try {
        const { data } = await getJobs({});
        setFullJobs(data);
        setJobs(data);

        // Extract unique categories from full list
        const categoryArray = data.map((job: any) => job.category);
        const catSet: Set<string> = new Set(categoryArray.filter((cat:any): cat is string => typeof cat === 'string'));
        setCategories(Array.from(catSet));
      } catch (err) {
        console.error(err);
        setError('Failed to load jobs.');
      } finally {
        setLoading(false);
      }
    };

    fetchAllJobs();
  }, []);

  // Filter jobs whenever searchTerm or selectedCategory changes
  useEffect(() => {
    let filtered = fullJobs;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (job: any) =>
          job.title.toLowerCase().includes(term) ||
          job.company.toLowerCase().includes(term) ||
          job.location.toLowerCase().includes(term)
      );
    }
    if (selectedCategory) {
      filtered = filtered.filter((job: any) => job.category === selectedCategory);
    }
    setJobs(filtered);
  }, [searchTerm, selectedCategory, fullJobs]);

  return (
    <div className={`${isDarkMode ? 'text-white' : 'text-gray-900'} overflow-x-hidden`}>      
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Find Your Next Opportunity</h1>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className={`flex items-center ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-2 shadow-md`}>
              <Search className="w-5 h-5 text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Search jobs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full bg-transparent focus:outline-none ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
              />
            </div>
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className={`p-2 rounded-lg ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} shadow-md`}
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        {loading && <div>Loading jobs...</div>}
        {error && <div className="text-red-500">{error}</div>}
      </div>

      <div className="grid gap-6">
        {jobs.map((job: any) => (
          <Link
            key={job._id}
            to={`/jobs/${job._id}`}
            className={`${isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'} sm:p-6 p-2 rounded-lg shadow-md transition`}
          >
            <div className="flex justify-between items-start ">
              <div>
                <h2 className="text-xl font-semibold mb-2">{job.title}</h2>
                <div className="flex items-center text-gray-500 mb-2">
                  <Building2 className="w-4 h-4 mr-1" />
                  <span className="mr-4">{job.company}</span>
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{job.location}</span>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className={`px-3 py-1 rounded-full text-sm ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    {job.type}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    {job.category}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold text-blue-600">{job.salary}</div>
                <div className="flex items-center text-gray-500 mt-2">
                  <Clock className="w-4 h-4 mr-1" />
                  <span className="text-sm">Posted {new Date(job.postedDate).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Jobs;