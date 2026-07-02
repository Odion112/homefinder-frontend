import { useState } from "react";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { LuHouse } from "react-icons/lu";
import { IoChevronUpOutline, IoChevronDownOutline } from "react-icons/io5";
import { MdCheckBox, MdCheckBoxOutlineBlank } from "react-icons/md";
import Button from "./Button";

const PROPERTY_TYPES = [
  "All",
  "Apartment",
  "Duplex",
  "Bungalow",
  "Self Contain",
  "Service Apartment",
  "Hostel",
];

export default function FilterPanel({ onApply }) {
  const [locationOpen, setLocationOpen] = useState(true);
  const [typeOpen, setTypeOpen] = useState(true);
  const [location, setLocation] = useState("");
  const [selectedTypes, setSelectedTypes] = useState([]);

  const hasFilters = location.trim() !== "" || selectedTypes.length > 0;

  const toggleType = (type) => {
    if (type === "All") {
      setSelectedTypes(selectedTypes.includes("All") ? [] : ["All"]);
      return;
    }
    const withoutAll = selectedTypes.filter((t) => t !== "All");
    if (withoutAll.includes(type)) {
      setSelectedTypes(withoutAll.filter((t) => t !== type));
    } else {
      setSelectedTypes([...withoutAll, type]);
    }
  };

  const handleApply = () => {
    onApply?.({ location, selectedTypes });
  };

  return (
    <div className="w-full lg:w-[320px] xl:w-[380px] bg-[#D9D9D9]/12 rounded-xs overflow-hidden flex flex-col pb-2">

      {/* Location */}
      <div className="px-5 pt-5 pb-6">
        <button
          className="flex items-center justify-between w-full"
          onClick={() => setLocationOpen((v) => !v)}
        >
          <div className="flex items-center gap-2">
            <HiOutlineLocationMarker size={16} className="text-[#A5A1A1]" />
            <span className="text-[15px] font-regular text-[#A5A1A1] font-rethink">
              Location
            </span>
          </div>
          {locationOpen
            ? <IoChevronUpOutline size={14} className="text-[#0E0D0C]" />
            : <IoChevronDownOutline size={14} className="text-[#0E0D0C]" />
          }
        </button>

        {locationOpen && (
          <div className="mt-3 rounded-xs ">
            <input
              type="text"
              placeholder="State & City"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3 py-2.5 text-[13px] border border-[#C6C6C6]/40 bg-[#FFFFFF] rounded-lg outline-none focus:border-[#FE7C0B] transition-colors text-[#0E0D0C] placeholder:text-[#696262] font-rethink"
            />
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="px-5">
        <div className="border-t border-[#C6C6C6]/40" />
      </div>

      {/* Property Type*/}
      <div className="px-5 pt-6 pb-6">
        <button
          className="flex items-center justify-between w-full"
          onClick={() => setTypeOpen((v) => !v)}
        >
          <div className="flex items-center gap-2">
            <LuHouse size={15} className="text-[#A5A1A1]" />
            <span className="text-[15px] font-regular text-[#A5A1A1] font-rethink">
              Property Type
            </span>
          </div>
          {typeOpen
            ? <IoChevronUpOutline size={14} className="text-[#0E0D0C]" />
            : <IoChevronDownOutline size={14} className="text-[#0E0D0C]" />
          }
        </button>

        {typeOpen && (
          <div className="mt-3 flex flex-col gap-3">
            {PROPERTY_TYPES.map((type) => {
              const checked = selectedTypes.includes(type);
              return (
                <button
                  key={type}
                  onClick={() => toggleType(type)}
                  className="flex items-center gap-2.5 text-left"
                >
                  {checked
                    ? <MdCheckBox size={18} color="#FE7C0B" />
                    : <MdCheckBoxOutlineBlank size={18} className="text-[#D7DAE3]" />
                  }
                  <span className="text-[14px] select-none font-rethink font-regular text-[#0E0D0C]">
                    {type}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Divider & CTA button */}
      {(locationOpen || typeOpen) && (
        <>
          <div className="px-5">
            <div className="border-t border-[#C6C6C6]/40" />
          </div>

          <div className="px-5 pt-7 pb-5">
            <Button
              variant={hasFilters ? "filled" : "outline"}
              onClick={hasFilters ? handleApply : undefined}
              className={`!w-full ${!hasFilters ? "pointer-events-none" : ""}`}
            >
              Apply filters
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
