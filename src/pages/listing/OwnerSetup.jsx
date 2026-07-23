import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import ListingProgressBar from "../../components/listing/ListingProgressBar";
import OwnerSetupForm from "../../components/listing/OwnerSetupForm";
import ConfirmDialog from "../../components/ConfirmDialog";

function OwnerSetupPage() {
  const navigate = useNavigate();

  const role = "seeker";

  const [showLeaveDialog, setShowLeaveDialog] = useState(false);
  const [pendingDestination, setPendingDestination] = useState(null);

  function requestLeave(destination = "/") {
    setPendingDestination(destination);
    setShowLeaveDialog(true);
  }

  function handleLeaveConfirm() {
    setShowLeaveDialog(false);
    navigate(pendingDestination || "/");
  }

  function handleLeaveCancel() {
    setShowLeaveDialog(false);
    setPendingDestination(null);
  }

  function handleContinue(formData) {
  console.log("Step 1 data:", formData);
  navigate("/list-property");
}

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <ListingProgressBar
        className="pb-[45px] pt-[55px]"
        currentStep={1}
        totalSteps={2}
        label="Property Owner Setup"
      />

      <main className="flex-1 px-[20px] py-[20px] pb-[120px]">
        <OwnerSetupForm
          onContinue={handleContinue}
          onCancel={() => requestLeave("/")}
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
    </div>
  );
}

export default OwnerSetupPage;
