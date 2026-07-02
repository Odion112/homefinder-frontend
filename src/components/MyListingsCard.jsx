import { useRef, useState, useEffect } from "react";
import { PiMapPinLight } from "react-icons/pi";
import { BsThreeDots } from "react-icons/bs";
import { LuHouse, LuPencil, LuTrash2 } from "react-icons/lu";
import { FiCheck } from "react-icons/fi";

//  PUBLISHED DROPDOWN
function PublishedDropdown({ onAction, onClose }) {
  const [hovered, setHovered] = useState(null);
  const ref = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    };
    const handleKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [onClose]);

  const items = [
    { id: "rent",   label: "Mark as Rented", Icon: LuHouse,   danger: false },
    { id: "edit",   label: "Edit Listing",   Icon: LuPencil,  danger: false },
    { id: "delete", label: "Delete Listing", Icon: LuTrash2,  danger: true  },
  ];

  return (
    <div
      ref={ref}
      role="menu"
      className="
        absolute right-0 bottom-[calc(100%+6px)] z-50
        bg-white rounded-[10px] p-[16px]
        flex flex-col gap-[2px]
        min-w-[200px]
        border border-[#E5E5E5]
        shadow-[0px_8px_24px_rgba(0,0,0,0.08)]
        font-rethink
      "
    >
      {items.map(({ id, label, Icon, danger }) => (
        <button
          key={id}
          role="menuitem"
          onClick={() => { onAction(id); onClose(); }}
          onMouseEnter={() => setHovered(id)}
          onMouseLeave={() => setHovered(null)}
          className="
            flex items-center gap-[10px]
            px-4 py-[12px] rounded-[7px]
            border-none w-full text-left
            text-[14px] font-medium leading-none
            transition-colors duration-[120ms]
            cursor-pointer
          "
          style={{
            color:           danger ? "#EA0000" : "#0E0D0C",
            backgroundColor: hovered === id
              ? danger ? "rgba(234,0,0,0.04)" : "#F5F5F5"
              : "transparent",
          }}
        >
          <Icon size={16} strokeWidth={1.6} style={{ flexShrink: 0 }} />
          {label}
        </button>
      ))}
    </div>
  );
}

// RENTED-OUT DROPDOWN 
function RentedDropdown({ onAction, onClose }) {
  const [hovered, setHovered] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    };
    const handleKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [onClose]);

  return (
    <div
      ref={ref}
      role="menu"
      className="
        absolute right-0 bottom-[calc(100%+6px)] z-50
        bg-white rounded-[10px] p-[4px]
        min-w-[170px]
        border border-[#E5E5E5]
        shadow-[0px_8px_24px_rgba(0,0,0,0.08)]
        font-rethink
      "
    >
      <button
        role="menuitem"
        onClick={() => { onAction("edit"); onClose(); }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="
          flex items-center gap-[10px]
          px-4 py-[12px] rounded-[7px]
          border-none w-full text-left
          text-[14px] font-medium leading-none text-[#EA0000]
          transition-colors duration-[120ms] cursor-pointer
        "
        style={{ backgroundColor: hovered ? "#EA0000/10" : "transparent" }}
      >
        <LuTrash2 size={16} strokeWidth={1.6} style={{ flexShrink: 0 }} />
        Delete Listing
      </button>
    </div>
  );
}

//  MAIN CARD 
// status = "published" | "rented-out"
export default function MyListingCard({
  image,
  title,
  location,
  price,
  status = "published",
  onAction, // fn(actionType) — "rent" | "edit" | "delete"
}) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="
        w-full overflow-hidden rounded-[4px] bg-white
        shadow-sm transition hover:shadow-lg font-neue
        ring-1 ring-[#C6C6C6]/25
      "
    >
      {/* IMAGE */}
      <div className="relative w-full h-[220px] sm:h-[270px] overflow-hidden rounded-t-[4px]">
        <img
          src={image}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>

      {/* CONTENT */}
      <div className="bg-white px-5 pt-6 pb-6 flex flex-col gap-3">

        {/* TITLE & PRICE */}
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-[21px] sm:text-[24px] font-light leading-tight text-[#0E0D0C] tracking-tight font-neue">
            {title}
          </h2>
          <h3 className="whitespace-nowrap text-[22px] sm:text-[26px] leading-tight">
            <span className="font-neue font-medium">₦{price}</span>
            <span className="font-neue font-light text-[#0E0D0C]">/yr</span>
          </h3>
        </div>

        {/* LOCATION */}
        <div className="flex items-center gap-1.5">
          <PiMapPinLight className="text-[14px] text-[#696262] shrink-0" />
          <span className="text-[14px] font-light text-[#696262] font-neue line-clamp-1">
            {location}
          </span>
        </div>

        {/* STATUS & MORE BUTTON */}
        <div className="flex items-center justify-between mt-1">

          {status === "published" ? (
            <div className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#EDFAF3] text-[#27AE60]">
              <FiCheck className="text-[13px]" strokeWidth={2.5} />
              <span className="text-[13px] font-neue font-light">Published</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#EEF0FF] text-[#5B67CA]">
              <LuHouse className="text-[13px]" strokeWidth={1.8} />
              <span className="text-[13px] font-neue font-light">Rented out</span>
            </div>
          )}

          {/* MORE BUTTON + DROPDOWn*/}
          <div className="relative">
            <button
              onClick={() => setOpen((v) => !v)}
              className="
                flex items-center justify-center
                w-8 h-8 rounded-full text-[#696262]
                hover:bg-[#F5F5F5] transition
              "
              aria-label="More options"
              aria-haspopup="true"
              aria-expanded={open}
            >
              <BsThreeDots className="text-[18px]" />
            </button>

            {open && status === "published" && (
              <PublishedDropdown
                onAction={(type) => onAction?.(type)}
                onClose={() => setOpen(false)}
              />
            )}

            {open && status === "rented-out" && (
              <RentedDropdown
                onAction={(type) => onAction?.(type)}
                onClose={() => setOpen(false)}
              />
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

// ─── HOW TO USE ────────────────────────────────────────────────────────────────
//
// import MyListingCard from "./MyListingCard";
// import ConfirmDialog from "./ConfirmDialog";
//
// const [pendingAction, setPendingAction] = useState(null);
//
// const handleAction = (type) => {
//   // "edit" goes straight to edit flow, others open ConfirmDialog
//   if (type === "edit") {
//     navigate("/edit-listing/" + listingId);
//   } else {
//     setPendingAction(type); // "rent" | "delete"
//   }
// };
//
// <MyListingCard
//   image={PropertyImage}
//   title="4 Bedroom Duplex"
//   location="Lekki Phase 1, Lagos"
//   price="7.5M"
//   status="published"
//   onAction={handleAction}
// />
//
// <MyListingCard
//   image={PropertyImage2}
//   title="4 Bedroom Bungalow"
//   location="Lekki Phase 2, Lagos"
//   price="7.5M"
//   status="rented-out"
//   onAction={handleAction}
// />
//
// {pendingAction && (
//   <ConfirmDialog
//     action={pendingAction}
//     onClose={() => setPendingAction(null)}
//     onConfirm={() => { /* handle */ setPendingAction(null); }}
//   />
// )}
