import logo from "../assets/images/white-logo.svg";
import wordmark from "../assets/images/faded-logo.svg";
import { GoArrowUp } from "react-icons/go";

export default function Footer() {
  // Scroll page back to top
  const handleScrollTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer
      className="
        relative
        min-h-[560px]
        lg:h-[694px]
        bg-black
        overflow-hidden
        text-white
      "
    >
      {/* Main content */}
      <div className="relative z-10 h-full px-5 sm:px-8 md:px-16 pt-14 lg:pt-20 pb-32 lg:pb-0">

        <div className="flex flex-col lg:flex-row gap-14 lg:gap-10 justify-between h-full">

         {/* LEFT SECTION */}
<div className="flex flex-col gap-4">

  {/* Logo */}
  <img
    src={logo}
    alt="Home Finder"
    className="w-[210px] sm:w-[260px]"
  />

  {/* Navigation links */}
  <div
    className="
      mt-10 lg:mt-[50px]
      font-neue
      font-medium
      text-[18px] sm:text-[20px]
      text-[#C6C6C6]
      

    "
  >

    {/* First Row */}
    <div className="flex flex-wrap items-center gap-x-4 sm:gap-x-6 gap-y-3">

      <a  className="hover:text-[#C6C6C6]/60" href="/search">Search</a>

      <span className="text-[#3C403C]/70">/</span>

      <a className="hover:text-[#C6C6C6]/60" href="/properties">Properties</a>

      <span className="text-[#3C403C]/70">/</span>

      <a className="hover:text-[#C6C6C6]/60" href="/about">About</a>

      <span className="text-[#3C403C]/70">/</span>

    </div>

    {/* Second Row */}
    <div className="mt-[4px] hover:text-[#C6C6C6]/60 ">
      <a href="/list-property">
        List Property
      </a>
    </div>

  </div>

</div>

          {/* RIGHT SECTION */}
          <div className="relative flex flex-col gap-10 lg:gap-16">

            {/* Contact */}
            <div className="space-y-10 lg:space-y-14">

              {/* Contact label + number */}
              <div>

                <p
                  className="
                    font-rethink
                    font-medium
                    text-[14px]
                    text-[#696262]
                  "
                >
                  Contact Us
                </p>

                <h2
                  className="
                    mt-3
                    font-neue
                    font-roman
                    text-[22px]
                    sm:text-[28px]
                    leading-tight
                  "
                >
                  (+234 7016 622509)
                </h2>

              </div>

              {/* Email + Socials */}
              <div className="flex flex-col sm:flex-row gap-8 sm:gap-16 lg:gap-[120px]">

                {/* Email */}
                <div>

                  <p className="font-medium font-rethink text-[#696262] text-[14px]">
                    Email
                  </p>

                  <a
                    href="mailto:hello@logoipsum.com"
                    className="
                      mt-2
                      block
                      font-rethink
                      font-medium
                      text-[16px]
                      text-[#C6C6C6]
                    "
                  >
                    hello@logoipsum.com
                  </a>

                </div>

                {/* Socials */}
                <div>

                  <p className="font-medium font-rethink text-[#696262] text-[14px]">
                    Follow Us
                  </p>

                  <div
                    className="
                      mt-2
                      flex
                      flex-col
                      gap-2
                      font-rethink
                      font-medium
                      text-[16px]
                      text-[#C6C6C6]
                    "
                  >
                    <a href="#">Facebook</a>

                    <a href="#">Instagram</a>

                    <a href="#">X</a>

                  </div>

                </div>

              </div>

            </div>

            {/* Copyright */}
            <p
              className="
                lg:absolute
                lg:bottom-[257px]
                lg:left-0
                font-rethink
                font-medium
                text-[16px]
                text-[#696262]
              "
            >
              © 2026 — Copyright
            </p>

          </div>
        </div>

        {/* Scroll To Top Button */}
        <button
          onClick={handleScrollTop}
          aria-label="Scroll to top"
          className="
            absolute
            left-5
            sm:left-8
            lg:left-16
            bottom-20
            lg:bottom-[248px]
            w-[44px]
            h-[44px]
            rounded-full
            border
            border-white/20
            flex
            items-center
            justify-center
            hover:border-white
            transition
          "
        >
          <GoArrowUp className="h-6 w-8" />
        </button>

      </div>

      {/* Faded wordmark */}
      <div
        className="
          absolute
          bottom-0
          left-0
          w-full
          z-0
          pointer-events-none
          flex
          justify-center
        "
      >
        <img
          src={wordmark}
          alt=""
          className="
            w-full
            select-none
          "
        />
      </div>

    </footer>
  );
}
