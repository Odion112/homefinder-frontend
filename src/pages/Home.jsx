import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import HomePagePropertyCard from "../components/HomePagePropertyCard";
import FeatureCard from "../components/FeatureCard";
import AboutUs from "../components/AboutUs";

// Hero
import heroImage from "../assets/images/hero-house.svg";

// "You May Also Like" property cards 
import Property1 from "../assets/images/property1.svg";
import Property2 from "../assets/images/property2.svg";
import Property3 from "../assets/images/property3.svg";
import Property4 from "../assets/images/property4.svg";
import Property5 from "../assets/images/property5.svg";
import Property6 from "../assets/images/property6.svg";

// "How HomeFinder Works" image
import howItWorksGallery from "../assets/images/how-it-works-gallery.svg";

// Feature icons
import exploreIcon from "../assets/icons/explore-icon.svg";
import infoIcon from "../assets/icons/info-icon.svg";
import connectIcon from "../assets/icons/connect-icon.svg";
import listIcon from "../assets/icons/list-icon.svg";

// CTA banner
import ctaBanner from "../assets/images/cta-banner.svg";
import { useContext, useEffect } from "react";
import { getProfile } from "../utils/fn";
import { TokenContext } from "../context/TokenContext";
import { ProfileContext } from "../context/ProfileContext";
import { useQueryClient } from "@tanstack/react-query";

// You May Also Like 
const similarListings = [
  {
    id: 1,
    image: Property1,
    title: "3 Bedroom Flat",
    location: "Lekki Phase 1, Lagos",
    priceAmount: "₦4.5M",
    pricePeriod: "/yr",
    beds: 3,
    baths: 3,
    power: "24/7 Power",
  },
  {
    id: 2,
    image: Property2,
    title: "2 Bedroom Apartment",
    location: "Ikoyi, Lagos",
    priceAmount: "₦3.2M",
    pricePeriod: "/yr",
    beds: 2,
    baths: 2,
    power: "24/7 Power",
  },
  {
    id: 3,
    image: Property3,
    title: "4 Bedroom Duplex",
    location: "Ajah, Lagos",
    priceAmount: "₦6M",
    pricePeriod: "/yr",
    beds: 4,
    baths: 4,
    power: "Solar + Grid",
  },
  {
    id: 4,
    image: Property4,
    title: "Studio Apartment",
    location: "Yaba, Lagos",
    priceAmount: "₦1.8M",
    pricePeriod: "/yr",
    beds: 1,
    baths: 1,
    power: "12hrs Power",
  },
  {
    id: 5,
    image: Property5,
    title: "5 Bedroom Duplex",
    location: "Banana Island, Lagos",
    priceAmount: "₦12M",
    pricePeriod: "/yr",
    beds: 5,
    baths: 5,
    power: "24/7 Power",
  },
  {
    id: 6,
    image: Property6,
    title: "1 Bedroom Mini Flat",
    location: "Surulere, Lagos",
    priceAmount: "₦1.2M",
    pricePeriod: "/yr",
    beds: 1,
    baths: 1,
    power: "16hrs Power",
  },
];

export default function HomePage() {

  const tokenPayload = useContext(TokenContext)
  const profilePayload = useContext(ProfileContext)

  const queryClient = useQueryClient()
  const profile = queryClient.getQueryData(['profile'])

  console.log(profile)


  return (
    <div className="bg-[#FDFDFD]">
      <Navbar />

      {/* HERO */}
      <section className="px-5 sm:px-8 lg:px-[60px] pt-5 lg:pt-8">
        <div className="relative h-[430px] sm:h-[500px] lg:h-[570px] rounded-[6px] overflow-hidden">
          <img
            src={heroImage}
            alt="Modern house exterior"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/65" />

          <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-5 sm:px-6">
            <h1 className="font-neue text-white text-[38px] sm:text-[46px] lg:text-[56px] leading-[1.1] max-w-[760px]">
              Find your next house, not another agent
            </h1>
            <p className="mt-5 sm:mt-6 font-rethink text-white/90 text-[16px] sm:text-[18px] leading-[26px] sm:leading-[28px] max-w-[480px]">
              Browse available rental properties and connect directly with
              landlords to make finding a place simpler.
            </p>
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <AboutUs />

      {/* YOU MAY ALSO LIKE */}
      <section className="bg-[#0E0D0C] px-5 sm:px-8 lg:px-[60px] py-16 lg:py-[100px]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <h2 className="font-neue text-white text-[28px] sm:text-[34px]">
             Explore What's Available
            </h2>
            <p className="mt-2 font-neue font-light text-white/60 text-[16px]">
              A glimpse at houses currently listed on HomeFinder
            </p>
          </div>

          <Link
            to="/properties"
            className="flex items-center gap-2 border border-white/30 rounded-sm px-6 py-3 text-white font-rethink text-[16px] hover:bg-white/10 transition"
          >
            Explore properties <span aria-hidden>→</span>
          </Link>
        </div>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-7.5">
          {similarListings.map((listing) => (
            <HomePagePropertyCard
              key={listing.id}
              image={listing.image}
              title={listing.title}
              location={listing.location}
              priceAmount={listing.priceAmount}
              pricePeriod={listing.pricePeriod}
              beds={listing.beds}
              baths={listing.baths}
              power={listing.power}
              verified
            />
          ))}
        </div>
      </section>

      {/* HOW HOMEFINDER WORKS */}
      <section className="px-5 sm:px-8 lg:px-[60px] py-16 lg:py-[120px]">
        <div className="flex flex-col lg:flex-row items-start gap-10 lg:gap-[80px]">

          {/* GALLERY — single composite image */}
          <img
            src={howItWorksGallery}
            alt="Showcase of homes available on HomeFinder"
            className="w-full max-w-[560px] shrink-0"
          />

          {/* STEPS */}
          <div className="flex-1 pt-2">
            <h2 className="font-neue text-[28px] sm:text-[34px] text-[#0E0D0C]">
              How HomeFinder Works
            </h2>
            <p className="mt-4 font-neue font-roman text-[16px] leading-[26px] text-[#696262] max-w-[520px]">
              Explore rental listings, discover property details that
              matter, and connect directly with landlords without the usual
              back and forth.
            </p>

            <div className="mt-10 lg:mt-12 flex flex-col gap-8 lg:gap-10">
              <FeatureCard
                icon={exploreIcon}
                title="Explore available rental properties"
                description="Browse listings based on your preferred location, budget, and property type."
              />
              <FeatureCard
                icon={infoIcon}
                title="View clearer property information"
                description="See property details, photos, amenities, and supporting information before reaching out."
              />
              <FeatureCard
                icon={connectIcon}
                title="Connect directly with property owners"
                description="Reduce unnecessary back and forth and communicate more easily with landlords."
              />
              <FeatureCard
                icon={listIcon}
                title="List a property"
                description="Property owners can upload listings and showcase available spaces to people actively searching."
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="px-5 sm:px-8 lg:px-[60px] pb-16 lg:pb-[100px]">
        <div className="relative min-h-[300px] lg:h-[280px] rounded-[6px] overflow-hidden">
          <img
            src={ctaBanner}
            alt="Modern house interior"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60" />

          <div className="relative z-10 h-full min-h-[300px] lg:min-h-0 flex flex-col justify-center px-6 sm:px-10 lg:px-12 py-10">
            <h2 className="font-neue font-roman text-white text-[28px] sm:text-[34px] leading-[1.2] max-w-[420px]">
              Are you a house owner? List your property for free
            </h2>
            <Link
              to={profile ? "/owner-setup" : "/sign-in"}
              className="mt-8 bg-accent text-surface w-[169px] h-[46px] rounded-xs text-[18px] font-rethink font-regular flex items-center justify-center"
            >
              List property
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
