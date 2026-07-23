import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PiEyeLight, PiEyeSlashLight } from "react-icons/pi";
import Logo from "../assets/images/logo-white.svg";
import HeroImage from "../assets/images/hero-image.svg";
import InputField from "../components/Input";
import Button from "../components/Button";
import { signIn } from "../utils/fn";
import { TokenDispatchContext } from "../context/TokenContext";


export default function SignInPage() {

  const tokenDispatch = useContext(TokenDispatchContext)
  const navigate = useNavigate()

  const [data, setData] = useState({
    email: "",
    password: ""
  })

  const [isLoading, setIsLoading] = useState(false)
  const [showPwd, setShowPwd] = useState(false);
  const [errorType, setErrorType] = useState(null); // null | "wrong-password" | "no-account" | "unknown"

  const emailError = errorType === "no-account" ? "No account found with this email." : "";
  const passwordError = errorType === "wrong-password" ? "Incorrect email or password. Please try again." : "";
  const globalError = errorType === "unknown" ? "Something went wrong. Please try again."
    : errorType === "wrong-password" ? "Incorrect email or password. Please try again."
    : errorType === "no-account" ? "No account found with this email."
      : "";

  async function handleLogin(e) {
    e.preventDefault()
    setErrorType(null)
    try {
      setIsLoading(true)

      const response = await signIn(data)
      if (response) {
        tokenDispatch({
          type: "loggedIn",
          payload: response
        })
        sessionStorage.setItem("token", response)
        navigate("/properties")
      }
    } catch (error) {
      console.log(error)

      const status = error?.statusCode
      const message = error?.data?.message?.toLowerCase() || ""

      if (status === 404 || message.includes("no account") || message.includes("not found")) {
        setErrorType("no-account")
      } else if (status === 400 || status === 401 || message.includes("password") || message.includes("incorrect")) {
        setErrorType("wrong-password")
      } else {
        setErrorType("unknown")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen w-full font-neue">

      {/* LEFT SIDE*/}
      <div className="relative hidden lg:block w-[52%] shrink-0">

        <img
          src={HeroImage}
          alt="Modern home exterior"
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/40" />

        <div className="absolute top-8 left-10 z-10">
          <img
            src={Logo}
            alt="HomeFinder"
            className="h-4 object-contain"
          />
        </div>

        <div className="absolute bottom-12 left-10 right-10 z-10">
          <h2 className="text-white font-neue font-medium text-3xl leading-tight mb-3">
            Simplify Your House-hunting Process
          </h2>
          <p className="text-white/75 text-base font-neue leading-relaxed">
            Making your house-hunting journey easy in just few clicks - ast, easy, reliable.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE*/}
      <div className="flex-1 flex items-center justify-center bg-white px-5 sm:px-8 lg:px-16 py-12">
        <div className="w-full max-w-[480px]">

          <h1 className="text-[28px] sm:text-[32px] font-neue font-medium text-[#0E0D0C] leading-tight mb-2">
            Welcome to HomeFinder
          </h1>
          <p className="text-base text-[#6B6B6B] mb-10">
            Login to your account.
          </p>

          <form onSubmit={handleLogin} className="flex flex-col gap-6">

            <InputField
              label="Email"
              placeholder="Enter your email"
              type="email"
              value={data.email}
              onChange={(e) => setData({ ...data, email: e.target.value })}
              error={emailError}
            />

            <InputField
              label="Password"
              placeholder="Enter your password"
              type={showPwd ? "text" : "password"}
              value={data.password}
              onChange={(e) => setData({ ...data, password: e.target.value })}
              error={passwordError}
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

            <Button
              variant="filled"
              loading={isLoading}
              className="!w-full !h-12 mt-1"
            >
              Login
            </Button>
          </form>

          <p className="text-center text-sm text-[#6B6B6B] mt-6">
            Don't have any account?{" "}
            <Link to="/sign-up" className="text-[#0E0D0C] font-semibold hover:text-[#FE7C0B] transition-colors">
              Create an account
            </Link>
          </p>
        </div>
      </div>

    </div>
  );
}