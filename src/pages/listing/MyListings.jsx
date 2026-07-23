import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import SearchBar from "../../components/SearchBar";
import MyListingsCard from "../../components/MyListingsCard";
import ConfirmDialog from "../../components/ConfirmDialog";
import NotificationPopup from "../../components/NotificationPopup";

import { MdKeyboardArrowDown } from "react-icons/md";

import property1 from "../../assets/images/property1.svg";
import property2 from "../../assets/images/property2.svg";
import property4 from "../../assets/images/property4.svg";

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

const INITIAL_LISTINGS = [
  {
    id: 1,
    image: property2,
    title: "4 Bedroom Duplex",
    location: "Lekki Phase 1, Lagos",
    price: "7.5M",
    status: "published",
  },
  {
    id: 2,
    image: property2,
    title: "4 Bedroom Duplex",
    location: "Lekki Phase 1, Lagos",
    price: "7.5M",
    status: "published",
  },
  {
    id: 3,
    image: property4,
    title: "4 Bedroom Bungalow",
    location: "Lekki Phase 2, Lagos",
    price: "7.5M",
    status: "rented-out",
  },
  {
    id: 4,
    image: property4,
    title: "4 Bedroom Bungalow",
    location: "Lekki Phase 2, Lagos",
    price: "7.5M",
    status: "rented-out",
  },
  {
    id: 5,
    image: property4,
    title: "4 Bedroom Bungalow",
    location: "Lekki Phase 2, Lagos",
    price: "7.5M",
    status: "rented-out",
  },
  {
    id: 6,
    image: property1,
    title: "4 Bedroom Bungalow",
    location: "Lekki Phase 2, Lagos",
    price: "7.5M",
    status: "rented-out",
  },
];

export default function MyListings() {
  const navigate = useNavigate();
  const location = useLocation();

  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [sortBy, setSortBy] = useState("Newest");

  // Real state now, so rent/delete actions reflect on screen immediately.
  const [listings, setListings] = useState(INITIAL_LISTINGS);

  // "rent" | "delete" | null — drives the ConfirmDialog
  const [pendingAction, setPendingAction] = useState(null);
  // the listing the pending action applies to
  const [pendingListing, setPendingListing] = useState(null);
  // string | null — drives the NotificationPopup
  const [notification, setNotification] = useState(null);

  // Pick up a success message passed via navigate() from the details page
  // (e.g. after a delete redirects back here), and/or a freshly published
  // listing passed via navigate() from ListProperty after the pending-
  // verification modal is dismissed.
  useEffect(() => {
    if (location.state?.newListing) {
      setListings((prev) => [location.state.newListing, ...prev]);
    }
    if (location.state?.notification) {
      setNotification(location.state.notification);
    }
    if (location.state?.newListing || location.state?.notification) {
      // Clear it from history state so it doesn't reappear on back/refresh
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, []);

  const filteredListings = listings.filter((item) =>
    item.title.toLowerCase().includes(query.toLowerCase())
  );

  function handleAction(type, listing) {
     if (type === "edit") {
    navigate(`/edit-listing/${listing.id}`, {
      state: { listing, from: "/my-listings" },
    });
    return;
  }
  setPendingAction(type);
  setPendingListing(listing);
  }

  function handleConfirm() {
    const action = pendingAction;
    const listing = pendingListing;
    if (!action || !listing) return;

    // TODO: replace with real API calls once endpoints exist
    if (action === "rent") {
      console.log("mark rented", listing.id);
      setListings((prev) =>
        prev.map((item) =>
          item.id === listing.id ? { ...item, status: "rented-out" } : item
        )
      );
    }
    if (action === "delete") {
      console.log("delete", listing.id);
      setListings((prev) => prev.filter((item) => item.id !== listing.id));
    }

    setPendingAction(null);
    setPendingListing(null);
    setNotification(ACTION_CONFIG[action].successMessage);
  }

  return (
    <div className="bg-[#FDFDFD] min-h-screen font-neue">

      <Navbar />

      <section className="px-5 sm:px-8 lg:px-[60px] pt-8 lg:pt-[44px]">

        {/* HEADER */}
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">

          <div>
            <h1
              className="
                  text-[30px]
                  sm:text-[32px]
                leading-none
                font-roman
                font-neue
                text-[#0E0D0C]
              "
            >
              My Listings
            </h1>

            <p
             className="
                mt-[10px]
                text-[18px]
                text-[#A5A1A1]
                font-rethink
              "
            >
              Manage and update your listed properties.
            </p>
          </div>

          {/* SEARCH + SORT */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full lg:w-auto">

            <SearchBar
             value={query}
             onChange={setQuery}
             className="w-full sm:w-[300px] h-[40px] sm:shrink-0"
           />


{/* SORTBY DROPDOWN */}
<div className="relative w-full sm:w-[145px]">

  <button
    onClick={() => setOpen((prev) => !prev)}
    className="
      w-full
      h-[40px]
      px-4
      border
      border-[#C6C6C6]
      rounded-xs
      bg-white
      flex
      items-center
      justify-between
      text-[14px]
      font-neue
    "
  >
    <span className="truncate">
  Sort by: {sortBy}
</span>

<MdKeyboardArrowDown
  size={18}
  className={`shrink-0 transition-transform duration-200 ${
    open ? "rotate-180" : ""
  }`}
/>
  </button>

  {open && (
    <div
      className="
        absolute
        top-[44px]
        left-0
        w-full
        bg-white
        border
        border-[#C6C6C6]
        rounded-xs
        overflow-hidden
        z-50
      "
    >
      {[
        "Newest",
        "Oldest",
        "Price: High to Low",
        "Price: Low to High",
      ].map((item) => (
        <button
          key={item}
          onClick={() => {
            setSortBy(item);
            setOpen(false);
          }}
          className="
            w-full
            px-4
            py-3
            text-left
            hover:bg-[#F7F7F7]
          "
        >
          {item}
        </button>
      ))}
    </div>
  )}
            </div>

          </div>
        </div>

        {/* GRID */}
<div
  className="
    mt-9
    lg:mt-[48px]
    grid
    grid-cols-1
    sm:grid-cols-2
    xl:grid-cols-3
    gap-x-[24px]
    xl:gap-x-[28px]
    gap-y-[30px]
    lg:gap-y-[32px]
    pb-20
    lg:pb-[140px]
  "
>
  {filteredListings.map((listing) => (
    <Link
      key={listing.id}
      to={`/my-listings/${listing.id}`}
      state={{ listing }}
      className="block"
    >
      <MyListingsCard
        image={listing.image}
        title={listing.title}
        location={listing.location}
        price={listing.price}
        status={listing.status}
        onAction={(type) => handleAction(type, listing)}
      />
    </Link>
  ))}
</div>

      </section>

      <Footer />

      {pendingAction && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <ConfirmDialog
            title={ACTION_CONFIG[pendingAction].title}
            message={ACTION_CONFIG[pendingAction].message}
            confirmLabel={ACTION_CONFIG[pendingAction].confirmLabel}
            confirmColor={ACTION_CONFIG[pendingAction].confirmColor}
            onCancel={() => { setPendingAction(null); setPendingListing(null); }}
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
    </div>
  );
}