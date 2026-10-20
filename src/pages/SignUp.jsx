// pages/SignUp.jsx
import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { PiEyeLight, PiEyeSlashLight } from "react-icons/pi";
import Logo from "../assets/images/logo-white.svg";
import HeroImage from "../assets/images/hero-image.svg";
import RoleSelectModal from "../components/RoleSelectModal";
import { signUp } from "../utils/fn";
import { TokenDispatchContext } from "../context/TokenContext";

const API_URL = "https://homefinder-backend-hxp6.onrender.com";

export default function SignUpPage() {
  const tokenDispatch = useContext(TokenDispatchContext);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [authToken, setAuthToken] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [globalError, setGlobalError] = useState("");
  const [errors, setErrors] = useState({});

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setGlobalError("");
  }

  function validate() {
    const newErrors = {};
    if (!form.firstName.trim()) newErrors.firstName = "First name is required";
    if (!form.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) newErrors.email = "Enter a valid email";
    if (form.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  // Step 1: create the account
  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    try {
      setIsLoading(true);
      setGlobalError("");

      const data = await signUp(form);

      const token = data?.token;
      if (!token) throw new Error("No token returned from server");

      sessionStorage.setItem("token", token);
      if (typeof tokenDispatch === "function") tokenDispatch(token);
      setAuthToken(token);

      // Step 2: ask for the role
      setShowRoleModal(true);
    } catch (error) {
      console.log(error);
      setGlobalError(
        error?.data?.message || "Could not create your account. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  }

  // Step 2: save the chosen role
  async function updateRole(selectedRole) {
    try {
      setIsLoading(true);
      const res = await fetch(`${API_URL}/auth/update`, {
        method: "PATCH",
        body: JSON.stringify({ role: selectedRole }),
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!res.ok) {
        const error = new Error("Request failed");
        error.statusCode = res.status;
        error.data = await res.json().catch(() => null);
        throw error;
      }

      await queryClient.invalidateQueries({ queryKey: ["profile"] });

      setShowRoleModal(false);
      // Full reload so Navigation re-reads the token and profile
      window.location.assign("/");
    } catch (error) {
      console.log(error);
      setGlobalError(
        error?.data?.message || "Could not set your role. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  }

  const inputClass =
    "w-full h-[48px] px-4 border border-[#C6C6C6] rounded-xs text-[15px] font-rethink text-[#0E0D0C] focus:outline-none focus:border-accent";

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-[#FDFDFD]">
      {/* LEFT: image panel */}
      <div className="relative hidden lg:block">
        <img
          src={HeroImage}
          alt="Modern house"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative z-10 p-[60px]">
          <Link to="/">
            <img src={Logo} alt="HomeFinder Logo" className="w-[180px]" />
          </Link>
        </div>
      </div>

      {/* RIGHT: form */}
      <div className="flex items-center justify-center px-5 sm:px-10 py-12">
        <form onSubmit={handleSubmit} className="w-full max-w-[440px]" noValidate>
          <h1 className="font-neue text-[28px] sm:text-[34px] text-[#0E0D0C]">
            Create your account
          </h1>
          <p className="mt-2 font-rethink text-[15px] text-[#696262]">
            Find an apartment without the middleman.
          </p>

          <div className="mt-8 flex flex-col gap-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <input
                  name="firstName"
                  placeholder="First name"
                  value={form.firstName}
                  onChange={handleChange}
                  className={inputClass}
                />
                {errors.firstName && (
                  <p className="mt-1 text-[13px] text-red-600">{errors.firstName}</p>
                )}
              </div>
              <div>
                <input
                  name="lastName"
                  placeholder="Last name"
                  value={form.lastName}
                  onChange={handleChange}
                  className={inputClass}
                />
                {errors.lastName && (
                  <p className="mt-1 text-[13px] text-red-600">{errors.lastName}</p>
                )}
              </div>
            </div>

            <div>
              <input
                name="email"
                type="email"
                placeholder="Email address"
                value={form.email}
                onChange={handleChange}
                className={inputClass}
              />
              {errors.email && (
                <p className="mt-1 text-[13px] text-red-600">{errors.email}</p>
              )}
            </div>

            <div>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                  className={`${inputClass} pr-12`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#696262] cursor-pointer"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <PiEyeSlashLight size={20} /> : <PiEyeLight size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-[13px] text-red-600">{errors.password}</p>
              )}
            </div>
          </div>

          {globalError && (
            <p className="mt-4 text-[14px] text-red-600 font-rethink">{globalError}</p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="mt-6 w-full h-[48px] bg-accent text-surface rounded-xs text-[16px] font-rethink cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? "Please wait..." : "Sign up"}
          </button>

          <p className="mt-6 text-center font-rethink text-[15px] text-[#696262]">
            Already have an account?{" "}
            <Link to="/sign-in" className="text-accent font-medium">
              Sign in
            </Link>
          </p>
        </form>
      </div>

      {/* Role selection step */}
      {showRoleModal && (
        <RoleSelectModal
          isOpen={showRoleModal}
          onSelect={updateRole}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}