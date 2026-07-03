import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { RiCloseLine, RiCheckLine, RiArrowLeftLine } from "react-icons/ri";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import ListingProgressBar from "../../components/listing/ListingProgressBar";
import ListPropertyForm from "../../components/listing/ListPropertyForm";
import ConfirmDialog from "../../components/ConfirmDialog";
import Button from "../../components/Button";
import { createListing } from "../../utils/fn";

// Replace with real user email from auth context
const MOCK_USER_EMAIL = "johndoe@email.com";

const CLOUD_NAME = "deyp75nnw"
const UPLOAD_PRESET = "capstones"
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

async function uploadImageToCloudinary(file) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  const res = await fetch(CLOUDINARY_UPLOAD_URL, {
    method: "POST",
    body: formData,
  });
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.error?.message || "Image upload failed");
  }
  return data.secure_url;
}

const inputCls =
  "w-full h-[48px] border border-[#E8E8E8] rounded-[6px] px-[14px] text-[14px] font-neue text-[#1A1A1A] placeholder:text-[#B0B0B0] focus:outline-none focus:border-accent transition-colors";

const labelCls =
  "block text-[14px] font-neue font-roman text-[#1A1A1A] mb-[8px]";

const PROPERTY_TYPES = [
  "apartment",
  "self-contained",
  "duplex",
  "bungalow",
  "room&parlour",
  "office space",
];

const MAX_PHOTOS = 1;

function ChevronDown() {
  return (
    <svg
      className="absolute right-[14px] top-1/2 -translate-y-1/2 pointer-events-none"
      width="14" height="14" viewBox="0 0 14 14" fill="none"
    >
      <path
        d="M3 5L7 9L11 5"
        stroke="#6B6B6B" strokeWidth="1.5"
        strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  );
}

function ListProperty() {
  const navigate = useNavigate();

  const token = sessionStorage.getItem("token");

  const [showLeaveDialog, setShowLeaveDialog] = useState(false);
  const [pendingDestination, setPendingDest] = useState(null);
  const [showPendingModal, setShowPendingModal] = useState(false);

  const [addPropertyData, setAddPropertyData] = useState({
    title: "",
    propertyType: "",
    amount: "",
    description: "",
    location: "",
    photo: null
  })



  function handleLeaveConfirm() {
    setShowLeaveDialog(false);
    navigate(pendingDestination);
  }

  function handleLeaveCancel() {
    setShowLeaveDialog(false);
    setPendingDest(null);
  }



  const [isLoading, setIsLoading] = useState(false);


  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (!addPropertyData.photo) {
        const imageUrl = await uploadImageToCloudinary(addPropertyData.photo);
        setAddPropertyData({ ...addPropertyData, photo: imageUrl })
        const response = await createListing(addPropertyData, token)
        console.log(response)
      }
    } catch (error) {
      console.error("Error submitting property data:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-1 px-[20px] py-[20px] pb-[120px]">
        {/* HEADING */}
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-[#C6C6C6]/40 shadow-md rounded-[4px] p-5 sm:p-8 lg:p-[48px] w-full max-w-[900px] mx-auto">

          <div className="flex items-start sm:items-center gap-[12px] mb-[28px] sm:mb-[32px]">

            <button
              onClick={() => navigate(-1)}
              className="text-[#1A1A1A] hover:text-accent transition-colors"
              aria-label="Go back"
              type="button"
              disabled={isLoading}
            >
              <RiArrowLeftLine size={20} />
            </button>

            <h1 className="text-[24px] sm:text-[28px] font-neue font-medium text-[#1A1A1A] leading-tight">
              Tell us about your property
            </h1>
          </div>

          {/* PROPERTY TITLE */}
          <div className="mb-[20px]">
            <label className={labelCls}>Property title</label>
            <input
              type="text"
              placeholder="e.g. 2-bedroom flat"
              value={addPropertyData.title}
              onChange={(e) => setAddPropertyData({ ...addPropertyData, title: e.target.value })}
              className={inputCls}
              required
            />
          </div>

          {/* TYPE + PRICE */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-[16px] mb-[20px]">
            <div>
              <label className={labelCls}>Property type</label>
              <div className="relative">
                <select
                  value={addPropertyData.propertyType}
                  required
                  onChange={(e) => setAddPropertyData({ ...addPropertyData, propertyType: e.target.value })}
                  className={`${inputCls} appearance-none pr-[36px]`

                  }
                >
                  <option value="" disabled>Select here</option>
                  {PROPERTY_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
                <ChevronDown />
              </div>
            </div>
            <div>
              <label className={labelCls}>Price (₦ / year)</label>
              <input
                type="text"
                placeholder="e.g. 800,000"
                value={addPropertyData.amount}
                onChange={(e) => setAddPropertyData({ ...addPropertyData, amount: e.target.value })}
                className={inputCls}
                required

              />
            </div>
          </div>

          {/* DESCRIPTION */}
          <div className="mb-[20px]">
            <label className={labelCls}>Description</label>
            <textarea
              placeholder="Well-maintained flat with 24hr electricity..."
              value={addPropertyData.description}
              onChange={(e) => setAddPropertyData({ ...addPropertyData, description: e.target.value })}
              rows={4}
              className="w-full border border-[#E8E8E8] rounded-[6px] px-[14px] py-[12px] text-[14px] font-neue text-[#1A1A1A] placeholder:text-[#B0B0B0] focus:outline-none focus:border-accent transition-colors resize-none"
            />
          </div>

          {/* ADDRESS */}
          <div className="mb-[20px]">
            <label className={labelCls}>Property Location</label>
            <input
              type="text"
              placeholder="eg. 15, Adewale Street, Ifako, Gbagada, Lagos State Nigeria"
              value={addPropertyData.location}
              onChange={(e) => setAddPropertyData({ ...addPropertyData, location: e.target.value })}
              className={inputCls}
              required

            />
          </div>

          {/* PROPERTY PHOTOS */}
          <div className="mb-[28px]">
            <p className={labelCls}>Property photo</p>
            <input
              type="file"
              accept="image/*"
              onChange={e => setAddPropertyData({ ...addPropertyData, photo: e.target.files[0] })}
              multiple={false}
              className={`file:mr-[12px] file:bg-[#F5F5F5] file:border file:border-[#E8E8E8] file:text-[14px] file:font-rethink`}
            />
          </div>

          {/* BUTTONS */}
          <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-end gap-[12px]">
            <button
              type="button"
              disabled={isLoading}
              onClick={() => navigate(-1)}
              className="w-full sm:w-auto h-[46px] px-[28px] border border-[#E8E8E8] rounded-[6px] text-[14px] font-rethink font-medium text-[#1A1A1A] hover:bg-[#F5F5F5] transition-colors"
            >
              Cancel
            </button>
            <Button
              type="submit"
              loading={isLoading}
              disabled={isLoading}
            >
              Publish listing
            </Button>

          </div>
        </form>
      </main>

      <Footer />

      {/*Leave listing dialog  */}
      {showLeaveDialog && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <ConfirmDialog
            title="Leave listing?"
            message="Your changes won't be saved."
            cancelLabel="Stay"
            confirmLabel="Leave"
            confirmColor="#FE7C0B"
            onCancel={handleLeaveCancel}
            onConfirm={handleLeaveConfirm}
          />
        </div>
      )}

    </div>
  );
}

export default ListProperty;