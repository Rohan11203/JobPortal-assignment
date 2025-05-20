// components/LogoutModal.jsx
import { useNavigate } from "react-router-dom";
import { onLogout } from "../api";

const LogoutModal = ({ isOpen, onClose }: any) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await onLogout();

      localStorage.removeItem("isAuth");

      // Navigate to login
      navigate("/");
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm">
        <h2 className="text-xl font-semibold mb-4">Confirm Logout</h2>
        <p className="mb-6">Are you sure you want to logout?</p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;
