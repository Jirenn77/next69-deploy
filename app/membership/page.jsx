"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Toaster, toast } from "sonner";
import { User, Settings, LogOut, Home, X } from "lucide-react";
import { Menu } from "@headlessui/react";
import {
  Users,
  FileText,
  CreditCard,
  Package,
  Layers,
  BarChart2,
  UserPlus,
  Pencil,
  Trash2,
} from "lucide-react";
import {
  ClipboardList,
  Factory,
  ShoppingBag,
  Folder,
  Tag,
  Plus,
  Search,
  Leaf,
  ChevronDown,
} from "lucide-react";
import { BarChart, BarChart3 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Memberships() {
  const router = useRouter();
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");
  const [memberships, setMemberships] = useState([]);
  const [isLoadingServices, setIsLoadingServices] = useState([]);
  const [includedServices, setIncludedServices] = useState([]);
  const [availablePremiumServices, setAvailablePremiumServices] = useState([]);
  const [editMembership, setEditMembership] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [selectedMembership, setSelectedMembership] = useState(null);
  const [membershipServices, setMembershipServices] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedServices, setSelectedServices] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showSummary, setShowSummary] = useState(false);
  const servicesPerPage = 12;
  const [allServices, setAllServices] = useState([]);
  const [newMembership, setNewMembership] = useState({
  name: "",
  type: "",
  description: "",
  discount: "",
  price: "",
  consumable_amount: "",
  no_expiration: 0,
  valid_until: "",
  status: "active",
});

  const calculateDiscountedPrice = (originalPrice) => {
    return originalPrice * 0.5; // 50% fixed discount for both types
  };

  const fetchMemberships = async () => {
  try {
    const res = await fetch("https://api.lizlyskincare.sbs/memberships.php");
    const data = await res.json();

    // If we get an error object instead of array, show the error
    if (data && data.error) {
      toast.error(`Server error: ${data.error}`);
      console.error("Server error:", data.error);
      setMemberships([]); // Set empty array to avoid crashes
      return;
    }

    if (Array.isArray(data)) {
      setMemberships(data);
    } else {
      toast.error("Invalid data format from server.");
      console.error("Expected array, got:", data);
      setMemberships([]); // Set empty array to avoid crashes
    }
  } catch (error) {
    toast.error("Failed to load memberships.");
    console.error("Fetch error:", error);
    setMemberships([]); // Set empty array to avoid crashes
  }
};

  useEffect(() => {
    fetchMemberships();
  }, []);

  const fetchMembershipServices = async (membershipId) => {
    try {
        console.log(`Fetching membership services for ID: ${membershipId}`);
        const res = await fetch(
            `https://api.lizlyskincare.sbs/servicegroup.php?action=membership_services&membership_id=${membershipId}`
        );
        
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const responseText = await res.text();
        console.log('Raw response:', responseText);
        
        // Try to parse JSON
        try {
            const data = JSON.parse(responseText);
            console.log('Parsed membership services:', data);
            return Array.isArray(data) ? data : [];
        } catch (parseError) {
            console.error('JSON parse error:', parseError);
            console.error('Problematic response:', responseText);
            return [];
        }
        
    } catch (error) {
        console.error('Error fetching membership services:', error);
        return [];
    }
};

  useEffect(() => {
    if (editMembership) {
      fetchMembershipServices(editMembership.id).then((services) => {
        setAllServices(services);

        const getServiceId = (s) => s.id ?? s.service_id;
        const included = editMembership.included_services || [];

        const preselected = services.filter((s) =>
          included.some((inc) => getServiceId(inc) === getServiceId(s))
        );

        setSelectedServices(preselected);
      });
    }
  }, [editMembership]);

// ✅ Use allServices here, not services
  const getServiceId = (s) => s.id ?? s.service_id;

  const preselected = allServices.filter((s) =>
    (editMembership?.included_services || []).some(
      (inc) => getServiceId(inc) === getServiceId(s)
    )
  );

  const handleSearch = () => {
    toast(`Searching for: ${searchQuery}`);
  };

  const handleAdd = async () => {
  // Validate required fields
  if (!newMembership.name.trim()) {
    toast.error("Name is required.");
    return;
  }

  if (!newMembership.type.trim()) {
    toast.error("Type is required.");
    return;
  }

  if (!newMembership.description.trim()) {
    toast.error("Description is required.");
    return;
  }

  if (!newMembership.price || newMembership.price <= 0) {
    toast.error("Please enter a valid price.");
    return;
  }

  if (!newMembership.consumable_amount || newMembership.consumable_amount <= 0) {
    toast.error("Please enter a valid consumable amount.");
    return;
  }

  if (!newMembership.no_expiration && !newMembership.valid_until) {
    toast.error("Please select a valid until date or check 'No Expiration'.");
    return;
  }

  // Prevent duplication of Basic and Pro memberships
  if (newMembership.type === "basic" || newMembership.type === "pro") {
    const existingMembership = memberships.find(
      membership => membership.type === newMembership.type && membership.status === "active"
    );
    
    if (existingMembership) {
      toast.error(`A ${newMembership.type} membership already exists. You can only have one active ${newMembership.type} membership at a time.`);
      return;
    }
  }

  try {
    const membershipToSend = {
      name: newMembership.name.trim(),
      type: newMembership.type.trim().toLowerCase(),
      description: newMembership.description.trim(),
      discount: newMembership.discount.trim() || "0",
      consumable_amount: Number(newMembership.consumable_amount),
      price: Number(newMembership.price),
      no_expiration: newMembership.no_expiration ? 1 : 0,
      valid_until: !newMembership.no_expiration ? newMembership.valid_until : null,
      status: newMembership.status || "active",
      duration: 12,
    };

    console.log("Sending membership data:", membershipToSend);

    const res = await fetch("https://api.lizlyskincare.sbs/memberships.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(membershipToSend),
    });

    const responseText = await res.text();
    console.log("Server response:", responseText);

    const data = JSON.parse(responseText);

    if (!res.ok || data.error) {
      throw new Error(data.message || data.error || "Failed to create membership");
    }

    // Add the new membership to the state
    setMemberships((prev) => [...prev, { ...data, type: membershipToSend.type }]);

    // Reset form
    setNewMembership({
      name: "",
      type: "",
      description: "",
      discount: "",
      price: "",
      consumable_amount: "",
      no_expiration: 0,
      valid_until: "",
      status: "active",
    });

    setIsModalOpen(false);
    toast.success("Membership created successfully!");
  } catch (error) {
    console.error("Add error:", error);
    toast.error(error.message || "Failed to create membership.");
  }
};

const handleEdit = async (id) => {
  const membershipToEdit = memberships.find((m) => m.id === id);
  if (!membershipToEdit) return;

  // Detect type from actual `membership_type` if available
  const type = membershipToEdit.type; // "basic", "pro", or "promo"

  let included_services = [];

  if (type === "basic" || type === "pro") {
    included_services = await fetchPremiumServices(type);
  } else {
    included_services = membershipToEdit.included_services || [];
  }

  setEditMembership({
    ...membershipToEdit,
    type, // keep as-is: "basic", "pro", "promo"
    included_services,
  });
};

  const handleSaveEdit = async () => {
  if (
    !editMembership.name ||
    !editMembership.type ||
    !editMembership.description
  ) {
    toast.error("All fields are required.");
    return;
  }

  // Prevent duplication of Basic and Pro memberships when editing
  if (editMembership.type === "basic" || editMembership.type === "pro") {
    const existingMembership = memberships.find(
      membership => 
        membership.type === editMembership.type && 
        membership.status === "active" &&
        membership.id !== editMembership.id // Exclude current membership being edited
    );
    
    if (existingMembership) {
      toast.error(`A ${editMembership.type} membership already exists. You can only have one active ${editMembership.type} membership at a time.`);
      return;
    }
  }

  try {
    const membershipToSend = {
      ...editMembership,
      included_services: selectedServices, // Send the full service objects
      discount:
        editMembership.type === "pro"
          ? "50"
          : editMembership.type === "basic"
            ? "30"
            : editMembership.discount || "0",
    };

    const res = await fetch(`https://api.lizlyskincare.sbs/memberships.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "update",
        membership_id: editMembership.id,
        ...membershipToSend,
      }),
    });

    const updated = await res.json();

    const updatedWithType = {
      ...updated,
      type: editMembership.type,
    };

    // Update the local state immediately
    setMemberships((prev) =>
      prev.map((m) => (m.id === updatedWithType.id ? updatedWithType : m))
    );

    // Update the services display if this is the currently selected membership
    if (selectedMembership?.id === updatedWithType.id) {
      setMembershipServices(selectedServices); // Use selectedServices instead of includedServices
    }

    setEditMembership(null);
    toast.success("Membership updated successfully.");

    // Auto-refresh the memberships list from server to ensure data consistency
    setTimeout(() => {
      fetchMemberships();
      toast.info("Membership list refreshed");
    }, 500);

  } catch (error) {
    console.error("Update error:", error);
    toast.error("Failed to update membership.");
  }
};

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    window.location.href = "/";
  };

  const handleRowClick = async (membership) => {
    setSelectedMembership(membership);
    setIsLoadingServices(true);

    try {
        console.log("Fetching services for membership:", membership.id);
        const services = await fetchMembershipServices(membership.id);
        
        if (services.length > 0) {
            console.log("Loaded services from membership_services:", services);
            setMembershipServices(services);
        } else {
            console.log("No services found, using fallback to premium services");
            // CORRECT FUNCTION NAME - remove the extra 's'
            const premiumServices = await fetchPremiumServices(membership.type);
            setMembershipServices(premiumServices);
        }
    } catch (error) {
        console.error("Error loading services:", error);
        toast.error("Failed to load services");
        setMembershipServices([]);
    } finally {
        setIsLoadingServices(false);
    }
};

  const closeMembershipDetails = () => {
    setSelectedMembership(null);
  };

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.2 } },
  };

  const slideUp = {
    hidden: { y: 50, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.3 } },
    exit: { y: 50, opacity: 0, transition: { duration: 0.2 } },
  };

  const scaleUp = {
    hidden: { scale: 0.95, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { duration: 0.3 } },
    exit: { scale: 0.95, opacity: 0, transition: { duration: 0.2 } },
  };

  const SummaryView = ({
    services,
    searchTerm,
    categoryFilter,
    membershipType,
  }) => {
    const filteredServices = services.filter((service) => {
      const name = service.name?.toLowerCase() || "";
      const description = service.description?.toLowerCase() || "";
      const category = service.category?.toLowerCase() || "";
      const search = searchTerm.toLowerCase();
      const filterCategory = categoryFilter.toLowerCase();

      const matchesSearch =
        name.includes(search) || description.includes(search);

      const matchesCategory =
        filterCategory === "" || category === filterCategory;

      return matchesSearch && matchesCategory;
    });

    const categories = Array.from(
      new Set(filteredServices.map((s) => s.category))
    );

    return (
      <div className="space-y-4">
        {categories.map((category) => {
          const categoryServices = filteredServices.filter(
            (s) => s.category?.toLowerCase() === category?.toLowerCase()
          );

          const categoryTotal = categoryServices.reduce(
            (sum, s) => sum + (s.originalPrice || 0),
            0
          );

          const categoryDiscountedTotal = categoryServices.reduce(
            (sum, s) => sum + (s.discountedPrice || 0),
            0
          );

          return (
            <div key={category} className="border-b pb-3">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">{category}</h4>
                <span className="text-sm text-gray-600">
                  {categoryServices.length} services
                </span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span className="text-gray-600">
                  Original: ₱
                  {Number(categoryTotal).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
                <span className="font-medium text-red-500">
                  50% off: ₱
                  {Number(categoryDiscountedTotal).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const DetailedView = ({
    services,
    searchTerm,
    categoryFilter,
    membershipType,
    currentPage,
    servicesPerPage,
    setCurrentPage,
  }) => {
    const filteredServices = services.filter((service) => {
      const matchesSearch =
        service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        categoryFilter === "" || service.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });

    const indexOfLastService = currentPage * servicesPerPage;
    const indexOfFirstService = indexOfLastService - servicesPerPage;
    const currentServices = filteredServices.slice(
      indexOfFirstService,
      indexOfLastService
    );
    const totalPages = Math.ceil(filteredServices.length / servicesPerPage);

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {currentServices.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              membershipType={membershipType}
            />
          ))}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center mt-4">
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index + 1)}
                className={`mx-1 px-3 py-1 rounded ${
                  currentPage === index + 1
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  const ServiceCard = ({ service, membershipType }) => {
    return (
      <motion.div
        className="border rounded-lg p-3 hover:shadow-md transition-shadow"
        whileHover={{ y: -2 }}
      >
        <div className="flex justify-between items-start">
                            <h4 className="font-medium text-sm">{service.name}</h4>
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                            {service.category}
                          </span>
        </div>
        <div className="mt-2 text-xs text-gray-600">
          <div>Duration: {service.duration}</div>
          <div className="flex justify-between mt-1">
            <span>
              Original: ₱
              {Number(service.originalPrice).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
            <span className="font-medium text-red-500">
              {service.discountPercentage} off: ₱
              {Number(service.discountedPrice).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 text-gray-800">
      <Toaster position="top-right" richColors />
      {/* Header */}
      <header className="flex items-center justify-between bg-emerald-800 text-white p-4 w-full h-16 pl-64 relative">
        <div className="flex items-center space-x-4">
          {/* Space for potential left-aligned elements */}
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

      {/* Enhanced Sidebar */}
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

          {/* Menu Items with Active State Highlight */}
          <div className="w-full px-4 space-y-1 overflow-y-auto flex-grow custom-scrollbar">
            {/* Dashboard */}
            <Menu as="div" className="relative w-full">
              <Link href="/home" passHref>
                <Menu.Button
                  as="div"
                  className={`w-full p-3 rounded-lg text-left flex items-center cursor-pointer transition-all ${router.pathname === "/home" ? "bg-emerald-600 shadow-md" : "hover:bg-emerald-600/70"}`}
                >
                  <div
                    className={`p-1.5 mr-3 rounded-lg ${router.pathname === "/home" ? "bg-white text-emerald-700" : "bg-emerald-900/30 text-white"}`}
                  >
                    <Home size={18} />
                  </div>
                  <span>Dashboard</span>
                  {router.pathname === "/home" && (
                    <motion.div
                      className="ml-auto w-2 h-2 bg-white rounded-full"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                    />
                  )}
                </Menu.Button>
              </Link>
            </Menu>

            {/* Services Dropdown - Enhanced */}
            <Menu as="div" className="relative w-full">
              {({ open }) => (
                <>
                  <Menu.Button
                    className={`w-full p-3 rounded-lg text-left flex items-center justify-between transition-all ${open ? "bg-emerald-600" : "hover:bg-emerald-600/70"}`}
                  >
                    <div className="flex items-center">
                      <div
                        className={`p-1.5 mr-3 rounded-lg ${open ? "bg-white text-emerald-700" : "bg-emerald-900/30 text-white"}`}
                      >
                        <Layers size={18} />
                      </div>
                      <span>Services</span>
                    </div>
                    <motion.div
                      animate={{ rotate: open ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-emerald-300"
                    >
                      <ChevronDown size={18} />
                    </motion.div>
                  </Menu.Button>

                  <AnimatePresence>
                    {open && (
                      <Menu.Items
                        as={motion.div}
                        static
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="mt-1 ml-3 w-full bg-emerald-700/90 text-white rounded-lg shadow-lg overflow-hidden"
                      >
                        {[
                          {
                            href: "/servicess",
                            label: "All Services",
                            icon: <Layers size={16} />,
                          },
                          {
                            href: "/membership",
                            label: "Memberships",
                            icon: <UserPlus size={16} />,
                            badge: 3,
                          },
                          {
                            href: "/membership-report",
                            label: "Membership Records",
                            icon: <BarChart3 size={16} />,
                          },
                          {
                            href: "/items",
                            label: "Beauty Deals",
                            icon: <Tag size={16} />,
                            badge: "New",
                          },
                          {
                            href: "/serviceorder",
                            label: "Service Acquire",
                            icon: <ClipboardList size={16} />,
                          },
                        ].map((link, index) => (
                          <Menu.Item key={link.href}>
                            {({ active }) => (
                              <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                              >
                                <Link
                                  href={link.href}
                                  className={`flex items-center justify-between space-x-3 p-3 ${active ? "bg-emerald-600" : ""} ${router.pathname === link.href ? "bg-emerald-600 font-medium" : ""}`}
                                >
                                  <div className="flex items-center">
                                    <span
                                      className={`mr-3 ${router.pathname === link.href ? "text-white" : "text-emerald-300"}`}
                                    >
                                      {link.icon}
                                    </span>
                                    <span>{link.label}</span>
                                  </div>
                                  {link.badge && (
                                    <span
                                      className={`text-xs px-2 py-0.5 rounded-full ${typeof link.badge === "number" ? "bg-amber-500" : "bg-emerald-500"}`}
                                    >
                                      {link.badge}
                                    </span>
                                  )}
                                </Link>
                              </motion.div>
                            )}
                          </Menu.Item>
                        ))}
                      </Menu.Items>
                    )}
                  </AnimatePresence>
                </>
              )}
            </Menu>

            {/* Sales Dropdown - Enhanced */}
            <Menu as="div" className="relative w-full">
              {({ open }) => (
                <>
                  <Menu.Button
                    className={`w-full p-3 rounded-lg text-left flex items-center justify-between transition-all ${open ? "bg-emerald-600" : "hover:bg-emerald-600/70"}`}
                  >
                    <div className="flex items-center">
                      <div
                        className={`p-1.5 mr-3 rounded-lg ${open ? "bg-white text-emerald-700" : "bg-emerald-900/30 text-white"}`}
                      >
                        <BarChart2 size={18} />
                      </div>
                      <span>Sales</span>
                    </div>
                    <motion.div
                      animate={{ rotate: open ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-emerald-300"
                    >
                      <ChevronDown size={18} />
                    </motion.div>
                  </Menu.Button>

                  <AnimatePresence>
                    {open && (
                      <Menu.Items
                        as={motion.div}
                        static
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="mt-1 ml-3 w-full bg-emerald-700/90 text-white rounded-lg shadow-lg overflow-hidden"
                      >
                        {[
                          {
                            href: "/customers",
                            label: "Customers",
                            icon: <Users size={16} />,
                          },
                          {
                            href: "/invoices",
                            label: "Invoices",
                            icon: <FileText size={16} />,
                          },
                        ].map((link, index) => (
                          <Menu.Item key={link.href}>
                            {({ active }) => (
                              <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                              >
                                <Link
                                  href={link.href}
                                  className={`flex items-center justify-between space-x-3 p-3 ${active ? "bg-emerald-600" : ""} ${router.pathname === link.href ? "bg-emerald-600 font-medium" : ""}`}
                                >
                                  <div className="flex items-center">
                                    <span
                                      className={`mr-3 ${router.pathname === link.href ? "text-white" : "text-emerald-300"}`}
                                    >
                                      {link.icon}
                                    </span>
                                    <span>{link.label}</span>
                                  </div>
                                  {link.count && (
                                    <span className="text-xs text-emerald-200">
                                      {link.count}
                                    </span>
                                  )}
                                </Link>
                              </motion.div>
                            )}
                          </Menu.Item>
                        ))}
                      </Menu.Items>
                    )}
                  </AnimatePresence>
                </>
              )}
            </Menu>
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
                <button className="text-emerald-300 hover:text-white transition-colors"
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

        {/* Main Content - Enhanced */}
        <main className="flex-1 p-8 ml-64 bg-gray-50 overflow-auto">
          <motion.div
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            {/* Header with search and actions */}
            <div className="px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl font-semibold text-gray-800">
                  Membership Programs
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  Manage your clinic's membership offerings
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <motion.button
                  onClick={() => setIsModalOpen(true)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg flex items-center justify-center gap-2 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Plus size={18} />
                  <span>New Membership</span>
                </motion.button>
              </div>
            </div>

            {/* Enhanced Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Membership
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Value
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Discount
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Description
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {Array.isArray(memberships) && memberships.length > 0 ? (
                    memberships.map((membership) => (
                      <motion.tr
                        key={membership.id}
                        className="hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleRowClick(membership)}
                        whileHover={{ backgroundColor: "#f8fafc" }}
                        transition={{ duration: 0.15 }}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            <div className="flex items-center gap-2">
                              {membership.name}
                              {membership.type === "promo" && (
                                <span className="px-1.5 py-0.5 text-xs font-medium bg-amber-200 text-amber-800 rounded-full">
                                  Membership Promo
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              ₱
                              {Number(membership.price).toLocaleString(
                                undefined,
                                {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                }
                              )}{" "}
                              for{" "}
                              {Number(
                                membership.consumable_amount
                              ).toLocaleString()}{" "}
                              consumable
                              {membership.type === "promo" &&
                                !membership.no_expiration &&
                                membership.valid_until && (
                                  <div className="text-xs mt-1">
                                    <span
                                      className={`px-1.5 py-0.5 rounded-full ${
                                        new Date(membership.valid_until) <
                                        new Date()
                                          ? "bg-red-100 text-red-800"
                                          : "bg-blue-100 text-blue-800"
                                      }`}
                                    >
                                      {new Date(membership.valid_until) <
                                      new Date()
                                        ? "Expired"
                                        : `Valid until ${new Date(membership.valid_until).toLocaleDateString()}`}
                                    </span>
                                  </div>
                                )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {Number(
                              membership.consumable_amount
                            ).toLocaleString()}{" "}
                            consumable
                            {membership.type === "basic" && (
                              <div className="text-xs text-gray-500 mt-1">
                                No expiration
                              </div>
                            )}
                            {membership.type === "pro" && (
                              <div className="text-xs text-gray-500 mt-1">
                                No expiration
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-emerald-600">
                            {membership.discount} off
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div
                            className="text-sm text-gray-500 line-clamp-2"
                            title={membership.description}
                          >
                            {membership.description}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-center space-x-3">
                            <motion.button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEdit(membership.id);
                              }}
                              className="text-gray-500 hover:text-emerald-600 p-1"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              title="Edit"
                            >
                              <Pencil className="w-4 h-4" />
                            </motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="5"
                        className="px-6 py-8 text-center text-gray-500"
                      >
                        <div className="flex flex-col items-center justify-center">
                          <Users className="w-12 h-12 text-gray-300 mb-4" />
                          <p className="text-lg font-medium text-gray-400">
                            No memberships found
                          </p>
                          <p className="text-sm mt-1">
                            Create your first membership program
                          </p>
                          <button
                            onClick={() => setIsModalOpen(true)}
                            className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                          >
                            Create Membership
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Add Membership Modal */}
<AnimatePresence>
  {isModalOpen && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-3xl shadow-lg">
        <h3 className="text-xl font-bold mb-6 text-gray-900">
          Add New Membership Type
        </h3>

        <div className="grid grid-cols-2 gap-4">
          {/* Left Column */}
          <div className="space-y-4">
            {/* Name - Auto-populated for basic/pro */}
            <div>
              <label className="block mb-1 font-medium">Name</label>
              <input
                type="text"
                value={newMembership.name || ""}
                onChange={(e) =>
                  setNewMembership({
                    ...newMembership,
                    name: e.target.value,
                  })
                }
                className="w-full p-2 border rounded"
                placeholder="e.g., Gold, Premium"
                disabled={newMembership.type === "basic" || newMembership.type === "pro"}
              />
              {(newMembership.type === "basic" || newMembership.type === "pro") && (
                <p className="text-xs text-gray-500 mt-1">
                  Name is auto-generated for this type
                </p>
              )}
            </div>

            {/* Type - Updated to Dropdown */}
            <div>
              <label className="block mb-1 font-medium">Type</label>
              <select
                value={newMembership.type || ""}
                onChange={(e) => {
                  const selectedType = e.target.value;
                  // Auto-set values based on type
                  const typeConfig = {
                    basic: {
                      name: "Basic Membership",
                      price: "3000",
                      consumable_amount: "5000",
                      discount: "50",
                      no_expiration: 1,
                      valid_until: ""
                    },
                    pro: {
                      name: "Pro Membership", 
                      price: "6000",
                      consumable_amount: "10000",
                      discount: "50",
                      no_expiration: 1,
                      valid_until: ""
                    },
                    promo: {
                      name: newMembership.name || "",
                      price: newMembership.price || "",
                      consumable_amount: newMembership.consumable_amount || "",
                      discount: newMembership.discount || "0",
                      no_expiration: 0,
                      valid_until: newMembership.valid_until || ""
                    }
                  };

                  const config = typeConfig[selectedType] || {};
                  
                  setNewMembership({
                    ...newMembership,
                    type: selectedType,
                    name: config.name || "",
                    price: config.price || "",
                    consumable_amount: config.consumable_amount || "",
                    discount: config.discount || "0",
                    no_expiration: config.no_expiration ?? 0,
                    valid_until: config.valid_until || ""
                  });
                }}
                className="w-full p-2 border rounded"
              >
                <option value="">Select Type</option>
                <option value="basic">Basic Membership</option>
                <option value="pro">Pro Membership</option>
                <option value="promo">Promo Membership</option>
              </select>
            </div>

            {/* Discount - Auto-populated based on type */}
            <div>
              <label className="block mb-1 font-medium">
                Discount (%)
              </label>
              <input
                type="number"
                value={newMembership.discount || ""}
                onChange={(e) =>
                  setNewMembership({
                    ...newMembership,
                    discount: e.target.value,
                  })
                }
                className="w-full p-2 border rounded"
                placeholder="e.g., 50"
                disabled={newMembership.type === "basic" || newMembership.type === "pro"}
              />
              {(newMembership.type === "basic" || newMembership.type === "pro") && (
                <p className="text-xs text-gray-500 mt-1">
                  50% discount applied automatically
                </p>
              )}
            </div>

            {/* Status */}
            <div>
              <label className="block mb-1 font-medium">Status</label>
              <select
                value={newMembership.status || "active"}
                onChange={(e) =>
                  setNewMembership({
                    ...newMembership,
                    status: e.target.value,
                  })
                }
                className="w-full p-2 border rounded"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            {/* Price - Auto-populated for basic/pro */}
            <div>
              <label className="block mb-1 font-medium">
                Price (₱)
              </label>
              <input
                type="number"
                step="0.01"
                value={newMembership.price || ""}
                onChange={(e) =>
                  setNewMembership({
                    ...newMembership,
                    price: e.target.value,
                  })
                }
                className="w-full p-2 border rounded"
                placeholder="Enter price"
                disabled={newMembership.type === "basic" || newMembership.type === "pro"}
              />
              {(newMembership.type === "basic" || newMembership.type === "pro") && (
                <p className="text-xs text-gray-500 mt-1">
                  {newMembership.type === "basic" ? "₱3,000.00" : "₱6,000.00"} (auto-set)
                </p>
              )}
            </div>

            {/* Consumable Amount - Auto-populated for basic/pro */}
            <div>
              <label className="block mb-1 font-medium">
                Consumable Amount (₱)
              </label>
              <input
                type="number"
                step="0.01"
                value={newMembership.consumable_amount || ""}
                onChange={(e) =>
                  setNewMembership({
                    ...newMembership,
                    consumable_amount: e.target.value,
                  })
                }
                className="w-full p-2 border rounded"
                placeholder="Enter consumable balance"
                disabled={newMembership.type === "basic" || newMembership.type === "pro"}
              />
              {(newMembership.type === "basic" || newMembership.type === "pro") && (
                <p className="text-xs text-gray-500 mt-1">
                  {newMembership.type === "basic" ? "₱5,000.00" : "₱10,000.00"} (auto-set)
                </p>
              )}
            </div>

            {/* No Expiration - Auto-checked for basic and pro */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={!!newMembership.no_expiration}
                onChange={(e) => {
                  // Only allow changing for promo memberships
                  if (newMembership.type !== "promo") return;
                  
                  setNewMembership({
                    ...newMembership,
                    no_expiration: e.target.checked ? 1 : 0,
                    valid_until: e.target.checked ? "" : newMembership.valid_until,
                  });
                }}
                disabled={newMembership.type === "basic" || newMembership.type === "pro"}
              />
              <label className={newMembership.type === "basic" || newMembership.type === "pro" ? "text-gray-400" : ""}>
                No Expiration
                {(newMembership.type === "basic" || newMembership.type === "pro") && (
                  <span className="text-xs text-gray-500 ml-1">(Auto-enabled)</span>
                )}
              </label>
            </div>

            {/* Valid Until - Only show for promo memberships without no_expiration */}
            {newMembership.type === "promo" && !newMembership.no_expiration && (
              <div>
                <label className="block mb-1 font-medium">
                  Valid Until
                </label>
                <input
                  type="date"
                  value={newMembership.valid_until || ""}
                  onChange={(e) =>
                    setNewMembership({
                      ...newMembership,
                      valid_until: e.target.value,
                    })
                  }
                  className="w-full p-2 border rounded"
                  min={new Date().toISOString().split('T')[0]} // Prevent past dates
                />
              </div>
            )}

            {/* Info message for basic/pro memberships */}
            {(newMembership.type === "basic" || newMembership.type === "pro") && (
              <div className="bg-blue-50 border border-blue-200 rounded p-3">
                <p className="text-sm text-blue-800">
                  <strong>{newMembership.type === "basic" ? "Basic" : "Pro"} Membership Package:</strong><br />
                  • Price: {newMembership.type === "basic" ? "₱3,000.00" : "₱6,000.00"}<br />
                  • Consumable: {newMembership.type === "basic" ? "₱5,000.00" : "₱10,000.00"}<br />
                  • 50% discount on all services<br />
                  • No expiration<br />
                  • Premium services included
                </p>
              </div>
            )}

            {/* Info message for promo memberships */}
            {newMembership.type === "promo" && (
              <div className="bg-amber-50 border border-amber-200 rounded p-3">
                <p className="text-sm text-amber-800">
                  <strong>Promo Membership:</strong><br />
                  • Custom pricing and consumable amount<br />
                  • Flexible discount percentage<br />
                  • Optional expiration date<br />
                  • Manual configuration required
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Description - full width below grid */}
        <div className="mt-4">
          <label className="block mb-1 font-medium">
            Description
          </label>
          <textarea
            value={newMembership.description || ""}
            onChange={(e) =>
              setNewMembership({
                ...newMembership,
                description: e.target.value,
              })
            }
            className="w-full p-2 border rounded"
            rows={3}
            placeholder={
              newMembership.type === "basic" ? "Basic membership with ₱5,000 consumable and 50% discount on services" :
              newMembership.type === "pro" ? "Pro membership with ₱10,000 consumable and 50% discount on services" :
              "Enter short description for promo membership"
            }
          />
          {(newMembership.type === "basic" || newMembership.type === "pro") && (
            <p className="text-xs text-gray-500 mt-1">
              Suggested description provided
            </p>
          )}
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-2 mt-6">
          <button
            onClick={() => {
              setIsModalOpen(false);
              // Reset form when closing
              setNewMembership({
                name: "",
                type: "",
                description: "",
                discount: "",
                price: "",
                consumable_amount: "",
                no_expiration: 0,
                valid_until: "",
                status: "active",
              });
            }}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleAdd}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
            disabled={!newMembership.type || !newMembership.description}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  )}
</AnimatePresence>

          {/* Edit Membership Modal */}
          <AnimatePresence>
            {editMembership && (
              <motion.div
                className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto hide-scrollbar"
                  variants={slideUp}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  {/* Modal Header */}
                  <div className="flex justify-between items-center mb-4 sticky top-0 bg-white py-2">
                    <h3 className="font-bold text-lg">Edit Membership</h3>
                    <button
                      onClick={() => setEditMembership(null)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X size={24} />
                    </button>
                  </div>

                  <div className="space-y-4">
                    {/* Membership Type */}
                    <div>
                      <label className="block font-medium mb-1">
                        Membership Type
                      </label>
                      <div className="px-3 py-2 border rounded-lg bg-gray-50">
                        {editMembership.type === "basic" && "Basic Membership"}
                        {editMembership.type === "pro" && "Pro Membership"}
                        {editMembership.type === "promo" && "Promo Membership"}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Membership type cannot be changed after creation
                      </p>
                    </div>

                    {/* Pricing Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Price */}
                      <div>
                        <label className="block font-medium mb-1">
                          Price (₱)
                        </label>
                        {editMembership.type === "promo" ? (
                          <input
                            type="number"
                            value={editMembership.price ?? ""}
                            onChange={(e) =>
                              setEditMembership({
                                ...editMembership,
                                price: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 border rounded-lg text-sm"
                          />
                        ) : (
                          <div className="px-3 py-2 bg-gray-100 rounded-lg text-sm">
                            ₱{editMembership.price}
                          </div>
                        )}
                      </div>

                      {/* Consumable Amount */}
                      <div>
                        <label className="block font-medium mb-1">
                          Consumable Amount
                        </label>
                        {editMembership.type === "promo" ? (
                          <input
                            type="number"
                            value={editMembership.consumable_amount ?? ""}
                            onChange={(e) =>
                              setEditMembership({
                                ...editMembership,
                                consumable_amount: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 border rounded-lg text-sm"
                          />
                        ) : (
                          <div className="px-3 py-2 bg-gray-100 rounded-lg text-sm">
                            {editMembership.consumable_amount}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Expiration Settings */}
                    <div className="space-y-2">
                      {!editMembership.no_expiration && (
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Valid Until
                          </label>
                          {editMembership.type === "promo" ? (
                            <input
                              type="date"
                              value={editMembership.valid_until ?? ""}
                              onChange={(e) =>
                                setEditMembership({
                                  ...editMembership,
                                  valid_until: e.target.value,
                                })
                              }
                              className="w-full px-3 py-2 border rounded-lg text-sm"
                            />
                          ) : (
                            <div className="px-3 py-2 bg-gray-100 rounded-lg text-sm">
                              {editMembership.valid_until || "N/A"}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block font-medium mb-1">
                        Description
                      </label>
                      <textarea
                        value={editMembership.description ?? ""}
                        onChange={(e) =>
                          setEditMembership({
                            ...editMembership,
                            description: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                        rows={2}
                      />
                    </div>

                    {/* Included Services */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="block font-medium">
                          Included Services
                        </label>
                        <button
                          onClick={() => setSelectedServices(allServices)}
                          className="text-xs text-blue-500 hover:underline"
                        >
                          Select All
                        </button>
                      </div>

                      {/* Search bar */}
                      <input
                        type="text"
                        placeholder="Search services..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-3 py-2 mb-2 border rounded-lg text-sm"
                      />

                      {/* Services Selection List */}
                      <div className="max-h-[150px] overflow-y-auto border rounded-lg p-2 bg-gray-50">
                        {allServices
                          .filter(
                            (service) =>
                              service.name
                                .toLowerCase()
                                .includes(searchTerm.toLowerCase()) ||
                              service.category
                                .toLowerCase()
                                .includes(searchTerm.toLowerCase())
                          )
                          .map((service) => (
                            <label
                              key={service.id}
                              className="flex items-center space-x-2 p-1 text-sm hover:bg-gray-100 rounded"
                            >
                              <input
                                type="checkbox"
                                checked={selectedServices.some(
                                  (s) => s.id === service.id
                                )}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedServices((prev) => [
                                      ...prev,
                                      service,
                                    ]);
                                  } else {
                                    setSelectedServices((prev) =>
                                      prev.filter((s) => s.id !== service.id)
                                    );
                                  }
                                }}
                              />
                              <span className="truncate">
                                {service.name}{" "}
                                <span className="text-gray-500">
                                  ({service.category})
                                </span>
                              </span>
                            </label>
                          ))}

                        {allServices.filter(
                          (service) =>
                            service.name
                              .toLowerCase()
                              .includes(searchTerm.toLowerCase()) ||
                            service.category
                              .toLowerCase()
                              .includes(searchTerm.toLowerCase())
                        ).length === 0 && (
                          <div className="text-center py-2 text-gray-500 text-sm">
                            No matching services found
                          </div>
                        )}
                      </div>

                      {/* Display Selected Services with Remove Button */}
                      {selectedServices.length > 0 && (
                        <div className="mt-4">
                          <h4 className="text-sm font-medium mb-2">
                            Selected Services:
                          </h4>
                          <div className="flex flex-col gap-1 max-h-[150px] overflow-y-auto border rounded-lg p-2 bg-white">
                            {selectedServices.map((service) => (
                              <div
                                key={service.id}
                                className="flex justify-between items-center px-2 py-1 rounded hover:bg-gray-50 text-sm"
                              >
                                <div>
                                  {service.name}{" "}
                                  <span className="text-gray-400">
                                    ({service.category})
                                  </span>
                                </div>
                                <button
                                  onClick={() =>
                                    setSelectedServices((prev) =>
                                      prev.filter((s) => s.id !== service.id)
                                    )
                                  }
                                  className="text-red-500 hover:underline text-xs"
                                >
                                  Remove
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Status */}
                    <div>
                      <label className="block font-medium mb-1">Status</label>
                      <select
                        value={editMembership.status ?? "active"}
                        onChange={(e) =>
                          setEditMembership({
                            ...editMembership,
                            status: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-3 pt-2">
                      <button
                        onClick={() => setEditMembership(null)}
                        className="px-4 py-2 bg-gray-400 hover:bg-gray-500 rounded-lg text-sm"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveEdit}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm"
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

            {/* Membership Details Modal */}
            <AnimatePresence>
              {selectedMembership && (
                <motion.div
                  className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <motion.div
                    className="bg-white rounded-lg shadow-lg p-6 w-full max-w-4xl max-h-[90vh] flex flex-col"
                    variants={scaleUp}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    {/* Header */}
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h2 className="text-xl font-bold">
                          {selectedMembership.name} Membership
                        </h2>
                        <p className="text-sm text-gray-600">
                          Discount: {selectedMembership.discount} | Status:
                          <span
                            className={`ml-2 px-2 py-1 rounded-full text-xs ${
                              selectedMembership.status === "active"
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-200 text-gray-800"
                            }`}
                          >
                            {selectedMembership.status}
                          </span>
                        </p>
                      </div>
                      <motion.button
                        onClick={closeMembershipDetails}
                        className="text-gray-500 hover:text-gray-700"
                        whileHover={{ rotate: 90 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <X size={24} />
                      </motion.button>
                    </div>

                    {/* Main Content */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 overflow-hidden">
                      {/* Membership Info Sidebar */}
<div className="space-y-6">
  <div className="bg-gray-50 p-4 rounded-lg">
    <h3 className="font-bold mb-3 text-lg">Membership Details</h3>
    <div className="space-y-3 text-sm">
      <div>
        <span className="font-semibold block text-gray-700">Description:</span>
        <span className="text-gray-600">{selectedMembership.description}</span>
      </div>
      
      <div>
        <span className="font-semibold block text-gray-700">Value:</span>
        <span className="text-gray-600">
          {Number(selectedMembership.consumable_amount).toLocaleString()} consumable for ₱
          {Number(selectedMembership.price).toLocaleString()}
        </span>
      </div>
      
      <div>
        <span className="font-semibold block text-gray-700">Discount:</span>
        <span className="text-gray-600">{selectedMembership.discount} on all services</span>
      </div>
      
      {/* Date Information Section */}
      <div className="border-t pt-3 mt-3">
        <span className="font-semibold block text-gray-700 mb-2">Date Information:</span>
        
        <div className="space-y-2 pl-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Registered:</span>
            <span className="font-medium">
              {selectedMembership.date_registered 
                ? new Date(selectedMembership.date_registered).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })
                : "Not available"}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">Expires:</span>
            <span className={`font-medium ${
              selectedMembership.valid_until && 
              new Date(selectedMembership.valid_until) < new Date() 
                ? 'text-red-600' 
                : 'text-green-600'
            }`}>
              {selectedMembership.valid_until 
                ? new Date(selectedMembership.valid_until).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })
                : "No expiration"}
            </span>
          </div>
          
          {/* Optional: Show days remaining for expired memberships */}
          {selectedMembership.valid_until && (
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Status:</span>
              <span className={
                new Date(selectedMembership.valid_until) < new Date() 
                  ? 'text-red-500 font-medium' 
                  : 'text-green-500'
              }>
                {new Date(selectedMembership.valid_until) < new Date() 
                  ? 'Expired' 
                  : 'Active'}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>

                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h3 className="font-bold mb-3 text-lg">Quick Stats</h3>
                          <div className="space-y-2 text-sm">
                            <p>
                              <span className="font-semibold">
                                Total Services:
                              </span>{" "}
                              {membershipServices.length}
                            </p>
                            <p>
                              <span className="font-semibold">Categories:</span>{" "}
                              {
                                Array.from(
                                  new Set(
                                    membershipServices.map((s) => s.category)
                                  )
                                ).length
                              }
                            </p>
                            <p>
                              <span className="font-semibold">Avg. Price:</span> ₱
                              {(
                                membershipServices.reduce(
                                  (sum, s) =>
                                    sum +
                                    parseFloat(
                                      s.price.replace("₱", "").replace(/,/g, "")
                                    ),
                                  0
                                ) / membershipServices.length || 0
                              ).toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Services Main Panel */}
                      <div className="md:col-span-2 flex flex-col overflow-hidden">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="font-bold text-lg">
                            Included Services{" "}
                            <span className="text-sm font-normal">
                              ({membershipServices.length})
                            </span>
                          </h3>
                          <div className="flex gap-2">
                            <button
                              onClick={() => setShowSummary(!showSummary)}
                              className="text-sm text-green-600 hover:underline"
                              disabled={membershipServices.length === 0}
                            >
                              {showSummary ? "Show Details" : "Show Summary"}
                            </button>
                          </div>
                        </div>

                        {/* Filter Controls */}
                        <div className="mb-4 flex flex-wrap gap-2">
                          <input
                            type="text"
                            placeholder="Search services..."
                            className="px-3 py-1 border rounded-md text-sm flex-1 min-w-[200px]"
                            onChange={(e) => setSearchTerm(e.target.value)}
                            value={searchTerm}
                            disabled={membershipServices.length === 0}
                          />
                          <select
                            className="px-3 py-1 border rounded-md text-sm"
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            value={categoryFilter}
                            disabled={membershipServices.length === 0}
                          >
                            <option value="">All Categories</option>
                            {Array.from(
                              new Set(membershipServices.map((s) => s.category))
                            ).map((category) => (
                              <option key={category} value={category}>
                                {category}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Services Display */}
                        <div className="flex-1 overflow-auto">
                          {isLoadingServices ? (
                            <div className="flex justify-center items-center h-full">
                              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
                            </div>
                          ) : membershipServices.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-gray-500">
                              <Package className="w-12 h-12 mb-4" />
                              <p>No services included in this membership</p>
                              <p className="text-sm mt-1">
                                Premium services will appear here
                              </p>
                            </div>
                          ) : showSummary ? (
                            <SummaryView
                              services={membershipServices}
                              searchTerm={searchTerm}
                              categoryFilter={categoryFilter}
                              membershipType={selectedMembership?.type || "basic"}
                            />
                          ) : (
                            <DetailedView
                              services={membershipServices}
                              searchTerm={searchTerm}
                              categoryFilter={categoryFilter}
                              membershipType={selectedMembership?.type || "basic"}
                              currentPage={currentPage}
                              servicesPerPage={servicesPerPage}
                              setCurrentPage={setCurrentPage}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
