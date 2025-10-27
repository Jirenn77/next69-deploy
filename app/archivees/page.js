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
} from "lucide-react";

export default function ArchivePage() {
  const router = useRouter();
  const pathname = usePathname();
  const [archivedCustomers, setArchivedCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [customersPerPage] = useState(10);
  const [isRestoring, setIsRestoring] = useState(false);

  // Sorting state
  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "asc"
  });

  useEffect(() => {
    fetchArchivedCustomers();
  }, []);

  const fetchArchivedCustomers = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("http://localhost/API/archive.php?action=get");
      if (!response.ok) throw new Error("Failed to fetch archived customers");
      const data = await response.json();
      setArchivedCustomers(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error("Failed to load archived customers");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestoreCustomer = async (archiveId, customerName) => {
  // Show confirmation toast instead of alert
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
                await performRestore(archiveId, customerName);
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
    duration: Infinity, // Stay until user action
  });
};

const performRestore = async (archiveId, customerName) => {
  try {
    setIsRestoring(true);
    
    // Show loading toast
    const loadingToast = toast.loading(`Restoring ${customerName}...`);
    
    const response = await fetch("http://localhost/API/archive.php?action=restore", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ archive_id: archiveId })
    });

    const result = await response.json();

    // Dismiss loading toast
    toast.dismiss(loadingToast);

    if (result.success) {
      toast.success(`✅ Customer ${customerName} restored successfully`, {
        description: "The customer is now back in the active customers list.",
        duration: 4000,
      });
      fetchArchivedCustomers();
      setSelectedCustomer(null);
    } else {
      toast.error("❌ Failed to restore customer", {
        description: result.message || "Please try again.",
        duration: 5000,
      });
    }
  } catch (error) {
    console.error("Error restoring customer:", error);
    toast.error("❌ Error restoring customer", {
      description: "Network error occurred. Please check your connection.",
      duration: 5000,
    });
  } finally {
    setIsRestoring(false);
  }
};

const handleRunArchive = async () => {
  // Show confirmation toast instead of alert
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
    duration: Infinity, // Stay until user action
  });
};

const performArchive = async () => {
  try {
    // Show loading toast
    const loadingToast = toast.loading("Running archive process...", {
      description: "Checking for inactive customers...",
    });
    
    const response = await fetch("https://api.lizlyskincare.sbs/archive.php?action=run", {
      method: "POST"
    });

    const result = await response.json();

    // Dismiss loading toast
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
      fetchArchivedCustomers();
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

  // Get sorted and filtered customers
  const getSortedCustomers = () => {
    const sortableCustomers = [...filteredCustomers];
    if (sortConfig.key) {
      sortableCustomers.sort((a, b) => {
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
    return sortableCustomers;
  };

  const filteredCustomers = archivedCustomers.filter(customer =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.contact?.includes(searchQuery) ||
    customer.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedCustomers = getSortedCustomers();
  const indexOfLastCustomer = currentPage * customersPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;
  const currentCustomers = sortedCustomers.slice(indexOfFirstCustomer, indexOfLastCustomer);
  const totalPages = Math.ceil(sortedCustomers.length / customersPerPage);

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
    total: archivedCustomers.length,
    withMembership: archivedCustomers.filter(c => c.membership_status !== 'None').length,
    withoutMembership: archivedCustomers.filter(c => c.membership_status === 'None').length,
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

  return (
    <div className="flex flex-col h-screen bg-[#77DD77] text-gray-900">
      <Toaster />
      {/* Header */}
      <header className="flex items-center justify-between bg-emerald-700 text-white p-4 w-full h-16 pl-64 relative">
        <div className="flex items-center space-x-4">
          {/* Space for potential left-aligned elements */}
        </div>

        <div className="flex items-center space-x-4 flex-grow justify-center">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search archived customers by name, contact, or email..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10 pr-10 py-2 rounded-lg bg-white border border-gray-300 text-gray-800 w-80 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              onKeyPress={(e) => e.key === "Enter" && setCurrentPage(1)}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={18} />
              </button>
            )}
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
                  href="/profiles"
                  className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 w-full text-gray-700"
                >
                  <User size={16} /> Profile
                </Link>
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

      {/* Enhanced Sidebar */}
      <div className="flex flex-1">
        <nav className="w-64 h-screen bg-gradient-to-b from-emerald-800 to-emerald-700 text-white flex flex-col items-start py-6 fixed top-0 left-0 shadow-lg z-10">
          {/* Branding with Logo */}
          <div className="flex items-center space-x-3 mb-8 px-6">
            <div className="p-2 bg-white/10 rounded-lg flex items-center justify-center">
              <Leaf className="text-emerald-300" size={24} />
            </div>
            <h1 className="text-xl font-bold text-white font-sans tracking-tight">
              Lizly Skin Care Clinic
            </h1>
          </div>

          {/* Menu Items with Active States */}
          <div className="w-full px-4 space-y-1 overflow-y-auto flex-grow custom-scrollbar">
            <Link href="/home" passHref>
              <div
                className={`w-full p-3 rounded-lg text-left flex items-center cursor-pointer transition-all ${pathname === "/home" ? "bg-emerald-600 shadow-md" : "hover:bg-emerald-600/70"}`}
              >
                <div
                  className={`p-1.5 mr-3 rounded-lg ${pathname === "/home" ? "bg-white text-emerald-700" : "bg-emerald-900/30 text-white"}`}
                >
                  <Home size={18} />
                </div>
                <span>Dashboard</span>
                {pathname === "/home" && (
                  <motion.div
                    className="ml-auto w-2 h-2 bg-white rounded-full"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                  />
                )}
              </div>
            </Link>

            <Link href="/customers" passHref>
              <div
                className={`w-full p-3 rounded-lg text-left flex items-center cursor-pointer transition-all ${pathname === "/customers" ? "bg-emerald-600 shadow-md" : "hover:bg-emerald-600/70"}`}
              >
                <div
                  className={`p-1.5 mr-3 rounded-lg ${pathname === "/customers" ? "bg-white text-emerald-700" : "bg-emerald-900/30 text-white"}`}
                >
                  <Users size={18} />
                </div>
                <span>Customer Management</span>
                {pathname === "/customers" && (
                  <motion.div
                    className="ml-auto w-2 h-2 bg-white rounded-full"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                  />
                )}
              </div>
            </Link>

            <Link href="/archive" passHref>
              <div
                className={`w-full p-3 rounded-lg text-left flex items-center cursor-pointer transition-all ${pathname === "/archive" ? "bg-emerald-600 shadow-md" : "hover:bg-emerald-600/70"}`}
              >
                <div
                  className={`p-1.5 mr-3 rounded-lg ${pathname === "/archive" ? "bg-white text-emerald-700" : "bg-emerald-900/30 text-white"}`}
                >
                  <Archive size={18} />
                </div>
                <span>Customer Archive</span>
                {pathname === "/archive" && (
                  <motion.div
                    className="ml-auto w-2 h-2 bg-white rounded-full"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                  />
                )}
              </div>
            </Link>

            <Link href="/userManage" passHref>
              <div
                className={`w-full p-3 rounded-lg text-left flex items-center cursor-pointer transition-all ${pathname === "/userManage" ? "bg-emerald-600 shadow-md" : "hover:bg-emerald-600/70"}`}
              >
                <div
                  className={`p-1.5 mr-3 rounded-lg ${pathname === "/userManage" ? "bg-white text-emerald-700" : "bg-emerald-900/30 text-white"}`}
                >
                  <Users size={18} />
                </div>
                <span>User Management</span>
                {pathname === "/userManage" && (
                  <motion.div
                    className="ml-auto w-2 h-2 bg-white rounded-full"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                  />
                )}
              </div>
            </Link>
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
        <main className="flex-1 p-6 bg-gray-50 ml-64 overflow-x-hidden">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6"
          >
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Customer Archive
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Manage archived customers and restore them when needed
              </p>
            </div>

            <div className="mt-4 md:mt-0">
              <motion.button
                onClick={handleRunArchive}
                className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Archive size={18} />
                <span>Run Archive Process</span>
              </motion.button>
            </div>
          </motion.div>

          {/* Stats Overview */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 flex items-center">
              <div className="bg-gray-100 p-3 rounded-lg mr-4">
                <Archive className="text-gray-600" size={20} />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800">
                  {stats.total}
                </h3>
                <p className="text-sm text-gray-600">
                  Total Archived
                </p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 flex items-center">
              <div className="bg-blue-100 p-3 rounded-lg mr-4">
                <UserCheck className="text-blue-600" size={20} />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800">
                  {stats.withMembership}
                </h3>
                <p className="text-sm text-gray-600">
                  With Membership
                </p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 flex items-center">
              <div className="bg-amber-100 p-3 rounded-lg mr-4">
                <UserX className="text-amber-600" size={20} />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800">
                  {stats.withoutMembership}
                </h3>
                <p className="text-sm text-gray-600">
                  Without Membership
                </p>
              </div>
            </div>
          </motion.div>

          {/* Main Content Area */}
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Archive Table */}
            <motion.div
              className={`${selectedCustomer ? "lg:w-[calc(100%-350px)]" : "w-full"} transition-all duration-300`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
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
                      {isLoading ? (
                        <tr>
                          <td colSpan="6" className="px-6 py-8 text-center">
                            <div className="flex justify-center">
                              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
                            </div>
                            <p className="text-gray-500 mt-2">Loading archived customers...</p>
                          </td>
                        </tr>
                      ) : currentCustomers.length === 0 ? (
                        <tr>
                          <td
                            colSpan="6"
                            className="px-6 py-8 text-center text-gray-500"
                          >
                            <Archive className="mx-auto h-12 w-12 text-gray-300 mb-2" />
                            <p>No archived customers found</p>
                            {searchQuery && (
                              <p className="text-sm mt-1">Try adjusting your search</p>
                            )}
                          </td>
                        </tr>
                      ) : (
                        currentCustomers.map((customer) => (
                          <motion.tr
                            key={customer.id}
                            className={`hover:bg-gray-50 cursor-pointer ${selectedCustomer?.id === customer.id
                              ? "bg-emerald-50"
                              : ""
                              }`}
                            onClick={() => setSelectedCustomer(customer)}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2 }}
                            whileHover={{ backgroundColor: "#f9fafb" }}
                          >
                            {/* Customer Column */}
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

                            {/* Contact Column */}
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {customer.contact || "N/A"}
                              </div>
                              <div className="text-sm text-gray-500">
                                {customer.email || "N/A"}
                              </div>
                            </td>

                            {/* Membership Column */}
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

                            {/* Last Activity Column */}
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900 flex items-center">
                                <Calendar className="mr-2 text-gray-400" size={14} />
                                {customer.last_transaction_date || "No activity"}
                              </div>
                            </td>

                            {/* Archived Date Column */}
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {customer.archived_at}
                              </div>
                            </td>

                            {/* Actions Column */}
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
                        ))
                      )}
                    </tbody>
                  </table>

                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                    <div className="flex flex-col sm:flex-row justify-between items-center mt-4 px-6 py-3 bg-white border-t border-gray-200 rounded-b-xl">
                      {/* Showing count */}
                      <span className="text-sm text-gray-600 mb-2 sm:mb-0">
                        Showing {indexOfFirstCustomer + 1} to{" "}
                        {Math.min(indexOfLastCustomer, sortedCustomers.length)} of{" "}
                        {sortedCustomers.length} customers
                      </span>

                      {/* Page buttons */}
                      <div className="flex items-center space-x-1">
                        <button
                          className="p-2 rounded hover:bg-gray-100 disabled:opacity-50 transition-colors"
                          onClick={() => handlePageChange(1)}
                          disabled={currentPage === 1}
                        >
                          <ChevronsLeft size={16} />
                        </button>
                        <button
                          className="p-2 rounded hover:bg-gray-100 disabled:opacity-50 transition-colors"
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                        >
                          <ChevronLeft size={16} />
                        </button>

                        {/* Page numbers */}
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`px-3 py-1 rounded-lg text-sm transition-colors ${currentPage === page
                                ? "bg-emerald-600 text-white"
                                : "hover:bg-gray-100"
                              }`}
                          >
                            {page}
                          </button>
                        ))}

                        <button
                          className="p-2 rounded hover:bg-gray-100 disabled:opacity-50 transition-colors"
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                        >
                          <ChevronRight size={16} />
                        </button>
                        <button
                          className="p-2 rounded hover:bg-gray-100 disabled:opacity-50 transition-colors"
                          onClick={() => handlePageChange(totalPages)}
                          disabled={currentPage === totalPages}
                        >
                          <ChevronsRight size={16} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Customer Details Panel */}
            {selectedCustomer && (
              <motion.div
                className="lg:w-[350px]"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6 h-[calc(100vh-120px)] overflow-y-auto">
                  {/* Panel Header */}
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-800">
                      {selectedCustomer.name}
                    </h2>
                    <button
                      onClick={() => setSelectedCustomer(null)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  {/* Customer Information */}
                  <div className="space-y-6">
                    {/* Basic Info */}
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
                              {selectedCustomer.contact || "N/A"}
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
                              {selectedCustomer.email || "N/A"}
                            </p>
                          </div>
                        </div>
                        {selectedCustomer.birthday && (
                          <div className="flex items-start">
                            <Calendar
                              className="flex-shrink-0 mt-0.5 mr-3 text-gray-400"
                              size={16}
                            />
                            <div>
                              <p className="text-sm font-medium text-gray-900">Birthday</p>
                              <p className="text-sm text-gray-600">
                                {selectedCustomer.birthday}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Archive Information */}
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
                            <span className="font-medium">{selectedCustomer.archived_at}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-amber-700">Last Activity:</span>
                            <span className="font-medium">{selectedCustomer.last_transaction_date || "No activity"}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Membership Status */}
                    <div>
                      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                        Membership Status
                      </h3>
                      <div className={`p-4 rounded-lg border ${
                        selectedCustomer.membership_status === 'None' 
                          ? 'bg-gray-50 border-gray-200'
                          : selectedCustomer.membership_status?.toLowerCase() === 'pro'
                            ? 'bg-purple-50 border-purple-200'
                            : selectedCustomer.membership_status?.toLowerCase() === 'basic'
                              ? 'bg-blue-50 border-blue-200'
                              : 'bg-amber-50 border-amber-200'
                      }`}>
                        <div className="flex justify-between items-center">
                          <span className={`font-medium ${
                            selectedCustomer.membership_status === 'None' 
                              ? 'text-gray-800'
                              : selectedCustomer.membership_status?.toLowerCase() === 'pro'
                                ? 'text-purple-800'
                                : selectedCustomer.membership_status?.toLowerCase() === 'basic'
                                  ? 'text-blue-800'
                                  : 'text-amber-800'
                          }`}>
                            {selectedCustomer.membership_status || 'Non-Member'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Restore Action */}
                    <div className="pt-4 border-t border-gray-200">
                      <motion.button
                        onClick={() => handleRestoreCustomer(selectedCustomer.id, selectedCustomer.name)}
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
                </div>
              </motion.div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}