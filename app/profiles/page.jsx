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

  X,

  Edit,

  Save,

  Leaf,

  ChevronDown,

  ChevronsLeft,
  Building2,
  MapPin
} from "lucide-react";


const API_BASE = "https://api.lizlyskincare.sbs";


export default function ViewProfile() {

    const router = useRouter();

  const pathname = usePathname();

    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const [isEditing, setIsEditing] = useState(false);

    const [currentUser, setCurrentUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [formData, setFormData] = useState({

        name: "",
        username: "",
        email: "",
        phone: "",
        branch: "",
        branch_id: "",
        created_at: "",
        status: "Active",

        role: "",
    });

    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                setIsLoading(true);
                
                // Try to get from localStorage first
                const userData = localStorage.getItem("user");
                if (userData) {
                    try {
                        const user = JSON.parse(userData);
                        setCurrentUser(user);
                        console.log("User from localStorage:", user);
                        
                        // Populate form with user data
                        setFormData({
                            name: user.name || "",
                            username: user.username || "",
                            email: user.email || "",
                            phone: user.contact || user.phone || "",
                            branch: user.branch_name || user.branch || "",
                            branch_id: user.branch_id || "",
                            created_at: user.created_at || "",
                            status: user.status || "Active",
                            role: user.role || "",
                        });
                    } catch (error) {
                        console.error("Error parsing user data from localStorage:", error);
                    }
                }

                // Also fetch from API to get complete user data
                const currentUserResponse = await fetch(
                    `${API_BASE}/branches.php?action=user`,
                    {
                        credentials: "include",
                    }
                );

                if (currentUserResponse.ok) {
                    const currentUserData = await currentUserResponse.json();
                    console.log("Current User Data from API:", currentUserData);

                    // Update current user with API data
                    setCurrentUser(currentUserData);

                    // Update form with fresh data from API
                    setFormData({
                        name: currentUserData.name || "",
                        username: currentUserData.username || "",
                        email: currentUserData.email || "",
                        phone: currentUserData.contact || currentUserData.phone || "",
                        branch: currentUserData.branch_name || currentUserData.branch || "",
                        branch_id: currentUserData.branch_id || "",
                        created_at: currentUserData.created_at || "",
                        status: currentUserData.status || "Active",
                        role: currentUserData.role || "",
                    });

                    // Also update localStorage
                    localStorage.setItem("user", JSON.stringify(currentUserData));
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
                toast.error("Failed to load user profile");
            } finally {
                setIsLoading(false);
            }
        };

        fetchCurrentUser();
    }, []);

    const handleLogout = async () => {
        try {
            // Clear PHP sessions
            await Promise.allSettled([
                fetch(`${API_BASE}/admin.php?action=logout`, {
                    method: "POST",
                    credentials: "include"
                }),
                fetch(`${API_BASE}/users.php?action=logout`, {
                    method: "POST",
                    credentials: "include"
                })
            ]);
        } catch (error) {
            console.error("Logout API error:", error);
        } finally {
            // Clear ALL localStorage data
            localStorage.removeItem("user");
            localStorage.removeItem("user_id");
            localStorage.removeItem("user_name");
            localStorage.removeItem("role");
            localStorage.removeItem("branch_id");
            localStorage.removeItem("branch_name");
            localStorage.removeItem("loginAttempts");
        localStorage.removeItem("authToken");


            // Clear sessionStorage
            sessionStorage.clear();

            // Clear authentication cookies
            document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
            document.cookie = 'isAuthenticated=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';

            // Redirect to login page
            window.location.replace("/");
        }
    };



    const handleEditClick = () => {

        setIsEditing(true);

    };



    const handleSaveClick = async () => {
        try {
            if (!currentUser || !currentUser.user_id) {
                toast.error("User ID not found");
                return;
            }

            // Prepare payload
            const payload = {
                name: formData.name,
                username: formData.username,
                email: formData.email,
                contact: formData.phone,
                status: formData.status,
            };

            // Send update to API
            const response = await fetch(
                `${API_BASE}/users.php?action=update&id=${currentUser.user_id}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                }
            );

            const result = await response.json();

            if (result.success || response.ok) {
        setIsEditing(false);

        toast.success("Profile updated successfully!");

                
                // Update currentUser with new data
                const updatedUser = {
                    ...currentUser,
                    ...payload
                };
                setCurrentUser(updatedUser);
                localStorage.setItem("user", JSON.stringify(updatedUser));
            } else {
                toast.error(result.message || "Failed to update profile");
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            toast.error("Failed to update profile");
        }
    };



    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData(prev => ({

            ...prev,

            [name]: value

        }));

    };


    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading profile...</p>
                </div>
            </div>
        );
    }


    return (

        <div className="flex flex-col h-screen bg-[#77DD77] text-gray-900">

            <Toaster />

            {/* Header */}

      <header className="flex items-center justify-between bg-emerald-700 text-white p-4 w-full h-16 pl-64 relative">

        <div className="flex items-center space-x-4">

          {/* Space for potential left-aligned elements */}

        </div>



        <div className="flex items-center space-x-4 relative">

          <div

            className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center text-lg font-bold cursor-pointer hover:bg-amber-600 transition-colors"

            onClick={() => setIsProfileOpen(!isProfileOpen)}

          >

            {formData.name ? formData.name.charAt(0).toUpperCase() : "U"}
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

        <div className={`w-full p-3 rounded-lg text-left flex items-center cursor-pointer transition-all ${router.pathname === '/home' ? 'bg-emerald-600 shadow-md' : 'hover:bg-emerald-600/70'}`}>

          <div className={`p-1.5 mr-3 rounded-lg ${router.pathname === '/home' ? 'bg-white text-emerald-700' : 'bg-emerald-900/30 text-white'}`}>

            <Home size={18} />

          </div>

          <span>Dashboard</span>

          {router.pathname === '/home' && (

            <motion.div 

              className="ml-auto w-2 h-2 bg-white rounded-full"

              initial={{ scale: 0 }}

              animate={{ scale: 1 }}

            />

          )}

        </div>

      </Link>



      <Link href="/profiles" passHref>

        <div className={`w-full p-3 rounded-lg text-left flex items-center cursor-pointer transition-all ${router.pathname === '/profiles' ? 'bg-emerald-600 shadow-md' : 'hover:bg-emerald-600/70'}`}>

          <div className={`p-1.5 mr-3 rounded-lg ${router.pathname === '/profiles' ? 'bg-white text-emerald-700' : 'bg-emerald-900/30 text-white'}`}>

            <User size={18} />

          </div>

          <span>Profiles</span>

          {router.pathname === '/profiles' && (

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

              <p className="text-sm font-medium">{formData.name || "User"}</p>
              <p className="text-xs text-emerald-300">
                {formData.role === "admin" ? "Administrator" : formData.role === "receptionist" ? "Receptionist" : "User"}
              </p>
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

                <main className="flex-1 p-6 bg-gray-50 ml-64">

                    {/* Header Section */}

                    <motion.div

                        initial={{ opacity: 0, y: -20 }}

                        animate={{ opacity: 1, y: 0 }}

                        transition={{ duration: 0.3 }}

                        className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6"

                    >

                        <div>

                            <h1 className="text-2xl font-bold text-gray-800">

                                User Profile

                            </h1>

                            <p className="text-sm text-gray-600 mt-1">
                                Manage your account information and preferences
                            </p>
                        </div>

                    </motion.div>



                    {/* Profile Content */}

                    <motion.div

                        initial={{ opacity: 0 }}

                        animate={{ opacity: 1 }}

                        transition={{ delay: 0.1 }}

                        className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"

                    >

                        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">



                            {/* Profile Details */}

                            <div className="md:col-span-2 space-y-4">

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                    <div>

                                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                        {isEditing ? (

                                            <input

                                                type="text"

                                                name="name"

                                                value={formData.name}

                                                onChange={handleChange}

                                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"

                                            />

                                        ) : (

                                            <div className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg">

                                                {formData.name}

                                            </div>

                                        )}

                                    </div>

                                    <div>

                                        <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                                        {isEditing ? (

                                            <input

                                                type="text"

                                                name="username"
                                                value={formData.username}
                                                onChange={handleChange}

                                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"

                                            />

                                        ) : (

                                            <div className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg">

                                                {formData.username}
                                            </div>

                                        )}

                                    </div>

                                </div>



                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                    <div>

                                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>

                                        {isEditing ? (

                                            <div className="relative">

                                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />

                                                <input

                                                    type="email"

                                                    name="email"

                                                    value={formData.email}

                                                    onChange={handleChange}

                                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"

                                                />

                                            </div>

                                        ) : (

                                            <div className="flex items-center w-full p-3 bg-gray-50 border border-gray-200 rounded-lg">

                                                <Mail className="mr-2 text-gray-400" size={16} />

                                                {formData.email}

                                            </div>

                                        )}

                                    </div>

                                    <div>

                                        <label className="block text-sm font-medium text-gray-700 mb-1">Contact</label>
                                        {isEditing ? (

                                            <div className="relative">

                                                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />

                                                <input

                                                    type="text"

                                                    name="phone"

                                                    value={formData.phone}

                                                    onChange={handleChange}

                                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"

                                                />

                                            </div>

                                        ) : (

                                            <div className="flex items-center w-full p-3 bg-gray-50 border border-gray-200 rounded-lg">

                                                <Phone className="mr-2 text-gray-400" size={16} />

                                                {formData.phone}

                                            </div>

                                        )}

                                    </div>

                                </div>



                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                    <div>

                                        <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
                                        <div className="flex items-center w-full p-3 bg-gray-50 border border-gray-200 rounded-lg">
                                            <span className="truncate">{formData.branch || "N/A"}</span>
                                    </div>
                                </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Created At</label>
                                            <div className="flex items-center w-full p-3 bg-gray-50 border border-gray-200 rounded-lg">

                                                <Calendar className="mr-2 text-gray-400" size={16} />

                                            {formData.created_at || "N/A"}
                                    </div>
                                            </div>

                                    </div>


                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>

                                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>

                                        {isEditing ? (

                                            <select

                                                name="status"

                                                value={formData.status}

                                                onChange={handleChange}

                                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"

                                            >

                                                <option value="Active">Active</option>

                                                <option value="Inactive">Inactive</option>

                                            </select>

                                        ) : (

                                            <div className={`w-full p-3 border rounded-lg ${

                                                formData.status === "Active" 

                                                    ? "bg-green-50 border-green-200 text-green-800" 

                                                    : "bg-red-50 border-red-200 text-red-800"
                                            }`}>

                                                {formData.status}

                                            </div>

                                        )}

                                </div>

                                <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                                        <div className="flex items-center w-full p-3 bg-gray-50 border border-gray-200 rounded-lg">
                                            <Shield className="mr-2 text-gray-400" size={16} />
                                            {formData.role === "admin" ? "Administrator" : formData.role === "receptionist" ? "Receptionist" : "User"}
                                </div>

                                        </div>

                                </div>

                            </div>

                        </div>

                    </motion.div>

                </main>

            </div>

        </div>

    );
}