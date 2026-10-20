// components/Hero.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LuMapPin,
  LuChevronDown,
  LuFacebook,
  LuInstagram,
  LuLinkedin,
} from "react-icons/lu";
/*import heroLeft from "../assets/images/hero-left.jpg";*/         // left-side image/
import heroBuilding from "../assets/images/hero-building.jfif"; // right-side image

// Replace with real avatar images
const avatars = [
  "/avatar.svg",
  "/avatar.svg",
  "/avatar.svg",
  "/avatar.svg",
];

function Hero() {
  const [location, setLocation] = useState("");
  const navigate = useNavigate();

  function handleSearch(e) {
    e.preventDefault();
    const query = location.trim();
    navigate(query ? `/properties?location=${encodeURIComponent(query)}` : "/properties");
  }

  function handleScrollDown() {
    window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
  }

  return (
    <section className="relative grid grid-cols-1 lg:grid-cols-2 min-h-[640px] lg:min-h-[650px] overflow-hidden">
      {/* LEFT PANEL (image + overlay + content) */}
      <div className="relative text-white flex flex-col justify-center px-5 sm:px-8 lg:px-[60px] py-16 lg:py-0 overflow-hidden">
        <img
          src={heroBuilding}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#041632]/75" />

        <div className="relative z-10 max-w-[480px]">
          <h1 className="font-neue text-[30px] sm:text-[36px] lg:text-[48px] leading-[1.15]">
            Find your next house, not another agent
          </h1>

          <p className="mt-6 text-[16px] sm:text-[18px] leading-relaxed text-white/80 max-w-[400px] font-neue">
            Browse available rental properties and connect directly with landlords to make finding a place simpler.
          </p>

          {/* Search */}
          <form
            onSubmit={handleSearch}
            className="mt-10 flex items-center bg-white rounded-sm p-1 max-w-[440px]"
          >
            <LuMapPin className="ml-3 shrink-0 text-[#A9A9A9]" size={16} />
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Search by location"
              className="flex-1 min-w-0 px-3 py-2.5 text-[14px] font-rethink text-[#0E0D0C] placeholder:text-gray-400 focus:outline-none"
            />
            <button
              type="submit"
              className="bg-accent text-surface px-6 sm:px-8 h-[40px] rounded-xs text-[14px] font-rethink cursor-pointer"
            >
              Search
            </button>
          </form>

          {/* Social proof avatars */}
          {/*<div className="mt-10 flex items-center">
            {avatars.map((src, i) => (
              <img
                key={i}
                src={src}
                alt=""
                className={`w-9 h-9 rounded-full object-cover border-2 border-white/80 ${i > 0 ? "-ml-2.5" : ""}`}
              />
            ))}
            <span className="-ml-2.5 w-9 h-9 rounded-full bg-[#FDB940] text-[#0E0D0C] text-[11px] font-rethink font-medium flex items-center justify-center border-2 border-white/80">
              1k+
            </span>
          </div>*/}
        </div>
      </div>

      {/* RIGHT PANEL (image) */}
      <div className="relative hidden lg:block">
        <img
          src={heroBuilding}
          alt="Featured property building"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/10" />

       {/* <div className="absolute bottom-10 right-[60px] flex items-center gap-5 text-white">
          <a href="#" aria-label="Facebook"><LuFacebook size={16} /></a>
          <a href="#" aria-label="Instagram"><LuInstagram size={16} /></a>
          <a href="#" aria-label="LinkedIn"><LuLinkedin size={16} /></a>
        </div>*/}
      </div>


    </section>
  );
}

export default Hero;