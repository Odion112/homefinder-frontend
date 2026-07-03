import { Routes, Route, Navigate } from "react-router-dom";

import Home from "./Home";
import SignIn from "./SignIn";
import SignUp from "./SignUp";

import Properties from "./Properties";
import PropertyDetails from "./PropertyDetails";

import OwnerSetup from "./listing/OwnerSetup";
import ListProperty from "./listing/ListProperty";
import ExistingOwnerList from "./listing/ExistingOwnerList";
import { useContext, useEffect } from "react";
import { TokenContext } from "../context/TokenContext";
import { ProfileDispatchContext } from "../context/ProfileContext"
import { getProfile } from "../utils/fn";
import MyListings from "./listing/MyListings";
import { useGetProfile } from "../hooks/useGetProfile";

export default function Navigation() {
  // Safely read token from sessionStorage — it may be a raw string (JWT)
  // or JSON. Avoid throwing when value is not valid 

  const value = sessionStorage.getItem("token")
  console.log(value)
  const tokenPayload = useContext(TokenContext)
  const profileDispatch = useContext(ProfileDispatchContext)

  const { data, isLoading } = useGetProfile(value)

  if (isLoading) {
    return <div>Loading...</div>
  }

  const profile = data


  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<Home />} />
      <Route path="/properties" element={<Properties />} />
      <Route path="/properties/:id" element={<PropertyDetails />} />

      {/* Auth */}
      <Route path="/sign-in" element={<SignIn />} />
      <Route path="/sign-up" element={<SignUp />} />

      {/* Listing Flow */}
      {(profile?.role === "owner") && (
        <>
          <Route path="/list-property" element={<ListProperty />} />
          <Route path="/owner-setup" element={<OwnerSetup />} />
          <Route path="/my-listings" element={<MyListings />} />
        </>
      )
      }

      {/* Redirect unknown routes */}
      <Route path="*" element={<Navigate to="/" replace />} />

    </Routes>

  );
}