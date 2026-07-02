import { useState } from "react";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import SearchBar from "../../components/SearchBar";
import MyListingsCard from "../../components/MyListingsCard";

import { MdKeyboardArrowDown } from "react-icons/md";

import property1 from "../../assets/images/property1.svg";
import property2 from "../../assets/images/property2.svg";
import property4 from "../../assets/images/property4.svg";

export default function MyListings() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [sortBy, setSortBy] = useState("Newest");

  const listings = [
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

  const filteredListings = listings.filter((item) =>
    item.title.toLowerCase().includes(query.toLowerCase())
  );

  const handleAction = (type, listing) => {
    if (type === "edit") {
      console.log("edit", listing.id);
    }

    if (type === "rent") {
      console.log("mark rented", listing.id);
    }

    if (type === "delete") {
      console.log("delete", listing.id);
    }
  };

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
            <MyListingsCard
              key={listing.id}
              image={listing.image}
              title={listing.title}
              location={listing.location}
              price={listing.price}
              status={listing.status}
              onAction={(type) =>
                handleAction(type, listing)
              }
            />
          ))}
        </div>

      </section>

      <Footer />
    </div>
  );
}
