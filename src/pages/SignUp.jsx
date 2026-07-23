import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { PiEyeLight, PiEyeSlashLight } from "react-icons/pi";
import Logo from "../assets/images/logo-white.svg";
import HeroImage from "../assets/images/hero-image.svg";
import RoleSelectModal from "../components/RoleSelectModal";
import InputField from "../components/Input";
import Button from "../components/Button";
import { signIn, signUp } from "../utils/fn";
import { TokenDispatchContext } from "../context/TokenContext";


export default function SignUpPage() {

  const tokenDispatch = useContext(TokenDispatchContext)
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  // ...rest of state unchanged...

  async function updateRole(selectedRole) {
    try {
      setIsLoading(true)
      const res = await fetch("https://homefinder-backend-hxp6.onrender.com/auth/update", {
        method: "PATCH",
        body: JSON.stringify({ role: selectedRole }),
        headers: {
          "Content-type": "application/json",
          "Authorization": `Bearer ${authToken}`
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

      // Keep the profile cache in sync with the newly-set role
      queryClient.setQueryData(['profile'], (old) => ({
        ...old,
        ...responseData,
        role: selectedRole,
      }))
      // If your GET /profile endpoint is more authoritative than the PATCH response, use this instead:
      // await queryClient.invalidateQueries({ queryKey: ['profile'] })

      setShowRoleModal(false)
      alert("Account created successfully")
      navigate("/")

    } catch (error) {
      console.log(error)
      setGlobalError(error?.data?.message || "Could not set your role. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // ...rest unchanged...
}