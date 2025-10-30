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
  Shield,
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
  Filter,
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
        const response = await fetch("https://api.lizlyskincare.sbs/servicegroup.php?action=get_archived_groups");
        if (!response.ok) throw new Error("Failed to fetch archived service groups");
        const data = await response.json();
        setArchivedServiceGroups(Array.isArray(data) ? data : []);
      } else if (activeTab === "services") {
        const response = await fetch("https://api.lizlyskincare.sbs/servicegroup.php?action=get_archived_services");
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
        endpoint = "https://api.lizlyskincare.sbs/servicegroup.php?action=restore_group";
        payload = { group_id: id };
      } else if (type === "service") {
        endpoint = "https://api.lizlyskincare.sbs/servicegroup.php?action=restore_service";
        payload = { service_id: id };
      }
      
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
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
        toast.error(`❌ Failed to restore ${type}`, {
          description: result.message || "Please try again.",
          duration: 5000,
        });
      }
    } catch (error) {
      console.error(`Error restoring ${type}:`, error);
      toast.error(`❌ Error restoring ${type}`, {
        description: "Network error occurred. Please check your connection.",
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
        method: "POST"
      });

      const result = await response.json();

      toast.dismiss(loadingToast);

      if (result.success) {
        if (result.archived_count > 0) {
          toast.success(`✅ Archive process completed`, {
            description: `Successfully archived ${result.archived_count} inactive customer${result.archived_count === 1 ? '' : 's'}.`,
            duration: 5000,
          });
        } else {
          toast.info("📭 No customers to archive", {
            description: "No inactive customers found matching the criteria.",
            duration: 4000,
          });
        }
        fetchArchivedData();
      } else {
        toast.error("❌ Archive process failed", {
          description: result.message || "Please try again.",
          duration: 5000,
        });
      }
    } catch (error) {
      console.error("Error running archive:", error);
      toast.error("❌ Archive process error", {
        description: "Network error occurred. Please check your connection.",
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
          <thead className="bg-gray-50">
            <tr>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleSort("name")}
              >
                <div className="flex items-center gap-1">
                  Customer
                  <SortIndicator columnKey="name" />
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Membership
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Activity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Archived Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentItems.map((customer) => (
              <motion.tr
                key={customer.id}
                className={`hover:bg-gray-50 cursor-pointer ${
                  selectedItem?.id === customer.id ? "bg-emerald-50" : ""
                }`}
                onClick={() => setSelectedItem(customer)}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                whileHover={{ backgroundColor: "#f9fafb" }}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div>
                      <div className="text-sm font-medium text-gray-900 flex items-center">
                        {customer.name}
                        <span className="ml-2 bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 text-xs px-2 py-1 rounded-full border border-amber-300 font-semibold shadow-sm">
                          📁 Archived
                        </span>
                      </div>
                      {customer.customerId && (
                        <div className="text-xs text-gray-500 mt-1">
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
                  <div className="flex space-x-2">
                    <motion.button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRestoreCustomer(customer.id, customer.name);
                      }}
                      disabled={isRestoring}
                      className={`p-1.5 rounded-lg transition-colors ${
                        isRestoring
                          ? 'text-gray-400 cursor-not-allowed'
                          : 'text-green-600 hover:text-green-800 hover:bg-green-50'
                      }`}
                      whileHover={{ scale: isRestoring ? 1 : 1.1 }}
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
          <thead className="bg-gray-50">
            <tr>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleSort("group_name")}
              >
                <div className="flex items-center gap-1">
                  Service Group
                  <SortIndicator columnKey="group_name" />
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Services Count
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Archived Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentItems.map((group) => (
              <motion.tr
                key={group.group_id}
                className={`hover:bg-gray-50 cursor-pointer ${
                  selectedItem?.group_id === group.group_id ? "bg-emerald-50" : ""
                }`}
                onClick={() => setSelectedItem(group)}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                whileHover={{ backgroundColor: "#f9fafb" }}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div>
                      <div className="text-sm font-medium text-gray-900 flex items-center">
                        {group.group_name}
                        <span className="ml-2 bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 text-xs px-2 py-1 rounded-full border border-amber-300 font-semibold shadow-sm">
                          📁 Archived
                        </span>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {group.description || "No description"}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-3 py-1 text-xs rounded-full bg-emerald-100 text-emerald-800 font-medium">
                    {group.servicesCount || 0} Services
                  </span>
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
                  <div className="flex space-x-2">
                    <motion.button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRestoreServiceGroup(group.group_id, group.group_name);
                      }}
                      disabled={isRestoring}
                      className={`p-1.5 rounded-lg transition-colors ${
                        isRestoring
                          ? 'text-gray-400 cursor-not-allowed'
                          : 'text-green-600 hover:text-green-800 hover:bg-green-50'
                      }`}
                      whileHover={{ scale: isRestoring ? 1 : 1.1 }}
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
          <thead className="bg-gray-50">
            <tr>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleSort("name")}
              >
                <div className="flex items-center gap-1">
                  Service
                  <SortIndicator columnKey="name" />
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Duration
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Archived Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentItems.map((service) => (
              <motion.tr
                key={service.service_id}
                className={`hover:bg-gray-50 cursor-pointer ${
                  selectedItem?.service_id === service.service_id ? "bg-emerald-50" : ""
                }`}
                onClick={() => setSelectedItem(service)}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                whileHover={{ backgroundColor: "#f9fafb" }}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div>
                      <div className="text-sm font-medium text-gray-900 flex items-center">
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
                  <div className="text-sm text-gray-900">
                    {service.category || "Uncategorized"}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-green-600">
                    ₱{service.price}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
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
                  <div className="flex space-x-2">
                    <motion.button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRestoreService(service.service_id, service.name);
                      }}
                      disabled={isRestoring}
                      className={`p-1.5 rounded-lg transition-colors ${
                        isRestoring
                          ? 'text-gray-400 cursor-not-allowed'
                          : 'text-green-600 hover:text-green-800 hover:bg-green-50'
                      }`}
                      whileHover={{ scale: isRestoring ? 1 : 1.1 }}
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
    
    if (activeTab === "customers") {
      return (
        <motion.div
          className="lg:w-[350px]"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.3 }}
        >
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6 h-[calc(100vh-120px)] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">
                {selectedItem.name}
              </h2>
              <button
                onClick={() => setSelectedItem(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  Contact Information
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <Phone
                      className="flex-shrink-0 mt-0.5 mr-3 text-gray-400"
                      size={16}
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Contact</p>
                      <p className="text-sm text-gray-600">
                        {selectedItem.contact || "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Mail
                      className="flex-shrink-0 mt-0.5 mr-3 text-gray-400"
                      size={16}
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Email</p>
                      <p className="text-sm text-gray-600 break-all">
                        {selectedItem.email || "N/A"}
                      </p>
                    </div>
                  </div>
                  {selectedItem.birthday && (
                    <div className="flex items-start">
                      <Calendar
                        className="flex-shrink-0 mt-0.5 mr-3 text-gray-400"
                        size={16}
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Birthday</p>
                        <p className="text-sm text-gray-600">
                          {selectedItem.birthday}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
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

              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  Membership Status
                </h3>
                <div className={`p-4 rounded-lg border ${
                  selectedItem.membership_status === 'None' 
                    ? 'bg-gray-50 border-gray-200'
                    : selectedItem.membership_status?.toLowerCase() === 'pro'
                      ? 'bg-purple-50 border-purple-200'
                      : selectedItem.membership_status?.toLowerCase() === 'basic'
                        ? 'bg-blue-50 border-blue-200'
                        : 'bg-amber-50 border-amber-200'
                }`}>
                  <div className="flex justify-between items-center">
                    <span className={`font-medium ${
                      selectedItem.membership_status === 'None' 
                        ? 'text-gray-800'
                        : selectedItem.membership_status?.toLowerCase() === 'pro'
                          ? 'text-purple-800'
                          : selectedItem.membership_status?.toLowerCase() === 'basic'
                            ? 'text-blue-800'
                            : 'text-amber-800'
                    }`}>
                      {selectedItem.membership_status || 'Non-Member'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <motion.button
                  onClick={() => handleRestoreCustomer(selectedItem.id, selectedItem.name)}
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
                  {isRestoring ? "Restoring..." : "Restore Customer"}
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      );
    } else if (activeTab === "service-groups") {
      return (
        <motion.div
          className="lg:w-[350px]"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.3 }}
        >
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6 h-[calc(100vh-120px)] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">
                {selectedItem.group_name}
              </h2>
              <button
                onClick={() => setSelectedItem(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  Group Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Description</p>
                    <p className="text-sm text-gray-600 mt-1">
                      {selectedItem.description || "No description available"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Services Count</p>
                    <p className="text-sm text-gray-600 mt-1">
                      {selectedItem.servicesCount || 0} services
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
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
                      <span className="font-medium">{selectedItem.archived_at || "N/A"}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <motion.button
                  onClick={() => handleRestoreServiceGroup(selectedItem.group_id, selectedItem.group_name)}
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
                  {isRestoring ? "Restoring..." : "Restore Service Group"}
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      );
    } else if (activeTab === "services") {
      return (
        <motion.div
          className="lg:w-[350px]"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.3 }}
        >
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6 h-[calc(100vh-120px)] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">
                {selectedItem.name}
              </h2>
              <button
                onClick={() => setSelectedItem(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  Service Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Description</p>
                    <p className="text-sm text-gray-600 mt-1">
                      {selectedItem.description || "No description available"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Category</p>
                    <p className="text-sm text-gray-600 mt-1">
                      {selectedItem.category || "Uncategorized"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Price</p>
                    <p className="text-lg font-bold text-green-600 mt-1">
                      ₱{selectedItem.price}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Duration</p>
                    <p className="text-sm text-gray-600 mt-1">
                      {selectedItem.duration || "-"} minutes
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
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
                      <span className="font-medium">{selectedItem.archived_at || "N/A"}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <motion.button
                  onClick={() => handleRestoreService(selectedItem.service_id, selectedItem.name)}
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
                  {isRestoring ? "Restoring..." : "Restore Service"}
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" richColors closeButton />
      
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Link
                href="/dashboard"
                className="flex items-center text-emerald-700 hover:text-emerald-800 transition-colors"
              >
                <ChevronLeft size={20} />
                <span className="ml-1 font-medium">Back to Dashboard</span>
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <div className="flex items-center">
                <Leaf className="text-emerald-600 mr-2" size={24} />
                <h1 className="text-2xl font-bold text-gray-900">Lizly Skincare</h1>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <motion.button
                onClick={handleRunArchive}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg hover:from-amber-600 hover:to-amber-700 transition-all shadow-sm font-medium"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Archive size={18} />
                Run Archive
              </motion.button>

              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-3 bg-gray-50 hover:bg-gray-100 rounded-lg px-3 py-2 transition-colors border border-gray-200"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    A
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-900">Admin</p>
                    <p className="text-xs text-gray-500">Administrator</p>
                  </div>
                  <ChevronDown
                    size={16}
                    className={`text-gray-400 transition-transform ${
                      isProfileOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50"
                    >
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">Admin User</p>
                        <p className="text-sm text-gray-500 mt-1">
                          admin@lizlyskincare.com
                        </p>
                      </div>
                      <div className="py-2">
                        <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                          <User className="mr-3 text-gray-400" size={16} />
                          Profile Settings
                        </button>
                        <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                          <Settings className="mr-3 text-gray-400" size={16} />
                          System Settings
                        </button>
                      </div>
                      <div className="border-t border-gray-100 pt-2">
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut className="mr-3" size={16} />
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Archived Customers
                  </p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {stats.customers}
                  </p>
                  <p className="text-xs text-amber-600 mt-1 font-medium">
                    Inactive for 1.5+ years
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-yellow-100 rounded-full flex items-center justify-center">
                  <UserX className="text-amber-600" size={24} />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Archived Service Groups
                  </p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {stats.serviceGroups}
                  </p>
                  <p className="text-xs text-amber-600 mt-1 font-medium">
                    Set to inactive status
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-yellow-100 rounded-full flex items-center justify-center">
                  <Layers className="text-amber-600" size={24} />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Archived Services
                  </p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {stats.services}
                  </p>
                  <p className="text-xs text-amber-600 mt-1 font-medium">
                    Set to inactive status
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-yellow-100 rounded-full flex items-center justify-center">
                  <Package className="text-amber-600" size={24} />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
          >
            {/* Tabs */}
            <div className="border-b border-gray-200">
              <div className="px-6">
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
                        className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors ${
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
              </div>
            </div>

            {/* Search and Filters */}
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                <div className="relative flex-1 max-w-md">
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
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>

                {(activeTab === "service-groups" || activeTab === "services") && (
                  <div className="flex items-center gap-2">
                    <Filter size={16} className="text-gray-400" />
                    <select
                      value={filterStatus}
                      onChange={(e) => {
                        setFilterStatus(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                    >
                      <option value="all">All Status</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                )}
              </div>
            </div>

            {/* Table */}
            <div className="flex">
              <div className={`flex-1 overflow-x-auto ${selectedItem ? "lg:pr-[350px]" : ""}`}>
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
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery("")}
                        className="mt-4 text-emerald-600 hover:text-emerald-700 font-medium"
                      >
                        Clear search
                      </button>
                    )}
                  </div>
                ) : (
                  <>
                    <div className="overflow-x-auto">
                      {renderTable()}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-gray-700">
                            Showing{" "}
                            <span className="font-medium">
                              {indexOfFirstItem + 1}
                            </span>{" "}
                            to{" "}
                            <span className="font-medium">
                              {Math.min(indexOfLastItem, sortedData.length)}
                            </span>{" "}
                            of{" "}
                            <span className="font-medium">{sortedData.length}</span>{" "}
                            results
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handlePageChange(1)}
                              disabled={currentPage === 1}
                              className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                            >
                              <ChevronsLeft size={16} />
                            </button>
                            <button
                              onClick={() => handlePageChange(currentPage - 1)}
                              disabled={currentPage === 1}
                              className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                            >
                              <ChevronLeft size={16} />
                            </button>
                            <div className="flex items-center space-x-1">
                              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                let pageNumber;
                                if (totalPages <= 5) {
                                  pageNumber = i + 1;
                                } else if (currentPage <= 3) {
                                  pageNumber = i + 1;
                                } else if (currentPage >= totalPages - 2) {
                                  pageNumber = totalPages - 4 + i;
                                } else {
                                  pageNumber = currentPage - 2 + i;
                                }

                                return (
                                  <button
                                    key={pageNumber}
                                    onClick={() => handlePageChange(pageNumber)}
                                    className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                                      currentPage === pageNumber
                                        ? "bg-emerald-600 text-white"
                                        : "text-gray-700 hover:bg-gray-100"
                                    }`}
                                  >
                                    {pageNumber}
                                  </button>
                                );
                              })}
                            </div>
                            <button
                              onClick={() => handlePageChange(currentPage + 1)}
                              disabled={currentPage === totalPages}
                              className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                            >
                              <ChevronRight size={16} />
                            </button>
                            <button
                              onClick={() => handlePageChange(totalPages)}
                              disabled={currentPage === totalPages}
                              className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                            >
                              <ChevronsRight size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Detail Panel */}
              <AnimatePresence>
                {selectedItem && renderDetailPanel()}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}