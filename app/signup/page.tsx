"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    contact: "",
    address: "",
    adminCode: "", // Secret code for admin signup
  });
  const [isAdminSignup, setIsAdminSignup] = useState(false);
  const [adminSignupAvailable, setAdminSignupAvailable] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Check if admin signup is available
  useEffect(() => {
    const checkAdminExists = async () => {
      try {
        const response = await fetch("/api/auth/check-admin");
        const data = await response.json();
        setAdminSignupAvailable(!data.adminExists);
      } catch (err) {
        // If check fails, assume admin signup is available
        console.error("Error checking admin:", err);
      }
    };
    checkAdminExists();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!formData.name || !formData.email || !formData.password) {
      setError("Name, email, and password are required");
      return;
    }

    if (!isAdminSignup && (!formData.contact || !formData.address)) {
      setError("Contact and address are required for customer signup");
      return;
    }

    if (isAdminSignup && !formData.adminCode) {
      setError("Admin signup code is required");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          contact: formData.contact || "",
          address: formData.address || "",
          adminCode: isAdminSignup ? formData.adminCode : undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to create account");
        setLoading(false);
        return;
      }

      // Success - redirect based on role
      if (data.user?.role === "ADMIN") {
        // Admin signup - redirect to admin dashboard
        router.push("/admin");
      } else {
        // Customer signup - redirect to login
        router.push("/login?registered=true");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md animate-fade-in">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sign up to start shopping for furniture
          </p>
          {adminSignupAvailable && (
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => setIsAdminSignup(!isAdminSignup)}
                className="text-xs text-indigo-600 hover:text-indigo-500 underline"
              >
                {isAdminSignup ? "Sign up as Customer" : "Sign up as Admin (One-time only)"}
              </button>
            </div>
          )}
          {!adminSignupAvailable && isAdminSignup && (
            <div className="mt-4 bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded text-sm">
              Admin account already exists. Admin signup is disabled.
            </div>
          )}
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          <div className="space-y-4">
            <Input
              label="Full Name"
              type="text"
              required
              placeholder="Enter your full name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <Input
              label="Email"
              type="email"
              required
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <Input
              label="Password"
              type="password"
              required
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
            <Input
              label="Confirm Password"
              type="password"
              required
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
            />
            {!isAdminSignup && (
              <>
                <Input
                  label="Contact Number"
                  type="tel"
                  required
                  placeholder="Enter your phone number"
                  value={formData.contact}
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    required
                    placeholder="Enter your full address"
                    rows={3}
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>
              </>
            )}
            {isAdminSignup && (
              <Input
                label="Admin Signup Code"
                type="password"
                required
                placeholder="Enter admin signup code"
                value={formData.adminCode}
                onChange={(e) => setFormData({ ...formData, adminCode: e.target.value })}
              />
            )}
          </div>

          <div>
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Sign Up"}
            </Button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
