import { useState } from "react";
import axios from "axios";
import { X } from "lucide-react";
import { AddJob } from "../api";

export default function AddJobModal() {
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({
    title: "",
    company: "",
    location: "",
    type: "",
    salary: "",
    description: "",
    requirements: "",
    category: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await AddJob(form)
      setSuccess("Job created successfully");
      setForm({
        title: "",
        company: "",
        location: "",
        type: "",
        salary: "",
        description: "",
        requirements: "",
        category: "",
      });
    } catch (err: any) {
      setError(err.response?.data?.msg || "Failed to add job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShow(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        + Add Job
      </button>

      {show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 text-black">
          <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-xl p-6 relative">
            <button
              onClick={() => setShow(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
              Add New Job
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Title"
                  required
                  className="w-full px-4 py-2 border rounded "
                />
                <input
                  name="company"
                  value={form.company}
                  onChange={handleChange}
                  placeholder="Company"
                  required
                  className="w-full px-4 py-2 border rounded"
                />
                <input
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="Location"
                  required
                  className="w-full px-4 py-2 border rounded"
                />
                <input
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  placeholder="Type"
                  required
                  className="w-full px-4 py-2 border rounded"
                />
                <input
                  name="salary"
                  value={form.salary}
                  onChange={handleChange}
                  placeholder="Salary (optional)"
                  className="w-full px-4 py-2 border rounded"
                />
                <input
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  placeholder="Category (optional)"
                  className="w-full px-4 py-2 border rounded"
                />
              </div>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Description"
                required
                className="w-full px-4 py-2 border rounded h-24"
              />
              <input
                name="requirements"
                value={form.requirements}
                onChange={handleChange}
                placeholder="Requirements (comma-separated)"
                className="w-full px-4 py-2 border rounded"
              />

              {error && <p className="text-red-600">{error}</p>}
              {success && <p className="text-green-600">{success}</p>}

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShow(false)}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
                >
                  {loading ? "Saving..." : "Save Job"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
