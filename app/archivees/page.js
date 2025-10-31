"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster, toast } from "sonner";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  User,
  Settings,
  LogOut,
  Home,
  Users,
  Mail,
  Phone,
  Calendar,
  ChevronLeft,
  ChevronsLeft,
  ChevronRight,
  ChevronsRight,
  Plus,
  Search,
  X,
  Edit,
  Eye,
  Archive,
  RotateCcw,
  UserCheck,
  UserX,
  ArrowUpDown,
  ChevronDown,
  Leaf,
  Layers,
  Package,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Lock ,
  UserPlus,
  Tag,
  ShoppingCart,
} from "lucide-react";

export default function ArchivePage() {
  const router = useRouter();
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState("customers");
  const [archivedCustomers, setArchivedCustomers] = useState([]);
  const [archivedServiceGroups, setArchivedServiceGroups] = useState([]);
  const [archivedServices, setArchivedServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [isRestoring, setIsRestoring] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const [darkMode, setDarkMode] = useState(false);

  // Sorting state
  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "asc"
  });

  useEffect(() => {
    fetchArchivedData();
  }, [activeTab]);

  const fetchArchivedData = async () => {
  try {
    setIsLoading(true);
    
    if (activeTab === "customers") {
      const response = await fetch("https://api.lizlyskincare.sbs/archive.php?action=get");
      if (!response.ok) throw new Error("Failed to fetch archived customers");
      const data = await response.json();
      setArchivedCustomers(Array.isArray(data) ? data : []);
    } else if (activeTab === "service-groups") {
      // Fetch archived service groups
      const response = await fetch("https://api.lizlyskincare.sbs/archive.php?action=get_service_groups");
      if (!response.ok) throw new Error("Failed to fetch archived service groups");
      const data = await response.json();
      setArchivedServiceGroups(Array.isArray(data) ? data : []);
    } else if (activeTab === "services") {
      // Fetch archived services
      const response = await fetch("https://api.lizlyskincare.sbs/archive.php?action=get_services");
      if (!response.ok) throw new Error("Failed to fetch archived services");
      const data = await response.json();
      setArchivedServices(Array.isArray(data) ? data : []);
    }
  } catch (error) {
    toast.error(`Failed to load archived ${activeTab}`);
    console.error(error);
  } finally {
    setIsLoading(false);
  }
};

  const handleRestoreCustomer = async (archiveId, customerName) => {
    toast.custom((t) => (
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 max-w-sm w-full">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
            <RotateCcw className="text-amber-600" size={20} />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-gray-900 mb-1">
              Restore Customer
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              Are you sure you want to restore <strong>{customerName}</strong> to active customers?
            </p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => toast.dismiss(t)}
                className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  toast.dismiss(t);
                  await performRestore(archiveId, customerName, "customer");
                }}
                className="px-3 py-1.5 text-sm bg-green-600 text-white hover:bg-green-700 rounded-md transition-colors"
              >
                Restore
              </button>
            </div>
          </div>
        </div>
      </div>
    ), {
      duration: Infinity,
    });
  };

  const handleRestoreServiceGroup = async (groupId, groupName) => {
    toast.custom((t) => (
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 max-w-sm w-full">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
            <RotateCcw className="text-amber-600" size={20} />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-gray-900 mb-1">
              Restore Service Group
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              Are you sure you want to restore <strong>{groupName}</strong> to active service groups?
            </p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => toast.dismiss(t)}
                className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  toast.dismiss(t);
                  await performRestore(groupId, groupName, "service-group");
                }}
                className="px-3 py-1.5 text-sm bg-green-600 text-white hover:bg-green-700 rounded-md transition-colors"
              >
                Restore
              </button>
            </div>
          </div>
        </div>
      </div>
    ), {
      duration: Infinity,
    });
  };

  const handleRestoreService = async (serviceId, serviceName) => {
    toast.custom((t) => (
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 max-w-sm w-full">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
            <RotateCcw className="text-amber-600" size={20} />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-gray-900 mb-1">
              Restore Service
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              Are you sure you want to restore <strong>{serviceName}</strong> to active services?
            </p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => toast.dismiss(t)}
                className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  toast.dismiss(t);
                  await performRestore(serviceId, serviceName, "service");
                }}
                className="px-3 py-1.5 text-sm bg-green-600 text-white hover:bg-green-700 rounded-md transition-colors"
              >
                Restore
              </button>
            </div>
          </div>
        </div>
      </div>
    ), {
      duration: Infinity,
    });
  };

  const performRestore = async (id, name, type) => {
  try {
    setIsRestoring(true);
    
    const loadingToast = toast.loading(`Restoring ${name}...`);
    
    let endpoint = "";
    let payload = {};
    
    if (type === "customer") {
      endpoint = "https://api.lizlyskincare.sbs/archive.php?action=restore";
      payload = { archive_id: id };
    } else if (type === "service-group") {
      endpoint = "https://api.lizlyskincare.sbs/archive.php?action=restore_service_group";
      payload = { group_id: id };
    } else if (type === "service") {
      endpoint = "https://api.lizlyskincare.sbs/archive.php?action=restore_service";
      payload = { service_id: id };
    }
    
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    
    const result = await response.json();
    
    toast.dismiss(loadingToast);

    if (result.success) {
      toast.success(`✅ ${type === 'customer' ? 'Customer' : type === 'service-group' ? 'Service Group' : 'Service'} ${name} restored successfully`, {
        description: `The ${type} is now back in the active list.`,
        duration: 4000,
      });
      
      fetchArchivedData();
      setSelectedItem(null);
    } else {
      throw new Error(result.message || `Failed to restore ${type}`);
    }
  } catch (error) {
    console.error(`Error restoring ${type}:`, error);
    toast.error(`❌ Error restoring ${type}`, {
      description: error.message || "Network error occurred. Please check your connection.",
      duration: 5000,
    });
  } finally {
    setIsRestoring(false);
  }
};

  const handleRunArchive = async () => {
    toast.custom((t) => (
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 max-w-sm w-full">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <Archive className="text-blue-600" size={20} />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-gray-900 mb-1">
              Run Archive Process
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              This will archive customers with no transactions in the last 1.5 years. This process may take a few moments.
            </p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => toast.dismiss(t)}
                className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  toast.dismiss(t);
                  await performArchive();
                }}
                className="px-3 py-1.5 text-sm bg-amber-600 text-white hover:bg-amber-700 rounded-md transition-colors"
              >
                Run Archive
              </button>
            </div>
          </div>
        </div>
      </div>
    ), {
      duration: Infinity,
    });
  };

  const performArchive = async () => {
  try {
    const loadingToast = toast.loading("Running archive process...", {
      description: "Checking for inactive customers...",
    });
    
    const response = await fetch("https://api.lizlyskincare.sbs/archive.php?action=run", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    
    const result = await response.json();
    
    toast.dismiss(loadingToast);

    if (result.success) {
      let description = `Successfully archived ${result.archived_count} inactive customers.`;
      
      if (result.total_processed > 0) {
        description += ` Processed ${result.total_processed} customers.`;
      }
      
      if (result.errors && result.errors.length > 0) {
        description += ` ${result.error_count} errors occurred (check console for details).`;
        console.warn('Archive process errors:', result.errors);
      }
      
      toast.success(`✅ Archive process completed`, {
        description: description,
        duration: 6000,
      });
      
      // Refresh the archived data
      fetchArchivedData();
    } else {
      throw new Error(result.message || "Archive process failed");
    }
  } catch (error) {
    console.error("Error running archive:", error);
    toast.error("❌ Archive process error", {
      description: error.message || "Network error occurred. Please check your connection.",
      duration: 5000,
    });
  }
};

  // Sorting function
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Get current data based on active tab
  const getCurrentData = () => {
    let data = [];
    
    if (activeTab === "customers") {
      data = archivedCustomers;
    } else if (activeTab === "service-groups") {
      data = archivedServiceGroups;
    } else if (activeTab === "services") {
      data = archivedServices;
    }
    
    // Apply search filter
    let filteredData = data.filter(item => {
      const matchesSearch = 
        item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.group_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.contact?.includes(searchQuery) ||
        item.email?.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Apply status filter for service groups and services
      const matchesStatus = 
        filterStatus === "all" || 
        (filterStatus === "active" && item.status === "Active") ||
        (filterStatus === "inactive" && item.status === "Inactive");
      
      return matchesSearch && matchesStatus;
    });
    
    // Apply sorting
    if (sortConfig.key) {
      filteredData.sort((a, b) => {
        const aValue = a[sortConfig.key]?.toLowerCase() || "";
        const bValue = b[sortConfig.key]?.toLowerCase() || "";

        if (aValue < bValue) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    
    return filteredData;
  };

  const sortedData = getCurrentData();
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    window.location.href = "/";
  };

  // Stats calculation
  const stats = {
    customers: archivedCustomers.length,
    serviceGroups: archivedServiceGroups.length,
    services: archivedServices.length,
  };

  // Sort indicator component
  const SortIndicator = ({ columnKey }) => {
    if (sortConfig.key !== columnKey) {
      return <ArrowUpDown size={14} className="text-gray-400" />;
    }
    return (
      <ChevronDown 
        size={14} 
        className={`transition-transform ${
          sortConfig.direction === "desc" ? "rotate-180" : ""
        }`}
      />
    );
  };

  // Render table based on active tab
  const renderTable = () => {
    if (activeTab === "customers") {
      return (
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th 
                className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors"
                onClick={() => handleSort("name")}
              >
                <div className="flex items-center gap-1">
                  Customer
                  <SortIndicator columnKey="name" />
                </div>
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Membership
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Last Activity
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Archived Date
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentItems.map((customer) => (
              <motion.tr
                key={customer.id}
                className={`hover:bg-emerald-50 cursor-pointer ${
                  selectedItem?.id === customer.id ? "bg-emerald-50" : ""
                }`}
                onClick={() => setSelectedItem(customer)}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                whileHover={{ scale: 1.005 }}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div>
                      <div className="text-sm font-semibold text-gray-900 flex items-center">
                        {customer.name}
                        <span className="ml-2 bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 text-xs px-2 py-1 rounded-full border border-amber-300 font-semibold shadow-sm">
                          📁 Archived
                        </span>
                      </div>
                      {customer.customerId && (
                        <div className="text-sm text-gray-500 mt-1">
                          ID: {customer.customerId}
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {customer.contact || "N/A"}
                  </div>
                  <div className="text-sm text-gray-500">
                    {customer.email || "N/A"}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      customer.membership_status === 'None' 
                        ? 'bg-gray-100 text-gray-800 border border-gray-200'
                        : customer.membership_status?.toLowerCase() === 'pro'
                          ? 'bg-purple-100 text-purple-800 border border-purple-200'
                          : customer.membership_status?.toLowerCase() === 'basic'
                            ? 'bg-blue-100 text-blue-800 border border-blue-200'
                            : 'bg-amber-100 text-amber-800 border border-amber-200'
                    }`}
                  >
                    {customer.membership_status || 'Non-Member'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 flex items-center">
                    <Calendar className="mr-2 text-gray-400" size={14} />
                    {customer.last_transaction_date || "No activity"}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {customer.archived_at}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex space-x-3">
                    <motion.button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRestoreCustomer(customer.id, customer.name);
                      }}
                      disabled={isRestoring}
                      className={`p-1.5 rounded-md transition-colors ${
                        isRestoring
                          ? 'text-gray-400 cursor-not-allowed'
                          : 'text-green-600 hover:text-green-800 hover:bg-green-100'
                      }`}
                      whileHover={{ scale: isRestoring ? 1 : 1.2 }}
                      whileTap={{ scale: isRestoring ? 1 : 0.9 }}
                      title="Restore Customer"
                    >
                      <RotateCcw size={16} />
                    </motion.button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      );
    } else if (activeTab === "service-groups") {
      return (
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th 
                className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors"
                onClick={() => handleSort("group_name")}
              >
                <div className="flex items-center gap-1">
                  Service Group
                  <SortIndicator columnKey="group_name" />
                </div>
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Services Count
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Archived Date
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentItems.map((group) => (
              <motion.tr
                key={group.group_id}
                className={`hover:bg-emerald-50 cursor-pointer ${
                  selectedItem?.group_id === group.group_id ? "bg-emerald-50" : ""
                }`}
                onClick={() => setSelectedItem(group)}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                whileHover={{ scale: 1.005 }}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div>
                      <div className="text-sm font-semibold text-gray-900 flex items-center">
                        {group.group_name}
                        <span className="ml-2 bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 text-xs px-2 py-1 rounded-full border border-amber-300 font-semibold shadow-sm">
                          📁 Archived
                        </span>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-600">
                    {group.description || "No description"}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <motion.span
                    className="px-3 py-1 text-xs rounded-full bg-emerald-100 text-emerald-800 font-medium"
                    whileHover={{ scale: 1.1 }}
                  >
                    {group.servicesCount || 0} Services
                  </motion.span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      group.status === 'Active' 
                        ? 'bg-green-100 text-green-800 border border-green-200'
                        : 'bg-red-100 text-red-800 border border-red-200'
                    }`}
                  >
                    {group.status || 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {group.archived_at || "N/A"}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex space-x-3">
                    <motion.button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRestoreServiceGroup(group.group_id, group.group_name);
                      }}
                      disabled={isRestoring}
                      className={`p-1.5 rounded-md transition-colors ${
                        isRestoring
                          ? 'text-gray-400 cursor-not-allowed'
                          : 'text-green-600 hover:text-green-800 hover:bg-green-100'
                      }`}
                      whileHover={{ scale: isRestoring ? 1 : 1.2 }}
                      whileTap={{ scale: isRestoring ? 1 : 0.9 }}
                      title="Restore Service Group"
                    >
                      <RotateCcw size={16} />
                    </motion.button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      );
    } else if (activeTab === "services") {
      return (
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th 
                className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors"
                onClick={() => handleSort("name")}
              >
                <div className="flex items-center gap-1">
                  Service
                  <SortIndicator columnKey="name" />
                </div>
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Duration
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Archived Date
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentItems.map((service) => (
              <motion.tr
                key={service.service_id}
                className={`hover:bg-emerald-50 cursor-pointer ${
                  selectedItem?.service_id === service.service_id ? "bg-emerald-50" : ""
                }`}
                onClick={() => setSelectedItem(service)}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                whileHover={{ scale: 1.005 }}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div>
                      <div className="text-sm font-semibold text-gray-900 flex items-center">
                        {service.name}
                        <span className="ml-2 bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 text-xs px-2 py-1 rounded-full border border-amber-300 font-semibold shadow-sm">
                          📁 Archived
                        </span>
                      </div>
                      {service.description && (
                        <div className="text-sm text-gray-500 mt-1">
                          {service.description}
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-600">
                    {service.category || "Uncategorized"}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-green-600">
                    ₱{service.price}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-600">
                    {service.duration || "-"} mins
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      service.status === 'Active' 
                        ? 'bg-green-100 text-green-800 border border-green-200'
                        : 'bg-red-100 text-red-800 border border-red-200'
                    }`}
                  >
                    {service.status || 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {service.archived_at || "N/A"}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex space-x-3">
                    <motion.button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRestoreService(service.service_id, service.name);
                      }}
                      disabled={isRestoring}
                      className={`p-1.5 rounded-md transition-colors ${
                        isRestoring
                          ? 'text-gray-400 cursor-not-allowed'
                          : 'text-green-600 hover:text-green-800 hover:bg-green-100'
                      }`}
                      whileHover={{ scale: isRestoring ? 1 : 1.2 }}
                      whileTap={{ scale: isRestoring ? 1 : 0.9 }}
                      title="Restore Service"
                    >
                      <RotateCcw size={16} />
                    </motion.button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      );
    }
  };

  // Render detail panel based on active tab
  const renderDetailPanel = () => {
    if (!selectedItem) return null;
    
    return (
      <motion.div
        className="hidden lg:block w-[350px]"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 50 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <motion.div
          className="bg-white rounded-xl shadow-md border border-gray-200 p-5 h-[calc(100vh-120px)] sticky top-20 overflow-y-auto"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        >
          {/* Panel Header */}
          <div className="flex justify-between items-center mb-5 pb-3 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">
              {activeTab === "customers" ? selectedItem.name : 
               activeTab === "service-groups" ? selectedItem.group_name : 
               selectedItem.name}
            </h2>
            <motion.button
              onClick={() => setSelectedItem(null)}
              className="text-gray-500 hover:text-gray-700 transition-colors p-1 rounded-full hover:bg-gray-100"
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            >
              <X size={20} />
            </motion.button>
          </div>

          {/* Content based on active tab */}
          {activeTab === "customers" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-600 mb-2">
                  Contact Information
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <Phone className="flex-shrink-0 mt-0.5 mr-3 text-gray-400" size={16} />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Contact</p>
                      <p className="text-sm text-gray-600">{selectedItem.contact || "N/A"}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Mail className="flex-shrink-0 mt-0.5 mr-3 text-gray-400" size={16} />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Email</p>
                      <p className="text-sm text-gray-600 break-all">{selectedItem.email || "N/A"}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-600 mb-2">
                  Archive Information
                </h3>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-amber-700">Status:</span>
                      <span className="font-medium text-amber-800">Archived</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-amber-700">Archived Date:</span>
                      <span className="font-medium">{selectedItem.archived_at}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-amber-700">Last Activity:</span>
                      <span className="font-medium">{selectedItem.last_transaction_date || "No activity"}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <motion.button
                  onClick={() => handleRestoreCustomer(selectedItem.id, selectedItem.name)}
                  disabled={isRestoring}
                  className={`w-full py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                    isRestoring
                      ? 'bg-gray-400 cursor-not-allowed text-white'
                      : 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white'
                  }`}
                  whileHover={isRestoring ? {} : { scale: 1.02 }}
                  whileTap={isRestoring ? {} : { scale: 0.98 }}
                >
                  <RotateCcw size={16} />
                  {isRestoring ? 'Restoring...' : 'Restore to Active Customers'}
                </motion.button>
              </div>
            </div>
          )}

          {(activeTab === "service-groups" || activeTab === "services") && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-600 mb-2">
                  {activeTab === "service-groups" ? "Group Information" : "Service Information"}
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Description</p>
                    <p className="text-sm text-gray-600 mt-1 bg-gray-50 p-3 rounded-lg">
                      {selectedItem.description || "No description available"}
                    </p>
                  </div>
                  
                  {activeTab === "service-groups" && (
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-blue-50 p-3 rounded-lg text-center border border-blue-100">
                        <div className="text-xs text-blue-600 font-medium">Total Services</div>
                        <div className="font-bold text-blue-800 text-lg">{selectedItem.servicesCount || 0}</div>
                      </div>
                    </div>
                  )}

                  {activeTab === "services" && (
                    <>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Category</p>
                        <p className="text-sm text-gray-600">{selectedItem.category || "Uncategorized"}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Price</p>
                        <p className="text-lg font-bold text-green-600">₱{selectedItem.price}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Duration</p>
                        <p className="text-sm text-gray-600">{selectedItem.duration || "-"} minutes</p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <motion.button
                  onClick={() => 
                    activeTab === "service-groups" 
                      ? handleRestoreServiceGroup(selectedItem.group_id, selectedItem.group_name)
                      : handleRestoreService(selectedItem.service_id, selectedItem.name)
                  }
                  disabled={isRestoring}
                  className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all ${
                    isRestoring
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-green-600 text-white hover:bg-green-700 shadow-sm'
                  }`}
                  whileHover={{ scale: isRestoring ? 1 : 1.02 }}
                  whileTap={{ scale: isRestoring ? 1 : 0.98 }}
                >
                  <RotateCcw size={18} />
                  {isRestoring ? "Restoring..." : `Restore ${activeTab === "service-groups" ? "Service Group" : "Service"}`}
                </motion.button>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    );
  };

  return (
    <div className={`flex flex-col h-screen ${darkMode ? "dark bg-[#0a1a14] text-gray-100" : "bg-gray-50 text-gray-800"}`}>
      <Toaster position="top-right" richColors />
      
      {/* Header - Matching your exact design */}
      <header className="flex items-center justify-between bg-emerald-800 text-white p-4 w-full h-16 pl-64 relative">
        <div className="flex items-center space-x-4">
          {/* Space for potential left-aligned elements */}
        </div>

        <div className="flex items-center space-x-4 flex-wrap gap-4 mb-1">
          {/* Search Input - Matching your current design */}
          <div className="relative flex-grow min-w-[200px]">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder={`Search archived ${activeTab}...`}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10 pr-4 py-2 rounded-lg bg-white/90 text-gray-800 w-full focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div className="flex items-center space-x-4 relative">
          <div
            className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center text-lg font-bold cursor-pointer hover:bg-amber-600 transition-colors"
            onClick={() => setIsProfileOpen(!isProfileOpen)}
          >
            A
          </div>
          <AnimatePresence>
            {isProfileOpen && (
              <motion.div
                className="absolute top-12 right-0 bg-white shadow-xl rounded-lg w-48 overflow-hidden z-50"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <Link
                  href="/roles"
                  className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 w-full text-gray-700"
                >
                  <Settings size={16} /> Settings
                </Link>
                <button
                  className="flex items-center gap-3 px-4 py-3 hover:bg-red-50 w-full text-red-500"
                  onClick={handleLogout}
                >
                  <LogOut size={16} /> Logout
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Enhanced Sidebar - Exact copy from your design */}
      <div className="flex flex-1">
        <nav className="w-64 h-screen bg-gradient-to-b from-emerald-800 to-emerald-700 text-white flex flex-col items-start py-6 fixed top-0 left-0 shadow-lg z-10">
          {/* Logo/Branding with subtle animation */}
          <motion.div
            className="flex items-center space-x-2 mb-8 px-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="p-2 bg-white/10 rounded-lg">
              <Leaf size={24} className="text-emerald-300" />
            </div>
            <h1 className="text-xl font-bold text-white font-sans tracking-tight">
              Lizly Skin Care Clinic
            </h1>
          </motion.div>

          {/* Search for Mobile (hidden on desktop) */}
          <div className="px-4 mb-4 w-full lg:hidden">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-300"
                size={18}
              />
              <input
                type="text"
                placeholder="Search menu..."
                className="pl-10 pr-4 py-2 rounded-lg bg-emerald-900/50 text-white w-full focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder-emerald-300"
              />
            </div>
          </div>

          {/* Menu Items */}
      <div className="w-full px-4 space-y-1 overflow-y-auto flex-grow custom-scrollbar">
        {[
          { path: "/home", icon: Home, label: "Dashboard" },
          { path: "/roles", icon: Shield, label: "Role Settings" },
          { path: "/employeeM", icon: Users, label: "Employee Management" },
          { path: "/userManage", icon: Users, label: "User Management" },
          { path: "/branchM", icon: Home, label: "Branch Management" },
          { path: "/archivees", icon: Archive, label: "Archives" },
        ].map((item) => (
          <Link key={item.path} href={item.path} passHref>
            <div
              className={`w-full p-3 rounded-lg text-left flex items-center cursor-pointer transition-all ${pathname === item.path ? "bg-emerald-600 shadow-md" : "hover:bg-emerald-600/70"}`}
            >
              <div
                className={`p-1.5 mr-3 rounded-lg ${pathname === item.path ? "bg-white text-emerald-700" : "bg-emerald-900/30 text-white"}`}
              >
                <item.icon size={18} />
              </div>
              <span>{item.label}</span>
              {pathname === item.path && (
                <motion.div
                  className="ml-auto w-2 h-2 bg-white rounded-full"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                />
              )}
            </div>
          </Link>
        ))}
      </div>

          {/* Enhanced Sidebar Footer */}
          <motion.div
            className="mt-auto px-6 w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="border-t border-emerald-600 pt-4 pb-2">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center">
                    <User size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Admin User</p>
                    <p className="text-xs text-emerald-300">Administrator</p>
                  </div>
                </div>
                <button 
                  className="text-emerald-300 hover:text-white transition-colors"
                  onClick={handleLogout}
                >
                  <LogOut size={18} />
                </button>
              </div>
              <p className="text-xs text-emerald-200 mt-3">
                Lizly Skin Care Clinic v1.2.0
              </p>
              <p className="text-xs text-emerald-300 mt-1">
                © {new Date().getFullYear()} All Rights Reserved
              </p>
            </div>
          </motion.div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-8 max-w-screen-xl mx-auto ml-64 bg-white min-h-screen pt-26">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex justify-between items-center mb-6"
          >
            <h1 className="text-2xl font-bold text-gray-800">
              Archives
            </h1>
          </motion.div>

          {/* Tabs Navigation */}
<div className="mb-6 border-b border-gray-200">
  <div className="flex items-end justify-between">
    {/* Left: Tabs */}
    <nav className="-mb-px flex space-x-8">
      {[
        { id: "customers", name: "Customers", icon: Users },
        { id: "service-groups", name: "Service Groups", icon: Layers },
        { id: "services", name: "Services", icon: Package },
      ].map((tab) => {
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              setCurrentPage(1);
              setSelectedItem(null);
            }}
            className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
              activeTab === tab.id
                ? "border-emerald-500 text-emerald-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <Icon size={18} />
            {tab.name}
            <span
              className={`ml-2 px-2 py-1 text-xs rounded-full ${
                activeTab === tab.id
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {stats[tab.id.replace("-", "")]}
            </span>
          </button>
        );
      })}
    </nav>

    {/* Right: Run Archive button */}
    <motion.button
      onClick={handleRunArchive}
      aria-label="Run Archive"
      className="ml-4 self-end flex items-center space-x-2 bg-amber-600 hover:bg-amber-700 text-white py-2.5 px-4 rounded-lg transition-colors font-medium shadow-md hover:shadow-lg"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Archive size={18} />
      <span>Run Archive</span>
    </motion.button>
  </div>
</div>

          {/* Stats Overview */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 flex items-center">
              <div className="bg-gray-100 p-3 rounded-lg mr-4">
                <Users className="text-gray-600" size={20} />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800">
                  {stats.customers}
                </h3>
                <p className="text-sm text-gray-600">
                  Archived Customers
                </p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 flex items-center">
              <div className="bg-blue-100 p-3 rounded-lg mr-4">
                <Layers className="text-blue-600" size={20} />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800">
                  {stats.serviceGroups}
                </h3>
                <p className="text-sm text-gray-600">
                  Archived Service Groups
                </p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 flex items-center">
              <div className="bg-amber-100 p-3 rounded-lg mr-4">
                <Package className="text-amber-600" size={20} />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800">
                  {stats.services}
                </h3>
                <p className="text-sm text-gray-600">
                  Archived Services
                </p>
              </div>
            </div>
          </motion.div>

          <div className="flex">
            {/* Main Content Area */}
            <motion.div
              className={`${selectedItem ? "w-[calc(100%-350px)]" : "w-full"} transition-all duration-300 pr-4`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <motion.div
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                {isLoading ? (
                  <div className="flex justify-center items-center py-16">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
                  </div>
                ) : currentItems.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <Archive className="text-gray-400" size={32} />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No Archived {activeTab === "customers" ? "Customers" : activeTab === "service-groups" ? "Service Groups" : "Services"}
                    </h3>
                    <p className="text-gray-500 max-w-md mx-auto">
                      {searchQuery
                        ? `No ${activeTab} found matching "${searchQuery}".`
                        : `All ${activeTab} are currently active. Archived items will appear here.`}
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="overflow-x-auto">
                      {renderTable()}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="flex items-center justify-between px-6 py-4 bg-white border-t border-gray-200">
                        <div className="flex-1 flex justify-between sm:hidden">
                          <button
                            onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                            disabled={currentPage === 1}
                            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                          >
                            Previous
                          </button>
                          <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentItems.length < itemsPerPage}
                            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                          >
                            Next
                          </button>
                        </div>
                        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                          <div>
                            <p className="text-sm text-gray-700">
                              Showing{" "}
                              <span className="font-medium">
                                {(currentPage - 1) * itemsPerPage + 1}
                              </span>{" "}
                              to{" "}
                              <span className="font-medium">
                                {Math.min(currentPage * itemsPerPage, sortedData.length)}
                              </span>{" "}
                              of <span className="font-medium">{sortedData.length}</span>{" "}
                              results
                            </p>
                          </div>
                          <div>
                            <nav
                              className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                              aria-label="Pagination"
                            >
                              <button
                                onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                                disabled={currentPage === 1}
                                className="relative inline-flex items-center px-3 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                              >
                                <span className="sr-only">Previous</span>
                                <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                              </button>
                              {Array.from({
                                length: Math.ceil(sortedData.length / itemsPerPage),
                              }).map((_, index) => (
                                <button
                                  key={index}
                                  onClick={() => handlePageChange(index + 1)}
                                  className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                    currentPage === index + 1
                                      ? "z-10 bg-emerald-50 border-emerald-500 text-emerald-600"
                                      : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                                  }`}
                                >
                                  {index + 1}
                                </button>
                              ))}
                              <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage * itemsPerPage >= sortedData.length}
                                className="relative inline-flex items-center px-3 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                              >
                                <span className="sr-only">Next</span>
                                <ChevronRight className="h-5 w-5" aria-hidden="true" />
                              </button>
                            </nav>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </motion.div>
            </motion.div>

            {/* Detail Panel */}
            <AnimatePresence>
              {renderDetailPanel()}
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}