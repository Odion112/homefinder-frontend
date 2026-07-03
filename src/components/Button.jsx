import { forwardRef } from "react";

const Button = forwardRef(function Button(
  {
    type="button",
    variant = "filled", 
    iconOnly = false,   
    iconLeft,           
    iconRight,          
    disabled = false,   
    loading = false,    
    className = "",    
    children,       
    ...rest            
  },
  ref
) {


  const base = `
    inline-flex items-center justify-center gap-2
    h-10 w-40 px-5 rounded-xs text-sm font-rethink font-normal
    transition-all duration-150 cursor-pointer select-none
    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent
  `;

  // FILLED BUTTON STATE 
  const filled = `
    bg-[#FE7C0B] text-white
    hover:bg-[#F57708]
    active:scale-95 `;

  // OUTLINE BUTTON STATE
  const outline = `
    bg-transparent text-[#0E0D0C] border border-[#C6C6C6]
    hover:bg-[#FE7C0B] hover:text-white
    active:scale-95
  `;

 
  const variantStyles = { filled, outline };

  // DISABLED/LOADING STATE — blocks all clicks
  const disabledStyles =
    disabled || loading
      ? "!bg-[#C6C6C6] !text-white !border-[#C6C6C6] cursor-not-allowed pointer-events-none"
      : "";

  // ICON ONLY STATE 
  const iconOnlyStyles = iconOnly ? "w-10 h-10 px-0" : "";
  const finalStyles = `${base} ${variantStyles[variant]} ${iconOnlyStyles} ${disabledStyles} ${className}`;

  return (
    <button
      ref={ref}
      className={finalStyles}
      disabled={disabled || loading}
      {...rest}
    >

      {/* SPINNING/LOADER STATE — only shows when loading={true} */}
      {loading && (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 22 6.477 22 12h-4z" />
        </svg>
      )}

      {/* icon on the left — only shows if iconLeft was passed in */}
      {!loading && iconLeft && <span>{iconLeft}</span>}

      {/* button label text — hidden when iconOnly is true */}
      {!iconOnly && <span>{children}</span>}

      {/* icon only — children is the icon itself */}
      {iconOnly && !loading && <span>{children}</span>}

      {/* icon on the right — only shows if iconRight was passed in */}
      {!loading && !iconOnly && iconRight && <span>{iconRight}</span>}

    </button>
  );
});

export default Button;



