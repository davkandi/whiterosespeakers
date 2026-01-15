"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const TOASTMASTERS_CLUB_URL = "https://www.toastmasters.org/Find-a-Club/01971684-white-rose-speakers/contact-club?id=8e2c929b-8cd7-ec11-a2fd-005056875f20";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "What We Offer" },
  { href: "/blog", label: "Blog" },
  { href: "/events", label: "Events" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  // Pages that have dark hero sections need white text when not scrolled
  const hasDarkHero = ["/", "/about", "/services", "/contact", "/blog", "/events", "/gallery"].includes(pathname);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Text colors based on scroll state and hero type
  const getTextClasses = () => {
    if (isScrolled) {
      return "text-gray-900";
    }
    if (hasDarkHero) {
      return "text-white";
    }
    return "text-gray-900";
  };

  const getTextMutedClasses = () => {
    if (isScrolled) {
      return "text-gray-500";
    }
    if (hasDarkHero) {
      return "text-white/70";
    }
    return "text-gray-500";
  };

  const getNavLinkClasses = () => {
    if (isScrolled) {
      return "text-gray-800 hover:text-primary hover:bg-gray-100";
    }
    if (hasDarkHero) {
      return "text-white/90 hover:text-white hover:bg-white/10";
    }
    return "text-gray-800 hover:text-primary hover:bg-gray-100";
  };

  const getIconButtonClasses = () => {
    if (isScrolled) {
      return "text-gray-800 hover:bg-gray-100";
    }
    if (hasDarkHero) {
      return "text-white hover:bg-white/10";
    }
    return "text-gray-800 hover:bg-gray-100";
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-lg py-2"
          : "bg-transparent py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="text-white font-bold text-lg">W</span>
            </div>
            <div className="hidden sm:block">
              <h1 className={`text-lg font-bold leading-tight transition-colors ${getTextClasses()}`}>
                White Rose
              </h1>
              <p className={`text-xs -mt-1 transition-colors ${getTextMutedClasses()}`}>Speakers Leeds</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 text-sm font-medium transition-colors rounded-lg ${getNavLinkClasses()}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Join Meeting CTA */}
            <a
              href={TOASTMASTERS_CLUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:block btn-primary text-sm"
            >
              Join a Meeting
            </a>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`lg:hidden p-2 rounded-lg transition-colors ${getIconButtonClasses()}`}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t border-gray-200"
          >
            <nav className="max-w-7xl mx-auto px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-4 py-3 text-gray-800 hover:text-primary hover:bg-gray-100 rounded-lg transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <a
                href={TOASTMASTERS_CLUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="block mt-4 btn-primary text-center"
              >
                Join a Meeting
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
