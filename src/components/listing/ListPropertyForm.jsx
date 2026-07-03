import { useState, useRef } from "react";
import {
  RiArrowLeftLine,
  RiUploadCloud2Line,
  RiFileTextLine,
  RiDeleteBinLine,
  RiAddLine,
} from "react-icons/ri";
import { useNavigate } from "react-router-dom";


const PROPERTY_TYPES = [
  "apartment",
  "self-contained",
  "duplex",
  "bungalow",
  "room&parlour",
  "office space",
];

const NIGERIAN_STATES = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa",
  "Benue", "Borno", "Cross River", "Delta", "Ebonyi", "Edo",
  "Ekiti", "Enugu", "FCT", "Gombe", "Imo", "Jigawa",
  "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara",
  "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo", "Osun",
  "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara",
];

const ALL_AMENITIES = [
  "Parking Space", "POP Ceiling", "Running Water", "Good Access Roads",
  "Internet Availability", "Security", "Pool", "24/7 Power Supply",
  "Built-in Wardrobes", "Fitted Kitchen", "Water Heater", "CCTV Surveillance",
  "Gym", "Air Conditioning", "Elevator",
];

const SUPPORT_DOC_TYPES = [
  "Utility bill (showing property address)",
  "Land receipt/Property tax charge",
  "Authorization letter from property owner",
  "Tenancy agreement",
  "Ownership document (e.g. C of O, Deed of Assignment)",
];

const MAX_PHOTOS = 1;

function formatFileSize(bytes) {
  if (bytes >= 1_000_000) return `${(bytes / 1_000_000).toFixed(1)} MB`;
  if (bytes >= 1_000) return `${Math.round(bytes / 1_000)} KB`;
  return `${bytes} B`;
}

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


const inputCls =
  "w-full h-[48px] border border-[#E8E8E8] rounded-[6px] px-[14px] text-[14px] font-neue text-[#1A1A1A] placeholder:text-[#B0B0B0] focus:outline-none focus:border-accent transition-colors";

const labelCls =
  "block text-[14px] font-neue font-roman text-[#1A1A1A] mb-[8px]";



function ListPropertyForm({
  onPublish,
  onCancel,
  onBack,
  initialData = {},
  showBackArrow = true,
  showContactDetails = false,
}) {

  const navigate = useNavigate()
  // Form fields
  const [title, setTitle] = useState(initialData.title || "");
  const [propertyType, setPropertyType] = useState(initialData.propertyType || "");
  const [price, setPrice] = useState(initialData.price || "");
  const [description, setDescription] = useState(initialData.description || "");
  const [address, setAddress] = useState(initialData.address || "");
  const [state, setState] = useState(initialData.state || "");
  const [area, setArea] = useState(initialData.area || "");
  const [bedrooms, setBedrooms] = useState(initialData.bedrooms || "");
  const [bathrooms, setBathrooms] = useState(initialData.bathrooms || "");
  const [amenities, setAmenities] = useState(initialData.amenities || []);
  const [photo, setPhoto] = useState(null)

  // Contact fields — only rendered for returning owners
  const [phone, setPhone] = useState(initialData.phone || "");
  const [whatsapp, setWhatsapp] = useState(initialData.whatsapp || "");

  // File uploads
  const [supportDoc, setSupportDoc] = useState(initialData.supportDoc || null);
  const [photos, setPhotos] = useState(initialData.photos || []);
  const supportDocRef = useRef(null);
  const photosRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null;
    setPhoto(file);
  };


  const baseValid =
    title.trim() && propertyType && price.trim() && description.trim() &&
    address.trim() && state && area.trim() &&
    bedrooms.toString().trim() && bathrooms.toString().trim() &&
    supportDoc && photos.length >= 3;

  const canPublish = baseValid && (showContactDetails ? phone.trim() : true);



  function toggleAmenity(amenity) {
    setAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]
    );
  }

  function handleDocFile(file) {
    if (!file) return;
    setSupportDoc({ name: file.name, size: formatFileSize(file.size) });
  }

  function handlePhotoFiles(files) {
    const remaining = MAX_PHOTOS - photos.length;
    const toAdd = Array.from(files).slice(0, remaining).map((f) => ({
      name: f.name,
      previewUrl: URL.createObjectURL(f),
    }));
    setPhotos((prev) => [...prev, ...toAdd]);
  }

  function removePhoto(index) {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  }

  function handlePublish() {
    if (!canPublish) return;
    onPublish?.({
      title, propertyType, price, description,
      address, state, area, bedrooms, bathrooms,
      amenities, supportDoc, photos,
      ...(showContactDetails && { phone, whatsapp }),
    });
  }

  // Photo grid 
  const visiblePhotos = photos.slice(0, 3);
  const overflowCount = photos.length > 3 ? photos.length - 3 : 0;


  return (
    <div className="bg-white border border-[#C6C6C6]/40 shadow-md rounded-[4px] p-5 sm:p-8 lg:p-[48px] w-full max-w-[900px] mx-auto">

      {/* HEADING */}
      <div className="flex items-start sm:items-center gap-[12px] mb-[28px] sm:mb-[32px]">
        {showBackArrow && (
          <button
            onClick={() => navigate(-1)}
            className="text-[#1A1A1A] hover:text-accent transition-colors"
            aria-label="Go back"
          >
            <RiArrowLeftLine size={20} />
          </button>
        )}
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
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={inputCls}
        />
      </div>

      {/* TYPE + PRICE */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-[16px] mb-[20px]">
        <div>
          <label className={labelCls}>Property type</label>
          <div className="relative">
            <select
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
              className={`${inputCls} appearance-none pr-[36px]`}
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
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className={inputCls}
          />
        </div>
      </div>

      {/* DESCRIPTION */}
      <div className="mb-[20px]">
        <label className={labelCls}>Description</label>
        <textarea
          placeholder="Well-maintained flat with 24hr electricity..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="w-full border border-[#E8E8E8] rounded-[6px] px-[14px] py-[12px] text-[14px] font-neue text-[#1A1A1A] placeholder:text-[#B0B0B0] focus:outline-none focus:border-accent transition-colors resize-none"
        />
      </div>

      {/* ADDRESS */}
      <div className="mb-[20px]">
        <label className={labelCls}>Actual house address</label>
        <input
          type="text"
          placeholder="eg. 15, Adewale Street, Ifako, Gbagada, Lagos State Nigeria"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className={inputCls}
        />
      </div>


      {/* PROPERTY PHOTOS */}
      <div className="mb-[28px]">
        <p className={labelCls}>Property photos</p>
        <p className="text-[13px] font-neue text-[#6B6B6B] mb-[14px]">
          Upload a photo of the property.
        </p>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
        />
      </div>


      <div className="border-t border-[#c6c6c6]/40 mt-8 mb-4 pt-4 flex gap-3"></div>

      {/* BUTTONS */}
      <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-end gap-[12px]">
        <button
          onClick={onCancel}
          className="w-full sm:w-auto h-[46px] px-[28px] border border-[#E8E8E8] rounded-[6px] text-[14px] font-rethink font-medium text-[#1A1A1A] hover:bg-[#F5F5F5] transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handlePublish}
          disabled={!canPublish}
          className={`w-full sm:w-auto h-[46px] px-[28px] rounded-[6px] text-[14px] font-rethink font-medium transition-colors ${canPublish
            ? "bg-accent text-white hover:bg-[#e56e00]"
            : "bg-[#E8E8E8] text-[#B0B0B0] cursor-not-allowed"
            }`}
        >
          Publish listing
        </button>
      </div>

    </div>
  );
}

export default ListPropertyForm;


// Used in TWO contexts — controlled by props:
//
//   First-time lister (Step 2 of onboarding):
//     <ListPropertyForm showBackArrow={true} showContactDetails={false} onBack={fn} />
//
//   Returning owner (skips Step 1):
//     <ListPropertyForm showBackArrow={false} showContactDetails={true} initialData={{ phone, whatsapp }} />
