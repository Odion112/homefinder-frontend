import { Routes, Route, Navigate } from "react-router-dom";

import Home from "./Home";
import SignIn from "./SignIn";
import SignUp from "./SignUp";

import Properties from "./Properties";
import PropertyDetails from "./PropertyDetails";

import OwnerSetup from "./listing/OwnerSetup";
import ListProperty from "./listing/ListProperty";
import ExistingOwnerList from "./listing/ExistingOwnerList";
import MyListingDetails from "./listing/MyListingDetails";
import EditListing from "./listing/EditListing";


import { useContext, useEffect } from "react";
import { TokenContext } from "../context/TokenContext";
import { ProfileDispatchContext } from "../context/ProfileContext"
import { getProfile } from "../utils/fn";
import MyListings from "./listing/MyListings";
import { useGetProfile } from "../hooks/useGetProfile";

export default function Navigation() {
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

      {/* List-a-property flow — reachable by tenants (onboarding step 2)
          and owners (their normal entry point) */}
      {(profile?.role === "tenant" || profile?.role === "owner") && (
        <>
          <Route path="/owner-setup" element={<OwnerSetup />} />
          <Route path="/list-property" element={<ListProperty />} />
        </>
      )}

      {/* Owner-only */}
      {(profile?.role === "owner") && (
        <>
          <Route path="/existing-owner-list" element={<ExistingOwnerList />} />
          <Route path="/my-listings" element={<MyListings />} />
           <Route path="/my-listings/:id" element={<MyListingDetails />} />
           <Route path="/edit-listing/:id" element={<EditListing />} />
        </>
      )
      }

      {/* Redirect unknown routes */}
      <Route path="*" element={<Navigate to="/" replace />} />

    </Routes>

  );
}