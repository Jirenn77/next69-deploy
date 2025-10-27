"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Toaster, toast } from "sonner";
import {
  Leaf,
  Lock,
  Eye,
  EyeOff,
  User,
  AlertTriangle,
  AlertCircle,
} from "lucide-react";
import "./globals.css";

export default function Login() {
  const [identifier, setIdentifier] = useState(""); // This will handle both email and username
  const [password, setPassword] = useState("");
  const [branches, setBranches] = useState([]);
  const [selectedBranchId, setSelectedBranchId] = useState("");
  const [captcha, setCaptcha] = useState("");
  const [captchaQuestion, setCaptchaQuestion] = useState("");
  const [correctCaptchaAnswer, setCorrectCaptchaAnswer] = useState(0);
  const [error, setError] = useState("");
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [capsLockOn, setCapsLockOn] = useState(false);
  const [isCapsLockChecked, setIsCapsLockChecked] = useState(false);
  const MAX_ATTEMPTS = 5;
  const router = useRouter();
  const API_BASE =
    process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.lizlyskincare.sbs";

  const passwordRef = useRef(null);
  const identifierRef = useRef(null);

  // Helper function to set authentication cookie
  const setAuthCookie = (userData) => {
    document.cookie = `auth-token=${JSON.stringify(userData)}; path=/; SameSite=Lax`;
    document.cookie = `isAuthenticated=true; path=/; SameSite=Lax`;
  };

  // Helper function to clear authentication cookie
  const clearAuthCookie = () => {
    document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    document.cookie = 'isAuthenticated=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  };

  useEffect(() => {
    generateCaptcha();
    fetchBranches();

    // Add global keydown listener for caps lock detection
    const handleKeyDown = (e) => {
      if (e.getModifierState && e.getModifierState("CapsLock")) {
        setCapsLockOn(true);
        setIsCapsLockChecked(true);
      }
    };

    const handleKeyUp = (e) => {
      if (e.getModifierState && !e.getModifierState("CapsLock")) {
        setCapsLockOn(false);
        setIsCapsLockChecked(true);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  const generateCaptcha = () => {
    let num1 = Math.floor(Math.random() * 10);
    let num2 = Math.floor(Math.random() * 10);
    setCorrectCaptchaAnswer(num1 + num2);
    setCaptchaQuestion(`${num1} + ${num2} = ?`);
  };

  const fetchBranches = async () => {
    try {
      const res = await fetch(`${API_BASE}/branches.php`);
      if (!res.ok) throw new Error("Failed to load branches");
      const data = await res.json();
      setBranches(data || []);
    } catch (e) {
      // Keep silent in UI; login can still work for admin
    }
  };

  // Enhanced caps lock detection for specific inputs
  const handleKeyPress = (e) => {
    if (e.getModifierState && e.getModifierState("CapsLock")) {
      setCapsLockOn(true);
      setIsCapsLockChecked(true);
    } else {
      setCapsLockOn(false);
      setIsCapsLockChecked(true);
    }
  };

  const handleCapsLockCheck = (e) => {
    if (e.getModifierState && e.getModifierState("CapsLock")) {
      setCapsLockOn(true);
      setIsCapsLockChecked(true);
    }
  };

  // SIMPLIFIED VALIDATION - Only basic checks, let backend handle the rest
  const sanitizeInput = (input) => {
    // Only remove truly dangerous characters, not all special characters
    return input.replace(/[<>'";(){}]/g, "").trim();
  };

  const isValidEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validateIdentifier = (identifier) => {
    if (!identifier.trim()) {
      return {
        isValid: false,
        message: "Please enter your email or username.",
      };
    }

    // Allow any input - let backend determine if it's valid
    return { isValid: true };
  };

  const validatePassword = (password) => {
    if (!password.trim()) {
      return { isValid: false, message: "Please enter your password." };
    }

    // Only block truly dangerous characters
    const dangerousChars = /[<>'";(){}]/;
    if (dangerousChars.test(password)) {
      return {
        isValid: false,
        message: "Password contains invalid characters.",
      };
    }

    return { isValid: true };
  };

  useEffect(() => {
    // Check if user is already logged in and redirect immediately
    const checkAuthAndRedirect = () => {
      const userData = localStorage.getItem("user");
      if (userData) {
        try {
          const user = JSON.parse(userData);
          // Redirect based on role
          if (user.role === 'admin') {
            window.location.replace("/home");
          } else if (user.role === 'receptionist') {
            window.location.replace("/home2");
          }
        } catch (error) {
          console.error("Error parsing user data:", error);
        }
      }
    };

    checkAuthAndRedirect();

    // Listen for focus events (when user comes back to the tab)
    const handleFocus = () => {
      checkAuthAndRedirect();
    };
    window.addEventListener('focus', handleFocus);

    // Prevent back button from navigating to login page
    const handlePopState = () => {
      const userData = localStorage.getItem("user");
      if (userData) {
        window.history.forward();
      }
    };
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [router]);

  const handleSubmit = async (e) => {
  e.preventDefault();

  // Clear ALL previous data first - INCLUDING PHP SESSIONS AND COOKIES
  localStorage.removeItem("user");
  localStorage.removeItem("user_id");
  localStorage.removeItem("user_name");
  localStorage.removeItem("role");
  localStorage.removeItem("branch_id");
  localStorage.removeItem("branch_name");
  localStorage.removeItem("loginAttempts");
  sessionStorage.clear();
  clearAuthCookie(); // Clear authentication cookies

  // Clear PHP session by calling logout on BOTH endpoints before login
  try {
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
    console.log("PHP sessions cleared successfully");
  } catch (error) {
    console.log("Session clear completed (some endpoints may have failed)");
  }

  if (loginAttempts >= MAX_ATTEMPTS) {
    toast.error("Too many failed attempts. Please try again later.");
    return;
  }

  let sanitizedIdentifier = sanitizeInput(identifier);
  if (!sanitizedIdentifier) {
    toast.error("Please enter your email or username.");
    return;
  }

  if (!password.trim()) {
    toast.error("Please enter your password.");
    return;
  }

  if (parseInt(captcha) !== correctCaptchaAnswer) {
    toast.error("Incorrect CAPTCHA answer. Try again.");
    generateCaptcha();
    return;
  }

  if (capsLockOn && isCapsLockChecked) {
    toast.warning("Caps Lock is ON. Check your capitalization.", {
      duration: 3000,
    });
  }

  let isAdminLoginSuccessful = false;
  let adminLoginError = null;

  try {
    // Admin login - only email for admin
    let res = await axios.post(
      `${API_BASE}/admin.php?action=login`,
      new URLSearchParams({ 
        email: sanitizedIdentifier,
        password: password 
      }),
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        withCredentials: true,
      }
    );

    console.log("Admin login response:", res.data);

    // Check if admin login was successful
    if (res.data && (res.data.role === "admin" || res.data.admin_id)) {
      toast.success("Admin login successful!");
      isAdminLoginSuccessful = true;
      
      const adminUserData = {
        id: res.data.admin_id || res.data.id,
        admin_id: res.data.admin_id || res.data.id,
        name: 'Admin',
        email: res.data.email,
        role: 'admin',
        branch: 'Pabayo Gomez Street',
        branch_id: 1,
        branch_name: 'Pabayo Gomez Street',
        username: res.data.username || res.data.email,
        status: 'Active'
      };
      
      localStorage.setItem("user", JSON.stringify(adminUserData));
      localStorage.setItem("loginAttempts", "0");
      setAuthCookie(adminUserData); // Set authentication cookie
      
      console.log("Admin login - stored user data:", adminUserData);
      
      // Use window.location.replace to completely remove login page from history
      window.location.replace("/home");
      return;
    } else {
      // Admin login returned success but no admin data
      console.log("Admin login returned unexpected response:", res.data);
      adminLoginError = "Invalid admin credentials.";
    }
  } catch (adminError) {
    console.log("Admin login error:", adminError.response?.data || adminError.message);
    adminLoginError = adminError.response?.data || adminError.message;
    
    // Check if it's an authentication error
    if (adminError.response && adminError.response.data) {
      const errorData = adminError.response.data;
      
      // If there's an explicit error message from server
      if (errorData.error) {
        adminLoginError = errorData.error;
        console.log("Admin login specific error:", adminLoginError);
      }
    }
  }

  // After admin login attempt, decide what to do next
  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(sanitizedIdentifier);
  
  // If it's an email and admin login failed, check if we should show admin error or try receptionist
  if (isEmail && !isAdminLoginSuccessful) {
    // Check if the error indicates the email doesn't exist as admin
    const adminErrorStr = JSON.stringify(adminLoginError).toLowerCase();
    const shouldTryReceptionist = adminErrorStr.includes('invalid email or password') || 
                                 adminErrorStr.includes('not found') ||
                                 adminErrorStr.includes('no admin');
    
    if (shouldTryReceptionist) {
      console.log("Email not found in admin table, trying receptionist login...");
      // Continue to receptionist login
    } else {
      // Show the admin error and stop
      toast.error(adminLoginError?.error || adminLoginError || "Invalid admin credentials.");
      setLoginAttempts((prev) => {
        const newAttempts = prev + 1;
        localStorage.setItem("loginAttempts", newAttempts);
        return newAttempts;
      });
      return;
    }
  }

  // If we reach here, we need to try receptionist login
  // RECEPTIONIST LOGIN - Check if branch is selected first
  if (!selectedBranchId) {
    // If it's an email that failed admin login, show appropriate error
    if (isEmail && !isAdminLoginSuccessful) {
      toast.error("Invalid email or password. Please check your credentials.");
    } else {
      toast.error("Please select a branch to login as receptionist.");
    }
    
    setLoginAttempts((prev) => {
      const newAttempts = prev + 1;
      localStorage.setItem("loginAttempts", newAttempts);
      return newAttempts;
    });
    return;
  }

  try {
    // Receptionist login - try with identifier (could be email or username)
    const res = await axios.post(
      `${API_BASE}/users.php?action=login`,
      { 
        identifier: sanitizedIdentifier, 
        password, 
        branch_id: selectedBranchId 
      },
      { withCredentials: true }
    );

    if (res.data.success) {
      toast.success("Receptionist login successful!");
      
      try {
        const branch = branches.find((b) => String(b.id) === String(selectedBranchId));
        if (branch) {
          localStorage.setItem("branch_id", String(branch.id));
          localStorage.setItem("branch_name", branch.name);
        } else {
          localStorage.setItem("branch_id", String(selectedBranchId));
        }
        
        const userData = res.data?.user || res.data;
        const receptionistUserData = {
          id: userData.user_id || userData.id,
          name: userData.name,
          username: userData.username,
          email: userData.email,
          role: 'receptionist',
          branch: userData.branch || branch?.name,
          branch_id: userData.branch_id || selectedBranchId,
          branch_name: userData.branch_name || branch?.name,
          status: userData.status || 'Active'
        };
        
      localStorage.setItem("user", JSON.stringify(receptionistUserData));
      localStorage.setItem("loginAttempts", "0");
      setAuthCookie(receptionistUserData); // Set authentication cookie
      console.log("Receptionist login - stored user data:", receptionistUserData);
        
      } catch (_) {}
      
      // Use window.location.replace to completely remove login page from history
      window.location.replace("/home2");
    } else {
      if (res.data.code === 'BRANCH_MISMATCH') {
        toast.error("User not assigned to this branch. Please select the correct branch.");
      } else {
        toast.error("Invalid email/username or password. Please check your credentials.");
      }
      
      setLoginAttempts((prev) => {
        const newAttempts = prev + 1;
        localStorage.setItem("loginAttempts", newAttempts);
        return newAttempts;
      });
    }
  } catch (err) {
    if (err.response && err.response.data) {
      const errorData = err.response.data;
      if (errorData.code === 'BRANCH_MISMATCH') {
        toast.error("User not assigned to this branch. Please select the correct branch.");
      } else {
        toast.error("Invalid email/username or password. Please check your credentials.");
      }
    } else {
      toast.error("An error occurred. Please try again.");
    }
    
    setLoginAttempts((prev) => {
      const newAttempts = prev + 1;
      localStorage.setItem("loginAttempts", newAttempts);
      return newAttempts;
    });
  }
};

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-lime-500 via-lime-600 to-lime-700 p-6">
      <Toaster position="top-center" richColors />

      {/* Card Layout */}
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl flex w-full max-w-5xl overflow-hidden">
        {/* Left Section */}
        <div className="flex flex-col justify-center items-start flex-1 p-12 text-white">
          <div className="p-3 bg-lime-100 rounded-xl mb-6">
            <Leaf className="text-lime-700" size={35} />
          </div>
          <h1 className="text-4xl font-extrabold mb-4">
            Welcome to <br></br> Lizly Skin Care Clinic
          </h1>
          <p className="text-sm text-lime-100 mb-6 max-w-sm">
            Please sign in to continue accessing the Lizly Skin Care Clinic
            system.
          </p>

          {/* Security Notice */}
          <div className="bg-yellow-500/20 border border-yellow-400/30 rounded-lg p-3 mt-4">
            <div className="flex items-start">
              <AlertCircle
                className="text-yellow-300 mt-0.5 mr-2 flex-shrink-0"
                size={16}
              />
              <div className="text-xs text-yellow-100">
                <p className="font-semibold">Security Notice:</p>
                <p>• Email addresses are case-sensitive</p>
                <p>• Usernames are case-sensitive</p>
                <p>• Passwords are case-sensitive</p>
                <p>• Check Caps Lock before entering credentials</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - Sign In Form */}
        <div className="flex-1 bg-emerald/10 backdrop-blur-lg p-10">
          <h2 className="text-2xl font-bold text-center text-white mb-8">
            Sign In
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white mb-1">
                Branch (required for receptionist)
              </label>
              <select
                value={selectedBranchId}
                onChange={(e) => setSelectedBranchId(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg bg-white/20 border border-white/30 focus:ring-2 focus:ring-lime-400 focus:border-lime-400 text-white"
              >
                <option value="" className="text-black">
                  Select a branch
                </option>
                {branches.map((b) => (
                  <option key={b.id} value={b.id} className="text-black">
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="identifier"
                className="block text-sm font-medium text-white mb-1"
              >
                Email or Username
              </label>
              <div className="relative">
                <User
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300"
                  size={16}
                />
                <input
                  ref={identifierRef}
                  type="text"
                  id="identifier"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  onKeyPress={handleKeyPress}
                  onKeyUp={handleCapsLockCheck}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white/20 border border-white/30 focus:ring-2 focus:ring-lime-400 focus:border-lime-400 placeholder-white/70 text-white"
                  placeholder="your@email.com or username"
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-white mb-1"
              >
                Password
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300"
                  size={16}
                />
                <input
                  ref={passwordRef}
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={handleKeyPress}
                  onKeyUp={handleCapsLockCheck}
                  className="w-full pl-10 pr-10 py-2.5 rounded-lg bg-white/20 border border-white/30 
                 focus:ring-2 focus:ring-lime-400 focus:border-lime-400 
                 placeholder-white/70 text-white"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <div className="flex justify-between items-center mt-1">
                {capsLockOn && isCapsLockChecked && (
                  <div className="flex items-center text-xs text-yellow-300 bg-yellow-500/20 px-2 py-1 rounded">
                    <AlertTriangle size={12} className="mr-1" />
                    Caps Lock is ON
                  </div>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="captcha"
                className="block text-sm font-medium text-white mb-1"
              >
                {captchaQuestion}
              </label>
              <input
                type="text"
                id="captcha"
                value={captcha}
                onChange={(e) => setCaptcha(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg bg-white/20 border border-white/30 focus:ring-2 focus:ring-lime-400 focus:border-lime-400 placeholder-white/70 text-white"
                placeholder="Enter the answer"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-green-500 to-lime-500 hover:opacity-70 text-white font-medium rounded-lg transition shadow-lg"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
