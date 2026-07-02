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


export default function Navigation() {

  const tokenPayload = useContext(TokenContext)
  const profileDispatch = useContext(ProfileDispatchContext)

  useEffect(() => {
    async function call() {
      try {
        if (tokenPayload?.token) {
          const profile = await getProfile(tokenPayload.token)
          profileDispatch({
            type: "set",
            payload: profile
          })
        }
      } catch (error) {
        console.log(error)
      }
    }

    call()

  }, [tokenPayload])

  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<Home />} />
      <Route path="/properties" element={<Properties />} />
      <Route path="/property-details" element={<PropertyDetails />} />

      {/* Auth */}
      <Route path="/sign-in" element={<SignIn />} />
      <Route path="/sign-up" element={<SignUp />} />

      {/* Listing Flow */}
      {(!!tokenPayload?.token) && (
        <>
          <Route path="/list-property" element={<ListProperty />} />
          <Route path="/owner-setup" element={<OwnerSetup />} />
          <Route path="/existing-owner-list" element={<ExistingOwnerList />} />
        </>
      )
      }

      {/* Redirect unknown routes */}
      <Route path="*" element={<Navigate to="/" replace />} />

    </Routes>

  );
}