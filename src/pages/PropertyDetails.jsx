import { useState } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";


import {
  PiArrowLeft,
  PiMapPin,
  PiBed,
  PiBathtub,
  PiShareNetwork,
  PiCaretDown,
  PiCarSimple,
  PiGlobe,
  PiShieldCheck,
  PiRoadHorizon,
  PiBarbell,
  PiDrop,
  PiCheckCircle,
} from "react-icons/pi";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AmenityTag from "../components/AmenityTag";
import LandlordCard from "../components/LandlordCard";

// Replace with real images coming from the backend/property data
import propertyImageOne from "../assets/images/property14.svg";
import propertyImageTwo from "../assets/images/property15.svg";
import propertyImageThree from "../assets/images/property16.svg";
import propertyImageFour from "../assets/images/property17.svg";
import propertyImageFive from "../assets/images/property15.svg";
import propertyImageSix from "../assets/images/property17.svg";
import propertyImageSeven from "../assets/images/property16.svg";

const GALLERY_IMAGES = [
  propertyImageOne,
  propertyImageTwo,
  propertyImageThree,
  propertyImageFour,
  propertyImageFive,
  propertyImageSix,
  propertyImageSeven,
];

const ALL_AMENITIES = [
  { icon: PiCarSimple, label: "24/7 Power Supply" },
  { icon: PiCarSimple, label: "Parking Space" },
  { icon: PiGlobe, label: "Internet Availability" },
  { icon: PiShieldCheck, label: "Security" },
  { icon: PiRoadHorizon, label: "Good Road Access" },
  { icon: PiBarbell, label: "Gym" },
  { icon: PiDrop, label: "Running water" },
];

const VERIFICATION_TEXT = `Every verified landlord on Home Finder goes through an identity verification process to help improve trust across the platform. This helps property seekers identify more trustworthy listings and make housing decisions with greater confidence before reaching out or scheduling inspections.

And because Home Finder connects users directly to landlords, we do not allow inspection fees on the platform. You should never pay to inspect a property listed through Home Finder. 


If anyone requests an inspection fee while claiming to represent a listing on our platform, please treat it as suspicious and report the listing immediately. roads.`;


const landlordData = {
    name: "Jamiu Peters",
    verified: true,
    avatarUrl: null,
    propertiesListed: 2,
    memberSince: 2026,
    phone: "+234 701 111 2222",
    whatsapp: "+234 701 111 2222", // must be a string
  };


export default function PropertyDetails() {
   const { id } = useParams();
  const [showAllAmenities, setShowAllAmenities] = useState(false);
  const [showFullVerification, setShowFullVerification] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [featuredImage, setFeaturedImage] = useState(GALLERY_IMAGES[0]);
  const [showAllPhotos, setShowAllPhotos] = useState(false);

  

  // Right-side thumbnails shown by default
  const sideThumbnails = GALLERY_IMAGES.slice(1, 3);
  // Extra thumbnails revealed when "View all photos" is tapped
  const remainingThumbnails = GALLERY_IMAGES.slice(3);

  const visibleAmenities = showAllAmenities
    ? ALL_AMENITIES
    : ALL_AMENITIES.slice(0, 6);

  function handleShare() {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 3000);
    });
  }

  return (
    <>
      <Navbar />

      <main className="pt-5 lg:pt-8">
        <div className="w-full">
          <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-1.5">
            <img
              src={featuredImage}
              alt="Property featured view"
              className="w-full h-[320px] sm:h-[420px] lg:h-[500px] object-cover"
            />

            <div className="grid grid-cols-2 md:flex md:flex-col gap-1.5">
              {sideThumbnails.map((image, index) => {
                const isLastThumbnail = index === sideThumbnails.length - 1;
                return (
                  <button
                    key={image}
                    type="button"
                    onClick={() => setFeaturedImage(image)}
                    className="relative w-full h-[150px] sm:h-[190px] lg:h-[247px] overflow-hidden"
                  >
                    <img
                      src={image}
                      alt="Property thumbnail"
                      className="w-full h-full object-cover"
                    />
                    {isLastThumbnail && remainingThumbnails.length > 0 && (
                      <span
                        role="button"
                        tabIndex={0}
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowAllPhotos((prev) => !prev);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.stopPropagation();
                            setShowAllPhotos((prev) => !prev);
                          }
                        }}
                        className="absolute inset-0 bg-black/40 hover:bg-black/50 transition-colors flex items-center justify-center text-white text-[16px] sm:text-[20px] font-rethink font-medium text-center px-3"
                      >
                        {showAllPhotos ? "Show fewer" : "View all photos"}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Remaining photos — revealed when "View all photos" is tapped */}
          {showAllPhotos && remainingThumbnails.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 mt-1.5">
              {remainingThumbnails.map((image) => (
                <button
                  key={image}
                  type="button"
                  onClick={() => setFeaturedImage(image)}
                  className="w-full h-[130px] sm:h-[160px] overflow-hidden"
                >
                  <img
                    src={image}
                    alt="Property thumbnail"
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="px-5 sm:px-8 lg:px-[60px]">
        {/* Breadcrumb */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-8 lg:mt-12 mb-8 lg:mb-10">
          <Link
            to="/properties"
            className="flex items-center gap-2 text-[14px] sm:text-[16px] font-rethink font-regular text-[#696262] min-w-0"
          >
            <PiArrowLeft size={18} />
            Properties
            <span className="text-[#696262]">/</span>
            <span className="font-medium font-rethink text-[#0E0D0C] truncate">3 Bedroom Flat</span>
          </Link>
          <p className="text-[14px] font-neue text-[#696262]">Posted 2 days ago</p>
        </div>

        {/* Title row + share */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_500px] gap-5 lg:gap-10 mt-3 items-start">
          <div>
            <div className="flex items-start justify-between">
              <h1 className="text-[32px] sm:text-[40px] font-neue font-roman text-[#0E0D0C] leading-tight">
                3 Bedroom Flat
              </h1>
            </div>

            <div className="flex items-center gap-2 mt-2 text-[16px] font-neue text-[#696262]">
              <PiMapPin size={18} />
              Lekki Phase 1, Lagos
            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-4 text-[15px] font-neue text-[#0E0D0C]">
              <div className="flex items-center gap-2">
                <PiBed size={20} />
                3 Bedrooms
              </div>
              <div className="flex items-center gap-2">
                <PiBathtub size={20} />
                4 bathrooms
              </div>
            </div>
          </div>


          <div className="flex justify-start lg:justify-end items-center gap-3">
            {linkCopied && (
              <span className="flex items-center gap-1.5 text-[14px] font-rethink font-medium text-[#0B8A2F]">
                <PiCheckCircle size={18} className="text-[#0B8A2F]" />
                Link copied
              </span>
            )}
            <button
              onClick={handleShare}
              className="h-10 px-5 flex items-center gap-2 border border-[#C6C6C6] rounded-[3px] text-sm font-rethink font-normal text-[#0E0D0C] hover:bg-gray-50 transition-colors"
            >
              <PiShareNetwork size={18} />
              Share
            </button>
          </div>
        </div>

        {/* LEFT COLUMN */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_500px] gap-8 lg:gap-x-[90px] mt-10 pb-16 lg:pb-20">

          <div>
            {/* Description */}
            <h2 className="text-[22px] font-neue font-medium text-[#0E0D0C] mb-3">
              Description
            </h2>
            <p className="text-[16px] font-neue font-roman text-[#696262] leading-relaxed">
              This spacious 3-bedroom apartment is located in the heart of
              Lekki Phase 1. The property features modern interiors, ample
              parking space, reliable power supply, and 24-hour security. It
              is situated in a secure and accessible neighborhood close to
              schools, supermarkets, hospitals, and major roads.
            </p>

            <hr className="border-[#A5A1A1]/30 my-8" />

            {/* Amenities */}
            <h2 className="text-[22px] font-neue font-medium text-[#0E0D0C] mb-4">
              Amenities
            </h2>
            <div className="flex flex-wrap gap-3">
              {visibleAmenities.map((amenity) => (
                <AmenityTag
                  key={amenity.label}
                  icon={amenity.icon}
                  label={amenity.label}
                />
              ))}
            </div>

            <button
              onClick={() => setShowAllAmenities((prev) => !prev)}
              className="flex items-center gap-1.5 text-[14px] font-neue font-medium text-[#0E0D0C] underline mt-4"
            >
              {showAllAmenities ? "Show less" : `Show all (${ALL_AMENITIES.length + 6})`}
              <PiCaretDown
                size={16}
                className={`transition-transform ${
                  showAllAmenities ? "rotate-180" : ""
                }`}
              />
            </button>

            <hr className="border-[#A5A1A1]/30 my-8" />

            {/* Verification */}
            <h2 className="text-[22px] font-neue font-medium text-[#0E0D0C] mb-3">
              We verified this property so you don&apos;t have to
            </h2>
            <p className="text-[16px] font-neue font-roman text-[#696262] leading-relaxed">
              {showFullVerification
                ? VERIFICATION_TEXT
                : `${VERIFICATION_TEXT.slice(0, 160)}...`}
            </p>
            <button
              onClick={() => setShowFullVerification((prev) => !prev)}
              className="flex items-center gap-1.5 text-[14px] font-neue font-medium text-[#0E0D0C] underline mt-3"
            >
              {showFullVerification ? "Read less" : "Read more"}
              <PiCaretDown
                size={16}
                className={`transition-transform ${
                  showFullVerification ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>

          {/* RIGHT COLUMN */}
          <div className="lg:sticky lg:top-10 self-start w-full">
  <LandlordCard landlord={landlordData} isGuest={false} />
</div>
        </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
