import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Applies glassmorphism effect to an element
 * @param {string} baseOpacity - Base opacity for the glass effect (default: "10")
 * @returns {string} - Tailwind classes for glassmorphism
 */
export function applyGlass(baseOpacity = "10") {
  return `bg-white/${baseOpacity} backdrop-blur-md border border-white/20 shadow-md shadow-white/10 rounded-xl`;
}

/**
 * Creates a responsive spacing value based on the 8pt grid system
 * @param {number} value - Multiplier for the 8pt grid
 * @returns {string} - CSS value in rem
 */
export function spacing(value) {
  return `${value * 0.5}rem`; // 8pt = 0.5rem
}

/**
 * Formats a date for display
 * @param {Date|string} date - Date to format
 * @param {string} format - Format type ('short', 'long', 'time')
 * @returns {string} - Formatted date string
 */
export function formatDate(date, format = 'short') {
  const d = date instanceof Date ? date : new Date(date);
  
  if (isNaN(d.getTime())) {
    return 'Invalid date';
  }
  
  switch (format) {
    case 'short':
      return d.toLocaleDateString();
    case 'long':
      return d.toLocaleDateString(undefined, { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    case 'time':
      return d.toLocaleTimeString(undefined, { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    case 'datetime':
      return `${d.toLocaleDateString()} ${d.toLocaleTimeString(undefined, { 
        hour: '2-digit', 
        minute: '2-digit' 
      })}`;
    default:
      return d.toLocaleDateString();
  }
}
