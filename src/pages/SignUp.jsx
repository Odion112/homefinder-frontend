import { useState, forwardRef, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PiEyeLight, PiEyeSlashLight } from "react-icons/pi";
import Logo from "../assets/images/logo-white.svg";
import HeroImage from "../assets/images/hero-image.svg";
import RoleSelectModal from "../components/RoleSelectModal";
import InputField from "../components/Input";
import Button from "../components/Button";
import { signIn, signUp } from "../utils/fn";
import { TokenContext, TokenDispatchContext } from "../context/TokenContext";


export default function SignUpPage() {

  let currentToken = useContext(TokenContext)
  const tokenDispatch = useContext(TokenDispatchContext)

  const navigate = useNavigate()

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: ""
  })

  const [role, setRole] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      setIsLoading(true)
      const createData = await signUp(data)

      if (createData) {
        setShowRoleModal(true)
        const token = await signIn({ email: data.email, password: data.password })
        tokenDispatch({
          type: "loggedIn",
          payload: token
        })
        sessionStorage.setItem("token", token)
        currentToken = { token }
      }

    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  async function updateRole(data) {
    try {
      setIsLoading(true)
      const res = await fetch("https://homefinder-backend-hxp6.onrender.com/auth/update", {
        method: "PATCH",
        body: JSON.stringify({ role: data }),
        headers: {
          "Content-type": "application/json",
          "Authorization": `Bearer ${currentToken.token}`
        }
      })

      if (!res.ok) {
        const error = new Error("Request failed");
        error.statusCode = res.status;
        error.data = await res.json().catch(() => null);

        throw error;
      }

      const responseData = await res.json()
      console.log(responseData)
      setIsLoading(false)
      navigate("/")

    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  function getRole(role) {
    setRole(role)
  }

  const [isLoading, setIsLoading] = useState(false)
  const [showPwd, setShowPwd] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [globalError, setGlobalError] = useState("");

  // ── ADD: controls whether the role modal is open or closed
  const [showRoleModal, setShowRoleModal] = useState(false);

  return (
    // ── ADD: wrap everything in a fragment so the modal can sit alongside the page
    <>
      <div className="flex min-h-screen w-full font-neue">

        {/* LEFTSIDE */}
        <div className="relative w-[52%] shrink-0">

          {/* Hero image */}
          <img
            src={HeroImage}
            alt="Modern home exterior"
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/40" />

          {/* Logo */}
          <div className="absolute top-8 left-10 z-10">
            <img
              src={Logo}
              alt="HomeFinder"
              className="h-4 object-contain"
            />
          </div>

          {/* Tagline */}
          <div className="absolute bottom-12 left-10 right-10 z-10">
            <h2 className="text-white font-neue font-medium text-3xl leading-tight mb-3">
              Simplify Your House-hunting Process
            </h2>
            <p className="text-white/75 text-base font-neue leading-relaxed">
              Making your house-hunting journey easy in just few clicks - ast, easy, reliable.
            </p>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex-1 flex items-center justify-center bg-white px-16">
          <div className="w-full max-w-120">

            {/* Global error */}
            {globalError && (
              <p className="text-sm text-[#EA0000] mb-5">{globalError}</p>
            )}

            {/* Heading */}
            <h1 className="text-[32px] font-medium font-neue text-[#0E0D0C] leading-tight mb-2">
              Create your account
            </h1>
            <p className="text-base text-[#6B6B6B] mb-10">
              Sign in to your account.
            </p>

            {/* Form fields */}
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-6">

              {/* Full name */}
              <div className="flex gap-6">
                <InputField
                  label="First Name"
                  placeholder="Enter your first name"
                  type="text"
                  required
                  value={data.firstName}
                  onChange={(e) => setData({ ...data, firstName: e.target.value })}
                />
                <InputField
                  label="Last name"
                  placeholder="Enter your last name"
                  type="text"
                  value={data.lastName}
                  onChange={(e) => setData({ ...data, lastName: e.target.value })}
                />
              </div>

              {/* Email */}
              <InputField
                label="Email"
                placeholder="Enter your email address"
                type="email"
                value={data.email}
                onChange={(e) => setData({ ...data, email: e.target.value })}
              />

              {/* Phone number */}
              <InputField
                label="Phone number"
                placeholder="Enter your phone number"
                type="tel"
                value={data.phoneNumber}
                onChange={(e) => setData({ ...data, phoneNumber: e.target.value })}
              />

              {/* Password */}
              <InputField
                label="Password"
                placeholder="Enter your password"
                type={showPwd ? "text" : "password"}
                value={data.password}
                onChange={(e) => setData({ ...data, password: e.target.value })}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPwd((v) => !v)}
                    className="text-[#A5A1A1] hover:text-[#555] transition-colors cursor-pointer"
                    tabIndex={-1}
                  >
                    {showPwd
                      ? <PiEyeLight size={20} />
                      : <PiEyeSlashLight size={20} />
                    }
                  </button>
                }
              />

              {/* Button */}
              <Button
                variant="filled"
                className="!w-full !h-12 mt-1"
                loading={isLoading}

              >
                Create account
              </Button>
            </form>

            {/* Sign in link */}
            <p className="text-center text-sm text-[#6B6B6B] mt-6">
              Have any account?{" "}
              <Link to="/sign-in" className="text-[#0E0D0C] font-semibold hover:text-[#FE7C0B] transition-colors">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* ── ADD: Role modal mounts here, on top of the page */}
      <RoleSelectModal
        isOpen={showRoleModal}
        onClose={() => setShowRoleModal(false)}
        getRole={getRole}
        onClick={() => updateRole(role)}
        loading={isLoading}
      />
    </>
  );
}