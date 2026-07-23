import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import ListingProgressBar from "../../components/listing/ListingProgressBar";
import ListPropertyForm from "../../components/listing/ListPropertyForm";
import ConfirmDialog from "../../components/ConfirmDialog";
import { createListing } from "../../utils/fn";

const CLOUD_NAME = "deyp75nnw";
const UPLOAD_PRESET = "capstones";
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

async function uploadFileToCloudinary(file) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  const res = await fetch(CLOUDINARY_UPLOAD_URL, {
    method: "POST",
    body: formData,
  });
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.error?.message || "File upload failed");
  }
  return data.secure_url;
}

// isReturningOwner: true when this owner has published before, so the form
// skips step 1 and asks for phone/WhatsApp instead. Wire this to your real
// auth/user data — left as a prop for now so nothing is assumed about how
// that's determined.
function ListProperty({ isReturningOwner = false }) {
  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");

  const [showLeaveDialog, setShowLeaveDialog] = useState(false);
  const [showPendingModal, setShowPendingModal] = useState(false);
  const [publishedListing, setPublishedListing] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Back arrow: returns to step 1 (owner setup) — no confirmation, since
  // nothing is being discarded, just navigated away from. Only shown for
  // first-timers; returning owners skip step 1 entirely.
  function handleBack() {
    navigate(-1);
  }

  // Cancel button: this is the one that discards the in-progress listing,
  // so it's the only trigger for the stay/leave dialog.
  function handleCancel() {
    setShowLeaveDialog(true);
  }

  function handleLeaveConfirm() {
    setShowLeaveDialog(false);
    navigate(-1);
  }

  function handleLeaveCancel() {
    setShowLeaveDialog(false);
  }

  // This is the onPublish callback — ListPropertyForm calls it with the
  // full, already-validated form object once "Publish listing" is clicked.
  async function handlePublish(formData) {
    setIsLoading(true);
    setError(null);
    try {
      const photoUrls = await Promise.all(
        formData.photos.map((p) => uploadFileToCloudinary(p.file))
      );
      const supportDocUrl = await uploadFileToCloudinary(formData.supportDoc.file);

      const payload = {
        title: formData.title,
        propertyType: formData.propertyType,
        amount: formData.price,
        description: formData.description,
        location: formData.address,
        state: formData.state,
        area: formData.area,
        bedrooms: formData.bedrooms,
        bathrooms: formData.bathrooms,
        amenities: formData.amenities,
        photos: photoUrls,
        supportDoc: supportDocUrl,
        ...(isReturningOwner && {
          phone: formData.phone,
          whatsapp: formData.whatsapp,
        }),
      };

      const response = await createListing(payload, token);

      // Shaped to match what MyListingCard/MyListings actually render —
      // a single `image` (not the full photos array), and `location` as
      // one display string, the same way INITIAL_LISTINGS is written.
      const listingForDisplay = {
        id: response?.id,
        image: photoUrls[0],
        title: formData.title,
        location: `${formData.area}, ${formData.state}`,
        price: formData.price,
      };

      if (isReturningOwner) {
        // Returning/verified owners go straight to the listing's own
        // details page — no verification step for them.
        navigate(`/my-listings/${response?.id}`, {
          state: { listing: { ...listingForDisplay, status: "published" } },
        });
      } else {
        // First-time listers see a "pending verification" modal before
        // being routed to My Listings — the listing isn't live yet.
        setPublishedListing({ ...listingForDisplay, status: "pending verification" });
        setShowPendingModal(true);
      }
    } catch (err) {
      console.error("Error submitting property data:", err);
      setError(
        err?.message ||
          "Something went wrong while publishing. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  }

  function handlePendingModalOk() {
    setShowPendingModal(false);
    // My Listings reads this from location.state and shows the new card
    // with a "pending verification" badge.
    navigate("/my-listings", { state: { newListing: publishedListing } });
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-1 px-[20px] py-[20px] pb-[120px]">
        <div className="max-w-[900px] mx-auto mb-[24px]">
          <ListingProgressBar currentStep={2} />
        </div>

        {error && (
          <p className="max-w-[900px] mx-auto mb-[16px] text-[14px] font-neue text-[#D85A30]">
            {error}
          </p>
        )}

        <ListPropertyForm
          showBackArrow={!isReturningOwner}
          showContactDetails={isReturningOwner}
          onBack={handleBack}
          onCancel={handleCancel}
          onPublish={handlePublish}
          loading={isLoading}
        />
      </main>

      <Footer />

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

      {showPendingModal && !isReturningOwner && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-[8px] max-w-[420px] w-full mx-[16px] p-[28px] text-center">
            <h2 className="text-[18px] font-neue font-medium text-[#1A1A1A] mb-[8px]">
              Listing submitted
            </h2>
            <p className="text-[14px] font-neue text-[#6B6B6B] mb-[24px]">
              Your listing is pending verification. Our team will review it and
              list it as soon as possible.
            </p>
            <button
              type="button"
              onClick={handlePendingModalOk}
              className="h-[46px] px-[28px] rounded-[6px] bg-accent text-white text-[14px] font-rethink font-medium hover:bg-[#e56e00] transition-colors"
            >
              Ok
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ListProperty;