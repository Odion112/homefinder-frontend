import { useState } from "react";


import ConfirmDialog from "./ConfirmDialog";
import Dropdown from "./Dropdown";

import { IoCallOutline } from "react-icons/io5";
import { LiaWhatsapp } from "react-icons/lia";
import { PiFlagPennant, PiCheckCircle } from "react-icons/pi";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { MdOutlineVerifiedUser } from "react-icons/md";
import avatarPlaceholder from "../assets/images/avatar.svg";

const REPORT_REASONS = [
  "Fraudulent or scam listing",
  "Incorrect information",
  "Already rented out",
  "Inappropriate content",
  "Other",
];

const MASKED_NUMBER = "+234 701 *** ****";

export default function LandlordCard({ landlord, isGuest = false }) {
  const {
    name = "Jamiu Peters",
    verified = true,
    avatarUrl = null,
    propertiesListed = 2,
    memberSince = 2026,
    phone = "+234 701 111 2222",
    whatsapp = "+234 701 111 2222",
  } = landlord || {};

  const [reportState, setReportState] = useState("idle");
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [callCopied, setCallCopied] = useState(false);

  const isFormReady = reason.trim() !== "";

  function handleSubmit() {
    if (!isFormReady) return;
    setReportState("submitted");
  }

  function handleGuestTap() {
    setShowAuthModal(true);
  }

  function handleCallClick() {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) {
      window.location.href = `tel:${phone}`;
    } else {
      navigator.clipboard.writeText(phone).then(() => {
        setCallCopied(true);
        setTimeout(() => setCallCopied(false), 3000);
      });
    }
  }

  return (
    <>
      <div className="w-full lg:max-w-[500px] bg-white rounded-[6px] border border-gray-100 shadow-sm px-5 sm:px-8 lg:px-10 py-6 sm:py-8 lg:py-10">
        {/* Price */}
        <div className="mb-4">
          <p className="text-[28px] sm:text-[34px] font-medium font-neue text-[#0E0D0C] leading-tight">
            ₦4,500,000
            <span className="text-xl font-light font-neue text-[#0E0D0C]">/ yr</span>
          </p>
          <p className="text-[20px] text-[#696262] font-neue font-roman mt-2">
            Rent (Negotiable)
          </p>
        </div>

        <hr className="border-[#A5A1A1]/30 mb-7 mt-7" />

        {/* Landlord info — avatarUrl from backend, falls back to placeholder image */}
        <div className="flex items-center gap-4 mb-7">
          <img
            src={avatarUrl || avatarPlaceholder}
            alt={name}
            className="w-16 h-16 rounded-full object-cover shrink-0"
          />
          <div>
            <p className="font-neue font-medium text-[#0E0D0C] text-[16px]">{name}</p>
            {verified && (
              <div className="flex items-center gap-1 mt-0.5">
                <MdOutlineVerifiedUser size={14} className="text-green-500 fill-green-500" />
                <span className="text-[12px] font-neue font-medium text-green-600">Verified Landlord</span>
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-start gap-5 sm:gap-10 mb-5 bg-[#F5F5F5]/50 px-4 sm:pl-6 pt-4 pb-4 rounded-sm">
          <div>
            <p className="text-[16px] font-medium font-neue text-[#0E0D0C]">{propertiesListed}</p>
            <p className="text-xs text-[#A5A1A1] font-neue">Properties Listed</p>
          </div>
          <div className="w-px h-10 bg-[#C6C6C6]/30" />
          <div>
            <p className="text-[14px] font-medium font-neue text-[#0E0D0C]">Member since</p>
            <p className="text-xs text-[#A5A1A1] font-neue">{memberSince}</p>
          </div>
        </div>

        {/* Contact buttons */}
        <div className="flex flex-col gap-3 mb-5">

          {/* Call button */}
          {isGuest ? (
            <button
              onClick={handleGuestTap}
              className="w-full h-[62px] flex items-center justify-center gap-2 bg-[#FE7C0B] hover:bg-[#f87808] text-white rounded-sm text-sm font-medium font-rethink transition-colors"
            >
              <IoCallOutline size={18} />
              {MASKED_NUMBER}
            </button>
          ) : callCopied ? (
            <div className="w-full h-[62px] flex items-center justify-center gap-1 text-[#0B8A2F] text-sm font-medium font-rethink">
              <PiCheckCircle size={18} className="text-[#0B8A2F]" />
              Link copied
            </div>
          ) : (
            <button
              onClick={handleCallClick}
              className="w-full h-[62px] flex items-center justify-center gap-2 bg-[#FE7C0B] hover:bg-[#fe8216] text-white rounded-sm text-sm font-medium font-rethink transition-colors"
            >
              <IoCallOutline size={18} />
              {phone}
            </button>
          )}

          {/* WhatsApp button */}
          {isGuest ? (
            <button
              onClick={handleGuestTap}
              className="w-full h-[62px] flex items-center justify-center gap-2 border border-gray-300 hover:bg-gray-50 text-gray-800 rounded-sm text-sm font-medium font-rethink transition-colors"
              style={{ borderRadius: "2px" }}
            >
              <LiaWhatsapp size={18} />
              {MASKED_NUMBER}
            </button>
          ) : (
            <a
              href={`https://wa.me/${String(whatsapp).replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full h-[62px] flex items-center justify-center gap-2 border rounded-sm border-gray-300 hover:bg-gray-50 text-gray-800 text-sm font-medium font-rethink transition-colors"
              style={{ borderRadius: "2px" }}
            >
              <LiaWhatsapp size={18} />
              {whatsapp}
            </a>
          )}

        </div>

        {/* Report section */}
        {reportState === "idle" && (
          <button
            onClick={() => setReportState("open")}
            className="flex items-center gap-2 text-[#696262] hover:text-gray-700 font-rethink font-medium text-[15px] mx-auto transition-colors"
          >
            <PiFlagPennant size={18} />
            Report listing
          </button>
        )}

        {reportState === "open" && (
          <div className="mt-1">
            <button
              onClick={() => setReportState("idle")}
              className="flex items-center gap-2 text-[#696262] hover:text-gray-700 text-[15px] mt-9 mb-6 font-rethink font-medium transition-colors"
            >
              <PiFlagPennant size={18} />
              Report listing
            </button>

            {/* Reason dropdown */}
            <p className="text-[14px] font-neue text-gray-700 mb-2">
              Why are you reporting this listing?
              <span className="text-red-500 ml-0.5">*</span>
            </p>
            <Dropdown
              options={REPORT_REASONS}
              value={reason}
              onChange={(val) => setReason(val)}
              placeholder="Select a reason"
              className="mb-6 font-neue"
            />

            {/* Additional details */}
            <p className="text-[14px] font-neue text-gray-700 mb-2">
              Additional details{" "}
              <span className="text-gray-400 font-normal font-neue">(optional)</span>
            </p>
            <div className="relative mb-6">
              <textarea
                value={details}
                onChange={(e) => {
                  if (e.target.value.length <= 500) setDetails(e.target.value);
                }}
                placeholder="Tell us more about the issue..."
                rows={4}
                className="w-full border border-gray-300 rounded-sm px-3 py-3 text-[14px] font-neue text-gray-900 placeholder-[#A5A1A1] resize-none focus:outline-none focus:ring-1 focus:ring-[#FE7C0B] focus:border-transparent transition"
              />
              <span className="absolute bottom-2.5 right-3 text-xs font-neue text-[#696262]">
                {details.length}/500
              </span>
            </div>

            {/* Privacy note */}
            <div className="flex items-start gap-1.5 mb-6">
              <MdOutlineVerifiedUser size={14} className="text-[#0B8A2F] text-[#0B8A2F]mt-0.5 shrink-0" />
              <p className="text-xs font-neue text-[#696262]">
                Reports are reviewed within 24 hours. Your identity will remain anonymous.
              </p>
            </div>

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={!isFormReady}
              className={`w-full h-[56px] flex items-center justify-center rounded-sm text-sm font-rethink font-medium transition-colors ${
                isFormReady
                  ? "bg-red-600 hover:bg-red-700 text-white cursor-pointer"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              Submit report
            </button>
          </div>
        )}

        {reportState === "submitted" && (
          <div className="flex items-center justify-center gap-2 text-[#0B8A2F] text-sm font-rethink font-medium">
            <IoIosCheckmarkCircle size={18} className="text-[#0B8A2F]" />
            Report submitted
          </div>
        )}
      </div>

      {showAuthModal && (
        <ConfirmDialog onClose={() => setShowAuthModal(false)} />
      )}
    </>
  );
}
