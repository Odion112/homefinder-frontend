import logo from "../assets/images/logo.svg";
import avatar from "../assets/images/avatar.svg";
import { Link, NavLink } from "react-router-dom";
import { useState, useRef, useEffect, useContext } from "react";
import { LuMenu, LuX } from "react-icons/lu";
import AccountDropdown from "./AccountDropdown";
import ProfileModal from "./ProfileModal";
import { ProfileContext } from "../context/ProfileContext";

function Navbar() {

  const profilePayload = useContext(ProfileContext) || {}
  const profile = profilePayload.profile || null

  const role = profile?.role || 'guest'
  const initials = profile ? `${profile.firstName?.[0] || ""}${profile.lastName?.[0] || ""}` : ""

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const avatarRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (avatarRef.current && !avatarRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function isCurrentPage(path) {
    return location.pathname === path;
  }


  function getListPropertyRoute() {
    if (role === "guest") return "/sign-in";

    if (role === "tenant") return "/owner-setup";

    if (role === "owner") return "/existing-owner-list";

    return "/";
  }

  return (
    <>
      <nav className="h-[76px] lg:h-[102px] px-5 sm:px-8 lg:px-[60px] border-b border-[#C6C6C64A] bg-[#FDFDFD] relative z-40">
        <div className="h-full flex items-center justify-between">

          {/* LOGO */}
          <Link to="/" onClick={() => setMobileMenuOpen(false)}>
            <img src={logo} alt="HomeFinder Logo" className="w-[150px] sm:w-[170px] lg:w-[190px]" />
          </Link>

          {/* CENTER NAV LINKS */}
          <div className="h-full flex items-center gap-14">
            <NavLink to="/properties"
              className={({ isActive }) => `h-full flex items-center text-[18px] font-rethink font-regular
                  ${isActive ? "border-b-[3px] border-accent font-medium" : ""}
                `}>
              Properties
            </NavLink>

            {role === "owner" && (
              <NavLink to="/my-listings"
                className={({ isActive }) => `h-full flex items-center text-[18px] font-rethink font-regular
                  ${isActive ? "border-b-[3px] border-accent font-medium" : ""}
                `}>
                My Listings
              </NavLink>
            )}
          </div>

          {/* RIGHT SIDE */}
          <div className="hidden lg:flex items-center gap-8">

            {(role === "guest") && (
              <Link to="/sign-in" className="text-[18px] font-rethink font-regular">
                Sign in
              </Link>
            )}

            {(role === "tenant" || role === "owner") && (
              <div className="relative" ref={avatarRef}>
                <button
                  onClick={() => setDropdownOpen((prev) => !prev)}
                  onMouseEnter={() => setDropdownOpen(true)}
                  className="focus:outline-none cursor-pointer"
                >
                  {role === "tenant" && (
                    <div className="w-[48px] h-[48px] rounded-full bg-gray-200 flex items-center justify-center text-[16px] font-rethink font-medium text-gray-600">
                      {initials}
                    </div>
                  )}
                  {role === "owner" && (
                    <div className="w-[48px] h-[48px] rounded-full bg-gray-200 flex items-center justify-center text-[16px] font-rethink font-medium text-gray-600">
                      {initials}
                    </div>
                  )}
                </button>

                {dropdownOpen && (
                  <AccountDropdown
                    onClose={() => setDropdownOpen(false)}
                    onProfileOpen={() => {
                      setDropdownOpen(false);
                      setProfileOpen(true);
                    }}
                    user={profile}
                    role={role}
                  />
                )}
              </div>
            )}
            <Link
              to={getListPropertyRoute()}
              className="bg-accent text-surface w-[169px] h-[46px] rounded-xs text-[18px] font-rethink font-regular flex items-center justify-center"
            >
              List Property
            </Link>

          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="lg:hidden w-10 h-10 flex items-center justify-center rounded-[4px] border border-[#C6C6C6]/60 text-[#0E0D0C]"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <LuX size={22} /> : <LuMenu size={22} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden absolute left-0 right-0 top-full bg-[#FDFDFD] border-b border-[#C6C6C64A] px-5 py-5 shadow-sm">
            <div className="flex flex-col gap-1">
              <Link
                to="/properties"
                onClick={() => setMobileMenuOpen(false)}
                className={`py-3 text-[17px] font-rethink ${isCurrentPage("/properties") ? "text-accent font-medium" : "text-[#0E0D0C]"}`}
              >
                Properties
              </Link>

              {role === "owner" && (
                <Link
                  to="/my-listings"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`py-3 text-[17px] font-rethink ${isCurrentPage("/my-listings") ? "text-accent font-medium" : "text-[#0E0D0C]"}`}
                >
                  My Listings
                </Link>
              )}

              {role === "guest" && (
                <Link
                  to="/sign-in"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-3 text-[17px] font-rethink text-[#0E0D0C]"
                >
                  Sign in
                </Link>
              )}

              <Link
                to={getListPropertyRoute()}
                onClick={() => setMobileMenuOpen(false)}
                className="mt-3 bg-accent text-surface w-full h-[46px] rounded-xs text-[17px] font-rethink flex items-center justify-center"
              >
                List Property
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Profile Modal */}
      <ProfileModal
        isOpen={profileOpen}
        onClose={() => setProfileOpen(false)}
        user={profile}
      />
    </>
  );
}

export default Navbar;
