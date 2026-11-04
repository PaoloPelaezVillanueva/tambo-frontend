
import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Check, ChevronDown } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface SelectOption<T extends string = string> {
   value: T;
   label: string;
   icon?: LucideIcon;
}

interface CustomSelectProps<T extends string> {
   value: T;
   options: readonly SelectOption<T>[];
   onChange: (value: T) => void;
   ariaLabel: string;
   disabled?: boolean;
   className?: string;
}

interface DropdownPosition {
   top: number;
   left: number;
   width: number;
   maxHeight: number;
}

export default function CustomSelect<T extends string>({value, options, onChange, ariaLabel, disabled = false, className = ""}: Readonly<CustomSelectProps<T>>) {
   const [isOpen, setIsOpen] = useState(false);
   const [position, setPosition] = useState<DropdownPosition | null>(null);

   const containerRef = useRef<HTMLDivElement>(null);
   const triggerRef = useRef<HTMLButtonElement>(null);
   const dropdownRef = useRef<HTMLDivElement>(null);

   const listboxId = useId();

   const selectedOption = options.find(
      (option) => option.value === value,
   );

   const SelectedIcon = selectedOption?.icon;

   useEffect(() => {
      if (!isOpen) return;

      const handleOutsideClick = (event: PointerEvent) => {
         const target = event.target;

         if (!(target instanceof Node)) return;

         const clickedInside =
            containerRef.current?.contains(target) ||
            dropdownRef.current?.contains(target);

         if (!clickedInside) {
            setIsOpen(false);
         }
      };

      const handleKeyDown = (event: KeyboardEvent) => {
         if (event.key === "Escape") {
            setIsOpen(false);
            triggerRef.current?.focus();
         }
      };

      document.addEventListener("pointerdown", handleOutsideClick);
      document.addEventListener("keydown", handleKeyDown);

      return () => {
         document.removeEventListener("pointerdown", handleOutsideClick);
         document.removeEventListener("keydown", handleKeyDown);
      };
   }, [isOpen]);

   useLayoutEffect(() => {
      if (!isOpen) return;

      const updatePosition = () => {
         const trigger = triggerRef.current;

         if (!trigger) return;

         const rect = trigger.getBoundingClientRect();

         const gap = 8;
         const padding = 12;

         const desiredHeight = Math.min(256, Math.max(48, options.length * 64 + 12));

         const spaceBelow = window.innerHeight - rect.bottom - padding;

         const spaceAbove = rect.top - padding;

         const openAbove = spaceBelow < desiredHeight && spaceAbove > spaceBelow;

         const availableSpace = openAbove ? spaceAbove - gap : spaceBelow - gap;

         const maxHeight = Math.max(48, Math.min(256, availableSpace));

         const menuHeight = Math.min(desiredHeight, maxHeight);

         const width = Math.min(rect.width, window.innerWidth - padding * 2);

         const left = Math.max(padding, Math.min(rect.left, window.innerWidth - width - padding));

         const top = openAbove ? rect.top - gap - menuHeight : rect.bottom + gap;

         setPosition({ top, left, width, maxHeight });
      };

      updatePosition();

      window.addEventListener("resize", updatePosition);
      window.addEventListener("scroll", updatePosition, true);

      return () => {
         window.removeEventListener("resize", updatePosition);
         window.removeEventListener("scroll", updatePosition, true);
      };
   }, [isOpen, options.length]);

   return (
      <div ref={containerRef} className={`relative ${className}`}>
         {/* Selector principal */}
         <button
            ref={triggerRef}
            type="button"
            disabled={disabled}
            aria-label={ariaLabel}
            aria-haspopup="listbox"
            aria-expanded={isOpen}
            aria-controls={listboxId}
            onClick={() => {
               setPosition(null);
               setIsOpen((previous) => !previous);
            }}
            className="cursor-pointer flex w-full items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition-all duration-200 hover:border-purple-300 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-purple-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-purple-500 dark:hover:bg-slate-700/50 dark:focus:ring-purple-900/40"
         >
            <span className="flex min-w-0 items-center gap-2.5">
               {SelectedIcon && (
                  <SelectedIcon size={17} className="shrink-0 text-purple-500" />
               )}

               <span className="truncate">
                  {selectedOption?.label ?? "Seleccionar"}
               </span>
            </span>

            <ChevronDown
               size={16}
               className={` shrink-0 text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
            />
         </button>

         {/* Dropdown mediante Portal */}
         {isOpen && position &&
            createPortal(
               <div
                  ref={dropdownRef}
                  id={listboxId}
                  role="listbox"
                  aria-label={ariaLabel}
                  style={{
                     position: "fixed",
                     top: position.top,
                     left: position.left,
                     width: position.width,
                     maxHeight: position.maxHeight,
                     zIndex: 9999,
                  }}
                  className="flex flex-col gap-2 overflow-y-auto rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl shadow-slate-200/50 dark:border-slate-700 dark:bg-slate-800 dark:shadow-black/20"
               >
                  {options.map((option) => {
                     const OptionIcon = option.icon;
                     const isSelected = value === option.value;

                     return (
                        <button
                           key={option.value}
                           type="button"
                           role="option"
                           aria-selected={isSelected}
                           onClick={() => {
                              onChange(option.value);
                              setIsOpen(false);
                           }}
                           className={`cursor-pointer flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors duration-150
                              ${
                                 isSelected
                                    ? "bg-purple-50 text-purple-700 dark:bg-purple-500/10 dark:text-purple-300"
                                    : "text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700/60"
                              }
                           `}
                        >
                           {OptionIcon && (
                              <OptionIcon
                                 size={18}
                                 className={`shrink-0
                                    ${
                                       isSelected
                                          ? "text-purple-600 dark:text-purple-400"
                                          : "text-slate-400 dark:text-slate-500"
                                    }
                                 `}
                              />
                           )}

                           <span className="min-w-0 flex-1">
                              <span className="block text-sm font-medium">
                                 {option.label}
                              </span>
                           </span>

                           {isSelected && (
                              <Check size={17} className="shrink-0 text-purple-600 dark:text-purple-400" />
                           )}
                        </button>
                     );
                  })}
               </div>,
               document.body,
            )}
      </div>
   );
}
