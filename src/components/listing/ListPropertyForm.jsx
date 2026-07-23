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
  "Internet Availabilty", "Security", "Pool", "24/7 Power Supply",
  "Built-in Wadrobes", "Fitted Kitchen", "Water Heater", "CCTV Surveillance",
  "Gym", "Air Conditioning", "Elevator",
];

const SUPPORT_DOC_TYPES = [
  "Utility bill (showing property address)",
  "Land receipt/Property tax charge",
  "Authorization letter from property owner",
  "Tenancy agreement",
  "Ownership document (e.g. C of O, Deed of Assignment)",
];

const MAX_PHOTOS = 10;
const MAX_PHOTO_MB = 5;

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
  loading = false,
}) {
  const navigate = useNavigate();

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

  // Contact fields — only rendered for returning owners
  const [phone, setPhone] = useState(initialData.phone || "");
  const [whatsapp, setWhatsapp] = useState(initialData.whatsapp || "");

  // File uploads
  const [supportDoc, setSupportDoc] = useState(initialData.supportDoc || null);
  const [photos, setPhotos] = useState(initialData.photos || []);
  const supportDocRef = useRef(null);
  const photosRef = useRef(null);

  const baseValid =
    title.trim() && propertyType && price.trim() && description.trim() &&
    address.trim() && state && area.trim() &&
    bedrooms.toString().trim() && bathrooms.toString().trim() &&
    supportDoc && photos.length >= 3;

  const canPublish =
    baseValid && (showContactDetails ? phone.trim() : true) && !loading;

  function toggleAmenity(amenity) {
    setAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]
    );
  }

  function handleDocFile(file) {
    if (!file) return;
    setSupportDoc({ file, name: file.name, size: formatFileSize(file.size) });
  }

  function handleDocDrop(e) {
    e.preventDefault();
    handleDocFile(e.dataTransfer.files?.[0]);
  }

  function handlePhotoFiles(files) {
    const remaining = MAX_PHOTOS - photos.length;
    const toAdd = Array.from(files).slice(0, remaining).map((f) => ({
      file: f,
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

  // Photo grid: filled slots first, then one "add" slot (if under max), then empty placeholders
  const visiblePhotos = photos.slice(0, 3);
  const overflowCount = photos.length > 3 ? photos.length - 3 : 0;
  const gridSlotCount = Math.max(4, Math.min(photos.length + 1, MAX_PHOTOS));

  return (
    <div className="bg-white border border-[#C6C6C6]/40 shadow-md rounded-[4px] p-5 sm:p-8 lg:p-[48px] w-full max-w-[900px] mx-auto">

      {/* HEADING */}
      <div className="flex items-start sm:items-center gap-[12px] mb-[28px] sm:mb-[32px]">
        {showBackArrow && (
          <button
            onClick={() => (onBack ? onBack() : navigate(-1))}
            className="text-[#1A1A1A] hover:text-accent transition-colors"
            aria-label="Go back"
            type="button"
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
              className={`${inputCls} appearance-none pr-[36px] ${propertyType ? "" : "text-[#B0B0B0]"}`}
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
          placeholder="eg, 15, Adewale Street, Ifako,Gbagada,Lagos State Nigeria"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className={inputCls}
        />
      </div>

      {/* STATE + AREA */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-[16px] mb-[20px]">
        <div>
          <label className={labelCls}>State</label>
          <div className="relative">
            <select
              value={state}
              onChange={(e) => setState(e.target.value)}
              className={`${inputCls} appearance-none pr-[36px] ${state ? "" : "text-[#B0B0B0]"}`}
            >
              <option value="" disabled>Select here</option>
              {NIGERIAN_STATES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <ChevronDown />
          </div>
        </div>
        <div>
          <label className={labelCls}>Area</label>
          <input
            type="text"
            placeholder="e.g. Igbogbo"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            className={inputCls}
          />
        </div>
      </div>

      {/* BEDROOMS + BATHROOMS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-[16px] mb-[20px]">
        <div>
          <label className={labelCls}>Bedrooms</label>
          <input
            type="text"
            inputMode="numeric"
            placeholder="Specify here"
            value={bedrooms}
            onChange={(e) => setBedrooms(e.target.value)}
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>Bathrooms</label>
          <input
            type="text"
            inputMode="numeric"
            placeholder="Specify here"
            value={bathrooms}
            onChange={(e) => setBathrooms(e.target.value)}
            className={inputCls}
          />
        </div>
      </div>

      {/* AMENITIES */}
      <div className="mb-[28px]">
        <p className={labelCls}>Amenities</p>
        <div className="flex flex-wrap gap-[10px]">
          {ALL_AMENITIES.map((amenity) => {
            const selected = amenities.includes(amenity);
            return (
              <button
                key={amenity}
                type="button"
                onClick={() => toggleAmenity(amenity)}
                className={`h-[38px] px-[16px] rounded-[6px] text-[13px] font-neue transition-colors border ${
                  selected
                    ? "bg-[#1A1A1A] border-[#1A1A1A] text-white"
                    : "bg-white border-[#E8E8E8] text-[#6B6B6B] hover:border-[#C6C6C6]"
                }`}
              >
                {amenity}
              </button>
            );
          })}
        </div>
      </div>

      {/* SUPPORTING DOCUMENT */}
      <div className="mb-[28px]">
        <p className={labelCls}>Upload a supporting document</p>
        <p className="text-[13px] font-neue text-[#6B6B6B] mb-[8px]">
          Upload any one of the following documents as proof of your right to list this property:
        </p>
        <ul className="mb-[14px] pl-[18px] list-disc text-[13px] font-neue text-[#8A8A8A] space-y-[2px]">
          {SUPPORT_DOC_TYPES.map((doc) => (
            <li key={doc}>{doc}</li>
          ))}
        </ul>

        {supportDoc ? (
          <div className="flex items-center justify-between border border-[#E8E8E8] rounded-[6px] px-[16px] py-[14px]">
            <div className="flex items-center gap-[12px]">
              <div className="w-[36px] h-[36px] rounded-[6px] bg-[#F5F5F5] flex items-center justify-center text-[#6B6B6B]">
                <RiFileTextLine size={18} />
              </div>
              <div>
                <p className="text-[14px] font-neue text-[#1A1A1A]">{supportDoc.name}</p>
                <p className="text-[12px] font-neue text-[#8A8A8A]">Uploaded · {supportDoc.size}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setSupportDoc(null)}
              className="text-[#B0B0B0] hover:text-[#D85A30] transition-colors"
              aria-label="Remove document"
            >
              <RiDeleteBinLine size={18} />
            </button>
          </div>
        ) : (
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDocDrop}
            onClick={() => supportDocRef.current?.click()}
            className="border border-dashed border-[#D8D8D8] rounded-[6px] py-[36px] flex flex-col items-center justify-center gap-[8px] cursor-pointer hover:border-[#B0B0B0] transition-colors"
          >
            <RiUploadCloud2Line size={22} className="text-[#8A8A8A]" />
            <p className="text-[14px] font-neue text-[#1A1A1A]">
              <span className="font-medium">Choose file</span>
              <span className="text-[#8A8A8A]"> or drag and drop</span>
            </p>
            <p className="text-[12px] font-neue text-[#B0B0B0]">PDF, JPG, PNG (Max {MAX_PHOTO_MB}MB)</p>
            <input
              ref={supportDocRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              className="hidden"
              onChange={(e) => handleDocFile(e.target.files?.[0])}
            />
          </div>
        )}
      </div>

      {/* PROPERTY PHOTOS */}
      <div className="mb-[28px]">
        <p className={labelCls}>Property photos</p>
        <p className="text-[13px] font-neue text-[#6B6B6B] mb-[14px]">
          Upload at least 3 photos. More pictures lead to more enquiries.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-[12px]">
          {visiblePhotos.map((photo, index) => {
            const isThirdWithOverflow = index === 2 && overflowCount > 0;
            return (
              <div
                key={index}
                className="relative aspect-square rounded-[6px] overflow-hidden border border-[#E8E8E8] group"
              >
                <img
                  src={photo.previewUrl}
                  alt={photo.name || `Property photo ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                {isThirdWithOverflow && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="text-white text-[22px] font-medium">+{overflowCount}</span>
                  </div>
                )}
                {!isThirdWithOverflow && (
                  <button
                    type="button"
                    onClick={() => removePhoto(index)}
                    aria-label="Remove photo"
                    className="absolute top-[6px] right-[6px] w-[22px] h-[22px] rounded-full bg-black/50 text-white text-[12px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ×
                  </button>
                )}
              </div>
            );
          })}

          {photos.length < MAX_PHOTOS && (
            <button
              type="button"
              onClick={() => photosRef.current?.click()}
              className="aspect-square rounded-[6px] border border-dashed border-[#D8D8D8] flex items-center justify-center text-[#B0B0B0] hover:border-[#B0B0B0] hover:text-[#8A8A8A] transition-colors"
              aria-label="Add photos"
            >
              <RiAddLine size={24} />
            </button>
          )}

          {Array.from({ length: Math.max(0, 4 - visiblePhotos.length - 1) }).map((_, i) => (
            <div key={`empty-${i}`} className="aspect-square rounded-[6px] border border-dashed border-[#EFEFEF]" />
          ))}
        </div>

        <input
          ref={photosRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handlePhotoFiles(e.target.files)}
        />

        <p className="mt-[12px] text-[13px] font-neue text-[#8A8A8A]">
          {photos.length} of {MAX_PHOTOS} media uploaded
        </p>
      </div>

      {/* CONTACT DETAILS — returning owners only */}
      {showContactDetails && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-[16px] mb-[20px]">
          <div>
            <label className={labelCls}>Phone number</label>
            <input
              type="tel"
              placeholder="e.g. 0803 000 0000"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>WhatsApp number (optional)</label>
            <input
              type="tel"
              placeholder="e.g. 0803 000 0000"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              className={inputCls}
            />
          </div>
        </div>
      )}

      <div className="border-t border-[#c6c6c6]/40 mt-8 mb-4 pt-4 flex gap-3"></div>

      {/* BUTTONS */}
      <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-end gap-[12px]">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="w-full sm:w-auto h-[46px] px-[28px] border border-[#E8E8E8] rounded-[6px] text-[14px] font-rethink font-medium text-[#1A1A1A] hover:bg-[#F5F5F5] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handlePublish}
          disabled={!canPublish}
          className={`w-full sm:w-auto h-[46px] px-[28px] rounded-[6px] text-[14px] font-rethink font-medium transition-colors ${
            canPublish
              ? "bg-accent text-white hover:bg-[#e56e00]"
              : "bg-[#E8E8E8] text-[#B0B0B0] cursor-not-allowed"
          }`}
        >
          {loading ? "Publishing..." : "Publish listing"}
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