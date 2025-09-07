export const Tooltip = ({ label, children, position = "top" }) => {
  const tooltipPosition =
    position === "bottom" ? "top-full mt-1" : "bottom-full mb-1";

  return (
    <div className="relative group">
      {children}
      <span
        className={`absolute left-1/2 -translate-x-1/2 ${tooltipPosition} bg-neutral-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50`}
      >
        {label}
      </span>
    </div>
  );
};
