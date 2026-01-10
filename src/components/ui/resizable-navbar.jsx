import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { RxCross2 } from "react-icons/rx";
import { IoMdMenu } from "react-icons/io";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";

import { cn } from "../../utils/cn";

/* ================= NAVBAR WRAPPER ================= */

export const Navbar = ({ children, className }) => {
  const ref = useRef(null);
  const { scrollY } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const [visible, setVisible] = useState(true);

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 100) setVisible(true);
  });

  return (
    <motion.div
      ref={ref}
      className={cn("sticky inset-x-0 top-6 z-40 w-full", className)}
    >
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(child, { visible })
          : child
      )}
    </motion.div>
  );
};

/* ================= NAV BODY ================= */

export const NavBody = ({ children, className, visible }) => {
  return (
    <motion.div
      animate={{
        backdropFilter: visible ? "blur(10px)" : "none",
        boxShadow: visible
          ? "0 0 24px rgba(34, 42, 53, 0.06), 0 1px 1px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(34, 42, 53, 0.04), 0 0 4px rgba(34, 42, 53, 0.08), 0 16px 68px rgba(47, 48, 55, 0.05), 0 1px 0 rgba(255, 255, 255, 0.1) inset"
          : "none",
        width: visible ? "40%" : "100%",
        y: visible ? 20 : 0,
      }}
      transition={{ type: "spring", stiffness: 200, damping: 50 }}
      style={{ minWidth: "800px" }}
      className={cn(
        "relative z-[60] mx-auto hidden w-full max-w-7xl items-center justify-between rounded-full bg-transparent px-4 py-2 lg:flex",
        visible && "bg-white/80 dark:bg-neutral-950/80",
        className
      )}
    >
      {children}
    </motion.div>
  );
};

/* ================= NAV ITEMS (ALL TO END) ================= */

export const NavItems = ({ items, className, onItemClick }) => {
  const [hovered, setHovered] = useState(null);

  const renderItem = (item) => (
    <Link
      key={item.name}
      to={item.link}
      onClick={onItemClick}
      onMouseEnter={() => setHovered(item.name)}
      className="relative px-4 py-2 text-neutral-600 dark:text-neutral-300"
    >
      {hovered === item.name && (
        <motion.div
          layoutId="hovered"
          className="absolute inset-0 rounded-full bg-gray-100 dark:bg-neutral-800"
        />
      )}
      <span className="relative z-20">{item.name}</span>
    </Link>
  );

  return (
    <div
      onMouseLeave={() => setHovered(null)}
      className={cn(
        "absolute inset-0 hidden items-center justify-end text-sm font-medium lg:flex",
        className
      )}
    >
      <div className="flex items-center gap-2 pr-4">
        {items.map(renderItem)}
      </div>
    </div>
  );
};

/* ================= MOBILE NAV ================= */

export const MobileNav = ({ children, className, visible }) => {
  return (
    <motion.div
      animate={{
        backdropFilter: visible ? "blur(10px)" : "none",
        boxShadow: visible
          ? "0 0 24px rgba(34, 42, 53, 0.06), 0 1px 1px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(34, 42, 53, 0.04), 0 0 4px rgba(34, 42, 53, 0.08), 0 16px 68px rgba(47, 48, 55, 0.05), 0 1px 0 rgba(255, 255, 255, 0.1) inset"
          : "none",
        width: visible ? "90%" : "100%",
        paddingRight: visible ? "12px" : "0px",
        paddingLeft: visible ? "12px" : "0px",
        borderRadius: visible ? "4px" : "2rem",
        y: visible ? 20 : 0,
      }}
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 25,
        ease: "easeOut",
      }}
      className={cn(
        "relative z-50 mx-auto flex w-full max-w-[calc(100vw-2rem)] flex-col items-center justify-between bg-transparent px-0 py-2 lg:hidden",
        visible && "bg-white/80 dark:bg-neutral-950/80",
        className
      )}
    >
      {children}
    </motion.div>
  );
};

export const MobileNavHeader = ({ children, className }) => {
  return (
    <div className={cn("flex w-full items-center justify-between", className)}>
      {children}
    </div>
  );
};

export const MobileNavMenu = ({ children, className, isOpen }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={cn(
            "absolute inset-x-0 top-16 z-50 flex w-full flex-col gap-4 rounded-lg bg-white px-4 py-8 shadow-lg dark:bg-neutral-950",
            className
          )}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const MobileNavToggle = ({ isOpen, onClick }) =>
  isOpen ? (
    <RxCross2 className="text-black dark:text-white" onClick={onClick} />
  ) : (
    <IoMdMenu className="text-black dark:text-white" onClick={onClick} />
  );

/* ================= LOGO ================= */

export const NavbarLogo = () => {
  return (
    <Link
      to="#"
      className="relative z-20 mr-4 flex items-center px-2 py-1 text-xl font-semibold text-black dark:text-white"
    >
      Recodek    </Link>
  );
};

/* ================= BUTTON ================= */

export const NavbarButton = ({
  href,
  as: Tag = "a",
  children,
  className,
  variant = "primary",
  ...props
}) => {
  const baseStyles =
    "px-4 py-2 rounded-md text-sm font-bold transition duration-200 inline-block";

  const variantStyles = {
    primary: "bg-white text-black shadow",
    secondary: "bg-transparent dark:text-white",
    dark: "bg-black text-white shadow",
    gradient: "bg-gradient-to-b from-blue-500 to-blue-700 text-white",
  };

  return (
    <Tag
      href={href || undefined}
      className={cn(baseStyles, variantStyles[variant], className)}
      {...props}
    >
      {children}
    </Tag>
  );
};
