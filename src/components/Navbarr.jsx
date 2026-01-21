"use client";
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "./ui/resizable-navbar";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HeroSectionOne } from "./Hero";

export function Navbarr( { setIsRecordingWindowOn } ) {
  const navigate = useNavigate();

  const navItems = [
    { name: "Home", link: "/" },
    { name: "Features", link: "#features" },
    { name: "About", link: "#made-for" },
  ];

  const handleItemClick = (item) => {
    if (item.name === "Home") {
      window.location.reload();
    } else if (item.name === "Features") {
      navigate("/#features");
    } else if (item.name === "About") {
      navigate("/#made-for");
    }
  };

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="relative w-full">
      <Navbar>
        {/* Desktop Navigation */}
        <NavBody>
          <NavbarLogo />
          <NavItems items={navItems} onItemClick={handleItemClick} />
          
        </NavBody>

        {/* Mobile Navigation */}
        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
          </MobileNavHeader>

          <MobileNavMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)}>
            {navItems.map((item, idx) => (
              <a
                key={`mobile-link-${idx}`}
                href={item.link}
                onClick={(e) => {
                  e.preventDefault();
                  handleItemClick(item);
                  setIsMobileMenuOpen(false);
                }}
                className="relative text-neutral-600 dark:text-neutral-300">
                <span className="block">{item.name}</span>
              </a>
            ))}
            {/* <div className="flex w-full flex-col gap-4">
              <NavbarButton
                onClick={() => setIsMobileMenuOpen(false)}
                variant="primary"
                className="w-full">
                Login
              </NavbarButton>
              <NavbarButton
                onClick={() => setIsMobileMenuOpen(false)}
                variant="primary"
                className="w-full">
                start using
              </NavbarButton>
            </div> */}
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
      {setIsRecordingWindowOn && (
        <HeroSectionOne
          setIsRecordingWindowOn={setIsRecordingWindowOn}
        />
      )}
      {/* Navbar */}
    </div>
  );
}


