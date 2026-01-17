import Link from "next/link";
import { Mail, MapPin, Calendar, Youtube, ExternalLink, Facebook, Linkedin, Instagram } from "lucide-react";

const footerLinks = {
  navigation: [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/services", label: "What We Offer" },
    { href: "/blog", label: "Blog" },
    { href: "/events", label: "Events" },
    { href: "/gallery", label: "Gallery" },
    { href: "/contact", label: "Contact" },
  ],
  legal: [
    { href: "/privacy-policy", label: "Privacy Policy" },
    { href: "/cookie-policy", label: "Cookie Policy" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-secondary text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">W</span>
              </div>
              <div>
                <h3 className="font-bold text-lg">White Rose Speakers</h3>
                <p className="text-white/70 text-sm">Leeds Toastmasters</p>
              </div>
            </div>
            <p className="text-white/80 text-sm leading-relaxed mb-4">
              Empowering voices and building leaders in Leeds since 2011.
              Part of Toastmasters International.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://www.facebook.com/whiterosespeakers"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://www.linkedin.com/in/white-rose-speakers-leeds-toastmasters-481a4a1b2/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="https://www.instagram.com/whiterosespeakers"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://www.youtube.com/watch?v=Nt6iyS-WBPs"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {footerLinks.navigation.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/80 hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Meeting Info */}
          <div>
            <h4 className="font-bold text-lg mb-4">Meeting Info</h4>
            <p className="text-accent text-xs font-medium mb-3">Hybrid: In-Person & Online via Zoom</p>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-accent mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium">2nd & 4th Wednesday</p>
                  <p className="text-white/70 text-sm">6:45pm for 7:00pm start</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-accent mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium">Leonardo Hotel</p>
                  <p className="text-white/70 text-sm">
                    Brewery Wharf, Brewery Place<br />
                    Leeds LS10 1NE
                  </p>
                  <p className="text-white/70 text-sm mt-1">or join via Zoom</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-accent mt-0.5 shrink-0" />
                <div>
                  <a
                    href="mailto:whiterosespeaker@gmail.com"
                    className="text-sm hover:text-accent transition-colors"
                  >
                    whiterosespeaker@gmail.com
                  </a>
                </div>
              </li>
            </ul>
          </div>

          {/* Toastmasters */}
          <div>
            <h4 className="font-bold text-lg mb-4">Toastmasters</h4>
            <p className="text-white/80 text-sm mb-4">
              We are proud members of Toastmasters International, a nonprofit
              educational organization that teaches public speaking and leadership skills.
            </p>
            <a
              href="https://www.toastmasters.org/Find-a-Club/01971684-white-rose-speakers"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-accent hover:text-accent-light transition-colors text-sm"
            >
              Visit our club page
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-white/60 text-sm">
              &copy; {new Date().getFullYear()} White Rose Speakers Leeds. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              {footerLinks.legal.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-white/60 hover:text-white text-sm transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="mt-4 text-center">
            <p className="text-white/50 text-xs">
              Powered by{" "}
              <a
                href="https://www.bourdak.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/70 hover:text-white transition-colors underline"
              >
                Bourdak
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
