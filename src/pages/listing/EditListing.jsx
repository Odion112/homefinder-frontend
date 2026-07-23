import { useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { RiArrowLeftLine } from "react-icons/ri";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import ListPropertyForm from "../../components/listing/ListPropertyForm";
import ConfirmDialog from "../../components/ConfirmDialog";
import NotificationPopup from "../../components/NotificationPopup";

function EditListing() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  // Where to return to once editing is done — set by whichever page
  // linked here (My Listings grid or that listing's details page).
  const returnTo = location.state?.from || "/my-listings";
  const breadcrumbLabel = returnTo === "/my-listings" ? "My Listings" : "Listing details";

  // Listing data passed in for prefilling the form.
  // Replace with a real fetch-by-id once the backend endpoint exists.
  const listing = location.state?.listing || {
    id,
    title: "",
    location: "",
  };

  const ownerProfile = {
    phone: "+234 801 234 5678",
    whatsapp: "+234 801 234 5678",
  };

  const [showLeaveDialog, setShowLeaveDialog] = useState(false);
  const [pendingDestination, setPendingDest] = useState(null);
  const [notification, setNotification] = useState(null);

  function requestLeave(destination = returnTo) {
    setPendingDest(destination);
    setShowLeaveDialog(true);
  }

  function handleLeaveConfirm() {
    setShowLeaveDialog(false);
    navigate(pendingDestination || returnTo);
  }

  function handleLeaveCancel() {
    setShowLeaveDialog(false);
    setPendingDest(null);
  }

  function handleSaveChanges(formData) {
    // TODO: PATCH formData to backend
    console.log("Updated listing data:", listing.id, formData);
    setNotification("Changes saved");
  }

  function handleNotificationClose() {
    setNotification(null);
    navigate(returnTo);
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      {/* Breadcrumb */}
      <div className="px-[150px] pb-[30px] pt-[55px]">
        <div className="flex items-center gap-[8px]">
          <button
            onClick={() => requestLeave(returnTo)}
            className="text-[#6B6B6B] hover:text-accent transition-colors"
            aria-label="Go back"
          >
            <RiArrowLeftLine size={16} />
          </button>
          {/* Link intercepted — triggers leave guard instead of navigating directly */}
          <button
            onClick={() => requestLeave(returnTo)}
            className="text-[14px] font-rethink text-[#6B6B6B] hover:text-accent transition-colors"
          >
            {breadcrumbLabel}
          </button>
          <span className="text-[14px] font-rethink text-[#C6C6C6]">/</span>
          <span className="text-[14px] font-rethink font-medium text-[#1A1A1A]">
            Edit listing
          </span>
        </div>
      </div>

      <main className="flex-1 px-[20px] py-[20px] pb-[120px]">
        <ListPropertyForm
          onPublish={handleSaveChanges}
          publishLabel="Save changes"
          onCancel={() => requestLeave(returnTo)}
          showBackArrow={false}
          showContactDetails={true}
          initialData={{
            title: listing.title,
            location: listing.location,
            phone: ownerProfile.phone,
            whatsapp: ownerProfile.whatsapp,
          }}
        />
      </main>

      <Footer />

      {/* Leave listing dialog */}
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

      {/* Success toast */}
      {notification && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
          <NotificationPopup
            message={notification}
            onClose={handleNotificationClose}
          />
        </div>
      )}
    </div>
  );
}

export default EditListing;