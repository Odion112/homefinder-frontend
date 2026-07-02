function ListingProgressBar({
  currentStep = 1,
  totalSteps = 2,
  label = "",
  className = "",
}) {
  return (
    <div
      className={`w-full max-w-[1017px] px-5 sm:px-8 lg:px-[60px] pt-[32px] pb-[24px] mx-auto ${className}`}
    >
      {/* Label + Step counter */}
      <div className="flex justify-between items-center mb-[12px]">
        <span className="text-[14px] font-rethink font-medium text-[#1A1A1A]">
          Step {currentStep}: {label}
        </span>

        <span className="text-[14px] font-rethink text-[#6B6B6B]">
          {currentStep}/{totalSteps}
        </span>
      </div>

      {/* Track */}
      <div className="flex gap-[6px]">
        {Array.from({ length: totalSteps }).map((_, i) => {
          const stepNumber = i + 1;
          const isFilled = stepNumber <= currentStep;

          return (
            <div
              key={stepNumber}
              className="h-[4px] flex-1 rounded-full transition-colors duration-300"
              style={{
                backgroundColor: isFilled ? "#FE7C0B" : "#D9D9D9",
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

export default ListingProgressBar;
