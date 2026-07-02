import { PiMapPinLight } from "react-icons/pi";
import { GoZap } from "react-icons/go";
import { PiBathtub } from "react-icons/pi";
import { IoBedOutline } from "react-icons/io5";
import VerifiedBadge from "./VerifiedBadge";

export default function HomePagePropertyCard({
  image,
  title,
  location,
  priceAmount,
  pricePeriod,
  beds,
  baths,
  power,
  verified = true,
}) {
  return (

    <div
      className="
        w-full
        min-h-[410px]
        overflow-hidden
        rounded-[6px]
        bg-transparent
        transition
         hover:bg-white/[0.06]
        font-neue
      "
    >
      {/* PROPERTY IMAGE */}
      <div className="relative w-full h-[220px] sm:h-[240px] overflow-hidden rounded-t-[6px]">
        <img
          src={image}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* VERIFIED BADGE */}
        {verified && (
          <div className="absolute left-4 top-4">
            <VerifiedBadge />
          </div>
        )}
      </div>

      {/* CONTENT */}
      <div className="px-4 sm:px-5 pt-6 sm:pt-7 pb-6 flex flex-col min-h-[171px]">

        {/* TITLE + PRICE */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-col gap-1">
            <h2 className="text-[21px] sm:text-[24px] font-light leading-tight text-white tracking-tight">
              {title}
            </h2>
            <div className="flex items-center gap-1.5">
              <PiMapPinLight className="text-[14px] text-white/80 shrink-0" />
              <span className="text-[14px] text-white/80 line-clamp-1">
                {location}
              </span>
            </div>
          </div>

          <h3 className="whitespace-nowrap text-[22px] sm:text-[26px] leading-tight">
            <span className=" font-neue font-medium text-white">{priceAmount}</span>
            <span className=" font-neue font-roman text-white">{pricePeriod}</span>
          </h3>
        </div>

        {/* DIVIDER */}
        <div className="mt-auto mb-4 h-[1px] bg-white/10" />

        {/* FEATURES */}
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <div className="flex items-center gap-1.5">
            <IoBedOutline className="text-[16px] text-white/70 shrink-0" />
            <span className="text-[13px] text-white/70">{beds} Beds</span>
          </div>
          <div className="flex items-center gap-1.5">
            <PiBathtub className="text-[16px] text-white/70 shrink-0" />
            <span className="text-[13px] text-white/70">{baths} Baths</span>
          </div>
          <div className="flex items-center gap-1.5">
            <GoZap className="text-[16px] text-white/70 shrink-0" />
            <span className="text-[13px] text-white/70">{power}</span>
          </div>
        </div>

      </div>
    </div>
  );
}

// HOW TO USE
{/* 
  <HomePagePropertyCard
    image={PropertyImage}
    title="3 Bedroom Flat"
    location="Lekki Phase 1, Lagos"
    priceAmount="₦4.5M"
    pricePeriod="/yr"
    beds={3}
    baths={3}
    power="24/7 Power"
    verified={true}
  />
*/}
