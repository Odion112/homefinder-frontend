import { useState } from "react";
import { Link, useParams, useLocation, useNavigate } from "react-router-dom";

import {
  PiArrowLeft,
  PiMapPin,
  PiBed,
  PiBathtub,
  PiCaretDown,
  PiCarSimple,
  PiGlobe,
  PiShieldCheck,
  PiRoadHorizon,
  PiBarbell,
  PiDrop,
} from "react-icons/pi";
import { BsThreeDots } from "react-icons/bs";
import { FiCheck } from "react-icons/fi";
import { LuHouse } from "react-icons/lu";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import AmenityTag from "../../components/AmenityTag";
import ConfirmDialog from "../../components/ConfirmDialog";
import NotificationPopup from "../../components/NotificationPopup";
import { PublishedDropdown, RentedDropdown } from "../../components/MyListingsCard";

// Replace with real images coming from the backend/property data
import propertyImageOne from "../../assets/images/property14.svg";
import propertyImageTwo from "../../assets/images/property15.svg";
import propertyImageThree from "../../assets/images/property16.svg";
import propertyImageFour from "../../assets/images/property17.svg";
import propertyImageFive from "../../assets/images/property15.svg";
import propertyImageSix from "../../assets/images/property17.svg";
import propertyImageSeven from "../../assets/images/property16.svg";

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

// Config for each confirmable action — title/message/labels for the dialog,
// plus the message to show in the success notification once confirmed.
const ACTION_CONFIG = {
  rent: {
    title: "Mark as rented?",
    message: "This listing will be marked as rented out and hidden from search.",
    confirmLabel: "Mark as rented",
    confirmColor: "#FE7C0B",
    successMessage: "Listing marked as rented",
  },
  delete: {
    title: "Delete listing?",
    message: "This action can't be undone. The listing will be permanently removed.",
    confirmLabel: "Delete",
    confirmColor: "#EA0000",
    successMessage: "Listing deleted",
  },
};

export default function MyListingDetails() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Passed in via <Link state={{ listing }}> from MyListings.
  // Replace with a real fetch-by-id once the backend endpoint exists.
  const listing = location.state?.listing || {
    id,
    title: "3 Bedroom Flat",
    location: "Lekki Phase 1, Lagos",
    status: "published",
  };

  const [showAllAmenities, setShowAllAmenities] = useState(false);
  const [showFullVerification, setShowFullVerification] = useState(false);
  const [featuredImage, setFeaturedImage] = useState(GALLERY_IMAGES[0]);
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Local, immediately-reflected status — starts from whatever was passed in
  const [currentStatus, setCurrentStatus] = useState(listing.status);

  // "rent" | "delete" | null — drives the ConfirmDialog
  const [pendingAction, setPendingAction] = useState(null);
  // string | null — drives the NotificationPopup
  const [notification, setNotification] = useState(null);

  // Right-side thumbnails shown by default
  const sideThumbnails = GALLERY_IMAGES.slice(1, 3);
  // Extra thumbnails revealed when "View all photos" is tapped
  const remainingThumbnails = GALLERY_IMAGES.slice(3);

  const visibleAmenities = showAllAmenities
    ? ALL_AMENITIES
    : ALL_AMENITIES.slice(0, 6);

  function handleAction(type) {
   if (type === "edit") {
    navigate(`/edit-listing/${listing.id}`, {
      state: { listing, from: `/my-listings/${listing.id}` },
    });
    return;
  }
  setPendingAction(type);
  }

  function handleConfirm() {
    const action = pendingAction;
    if (!action) return;

    // TODO: replace with real API calls once endpoints exist
    if (action === "rent") {
      console.log("mark rented", listing.id);
      setCurrentStatus("rented-out");
      setPendingAction(null);
      setNotification(ACTION_CONFIG[action].successMessage);
      return;
    }

    if (action === "delete") {
      console.log("delete", listing.id);
      // Navigate back to My Listings — no point showing the notification
      // here since the page is about to unmount.
      navigate("/my-listings", { state: { notification: ACTION_CONFIG[action].successMessage } });
      return;
    }
  }

  return (
    <>
      <Navbar />

      <main className="bg-[#FDFDFD] pt-5 lg:pt-8">
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
            to="/my-listings"
            className="flex items-center gap-2 text-[14px] sm:text-[16px] font-rethink font-regular text-[#696262] min-w-0"
          >
            <PiArrowLeft size={18} />
            My Listings
            <span className="text-[#696262]">/</span>
            <span className="font-medium font-rethink text-[#0E0D0C] truncate">{listing.title}</span>
          </Link>
          <p className="text-[14px] font-neue text-[#696262]">Posted 2 days ago</p>
        </div>

        {/* Title row + status badge + more menu */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_500px] gap-5 lg:gap-10 mt-3 items-start">
          <div>
            <div className="flex items-start justify-between">
              <h1 className="text-[32px] sm:text-[40px] font-neue font-roman text-[#0E0D0C] leading-tight">
                {listing.title}
              </h1>
            </div>

            <div className="flex items-center gap-2 mt-2 text-[16px] font-neue text-[#696262]">
              <PiMapPin size={18} />
              {listing.location}
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

            {/* STATUS BADGE — same style as MyListingCard */}
            <div className="mt-6">
              {currentStatus === "published" ? (
                <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#EDFAF3] text-[#27AE60]">
                  <FiCheck className="text-[14px]" strokeWidth={2.5} />
                  <span className="text-[14px] font-neue font-roman">Published</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#EEF0FF] text-[#5B67CA]">
                  <LuHouse className="text-[14px]" strokeWidth={1.9} />
                  <span className="text-[14px] font-neue font-roman">Rented out</span>
                </div>
              )}
            </div>
          </div>


          <div className="flex justify-start lg:justify-end items-center gap-3">
            <div className="relative">
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="w-10 h-10 flex items-center justify-center rounded-full border border-[#C6C6C6] hover:bg-gray-50 transition-colors text-[#0E0D0C]"
                aria-label="More options"
                aria-haspopup="true"
                aria-expanded={menuOpen}
              >
                <BsThreeDots size={18} />
              </button>

              {menuOpen && currentStatus === "published" && (
                <PublishedDropdown
                  onAction={handleAction}
                  onClose={() => setMenuOpen(false)}
                />
              )}

              {menuOpen && currentStatus === "rented-out" && (
                <RentedDropdown
                  onAction={handleAction}
                  onClose={() => setMenuOpen(false)}
                />
              )}
            </div>
          </div>
        </div>

        {/* CONTENT — full width, no landlord card */}
      <div className="mt-10 pb-16 lg:pb-20">

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

         {ALL_AMENITIES.length > 7 && (
  <button
    onClick={() => setShowAllAmenities((prev) => !prev)}
    className="flex items-center gap-1.5 text-[14px] font-neue font-medium text-[#0E0D0C] underline mt-4"
  >
    {showAllAmenities
      ? "Show less"
      : `Show all (${ALL_AMENITIES.length})`}

    <PiCaretDown
      size={16}
      className={`transition-transform ${
        showAllAmenities ? "rotate-180" : ""
      }`}
    />
  </button>
)}

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
        </div>
      </main>

      <Footer />

      {pendingAction && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <ConfirmDialog
            title={ACTION_CONFIG[pendingAction].title}
            message={ACTION_CONFIG[pendingAction].message}
            confirmLabel={ACTION_CONFIG[pendingAction].confirmLabel}
            confirmColor={ACTION_CONFIG[pendingAction].confirmColor}
            onCancel={() => setPendingAction(null)}
            onConfirm={handleConfirm}
          />
        </div>
      )}

      {notification && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
          <NotificationPopup
            message={notification}
            onClose={() => setNotification(null)}
          />
        </div>
      )}
    </>
  );
}