"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  Users,
  Award,
  Heart,
  Target,
  ArrowRight,
  Calendar,
  Globe,
} from "lucide-react";

// Club photos from original website
const clubPhotos = [
  { url: "https://cdn.lindoai.com/c/recNxZpB13uzSjqpH/images/83153514.jpg", alt: "White Rose Speakers meeting" },
  { url: "https://cdn.lindoai.com/c/recNxZpB13uzSjqpH/images/33005501.jpg", alt: "Members presenting" },
  { url: "https://cdn.lindoai.com/c/recNxZpB13uzSjqpH/images/94363180.jpg", alt: "Club event" },
  { url: "https://cdn.lindoai.com/c/recNxZpB13uzSjqpH/images/47671624.jpg", alt: "Speaker at podium" },
  { url: "https://cdn.lindoai.com/c/recNxZpB13uzSjqpH/images/55473831.jpg", alt: "Group discussion" },
  { url: "https://cdn.lindoai.com/c/recNxZpB13uzSjqpH/images/10404643.jpg", alt: "Award ceremony" },
];

const team = [
  {
    name: "Jane Craggs",
    role: "President",
    description: "Leading our club with passion and dedication to member growth.",
  },
  {
    name: "Dominic Bascombe",
    role: "VP Membership",
    description: "Growing our community and welcoming new members.",
  },
  {
    name: "Edna Correia",
    role: "VP Education",
    description: "Guiding members through their educational journey.",
  },
  {
    name: "Iris Araneta",
    role: "VP Public Relations",
    description: "Promoting our club and building community connections.",
  },
  {
    name: "Isabel Gonzalez",
    role: "Treasurer",
    description: "Ensuring our club's financial health and sustainability.",
  },
  {
    name: "David Kandi",
    role: "Secretary",
    description: "Keeping our records organised and communications flowing.",
  },
  {
    name: "Viktor Grushetskyi",
    role: "Sergeant at Arms",
    description: "Creating a welcoming environment for all meetings.",
  },
];

const values = [
  {
    icon: Heart,
    title: "Integrity",
    description:
      "We act with honesty and transparency in all our interactions, fostering trust within our community.",
  },
  {
    icon: Users,
    title: "Respect",
    description:
      "We value every member's contribution and create an inclusive environment where everyone feels welcome.",
  },
  {
    icon: Target,
    title: "Service",
    description:
      "We are committed to supporting each other's growth and giving back to our community.",
  },
  {
    icon: Award,
    title: "Excellence",
    description:
      "We strive for continuous improvement in everything we do, pushing ourselves to reach our full potential.",
  },
];


export default function AboutPage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-gradient-to-br from-secondary to-secondary-dark text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 rose-pattern" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="inline-block px-4 py-2 bg-accent/20 text-accent rounded-full text-sm font-medium mb-6">
              About Us
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
              Empowering Voices Since 2011
            </h1>
            <p className="text-lg text-white/80">
              White Rose Speakers Leeds is a proud member of Toastmasters
              International, dedicated to helping individuals develop their
              communication and leadership skills in a supportive environment.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
                Our Mission
              </h2>
              <p className="text-foreground-muted text-lg mb-6">
                We provide a supportive and positive learning experience in which
                members are empowered to develop communication and leadership
                skills, resulting in greater self-confidence and personal growth.
              </p>
              <p className="text-foreground-muted text-lg mb-8">
                As part of Toastmasters International, we follow a proven
                educational program that has helped millions of people around the
                world become more confident speakers and effective leaders.
              </p>
              <div className="flex items-center gap-4">
                <Globe className="w-12 h-12 text-primary" />
                <div>
                  <p className="font-semibold text-foreground">
                    Part of Toastmasters International
                  </p>
                  <p className="text-sm text-foreground-muted">
                    A nonprofit educational organization since 1924
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-8"
            >
              <h3 className="text-xl font-bold text-foreground mb-6">
                What Makes Us Different
              </h3>
              <ul className="space-y-4">
                {[
                  "Supportive, judgement-free environment",
                  "Structured learning with Pathways program",
                  "Real practice with constructive feedback",
                  "Networking with diverse professionals",
                  "Leadership opportunities through club roles",
                  "Flexible commitment to suit your schedule",
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center shrink-0 mt-0.5">
                      <svg
                        className="w-3 h-3 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <span className="text-foreground-muted">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-background-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Our Core Values
            </h2>
            <p className="text-foreground-muted text-lg max-w-2xl mx-auto">
              These values guide everything we do at White Rose Speakers Leeds.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-lg border border-border text-center"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-primary to-primary-light rounded-xl flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">
                  {value.title}
                </h3>
                <p className="text-foreground-muted text-sm">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Photo Gallery Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Our Club in Action
            </h2>
            <p className="text-foreground-muted text-lg max-w-2xl mx-auto">
              See the supportive and engaging environment where our members grow
              their speaking skills.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {clubPhotos.map((photo, index) => (
              <motion.div
                key={photo.url}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-lg group"
              >
                <Image
                  src={photo.url}
                  alt={photo.alt}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-background-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Our Leadership Team
            </h2>
            <p className="text-foreground-muted text-lg max-w-2xl mx-auto">
              Dedicated volunteers who guide our club&apos;s mission.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
                className="bg-white rounded-2xl p-5 shadow-lg border border-border text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-xl font-bold text-white">
                    {member.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>
                <h3 className="text-base font-bold text-foreground mb-1">
                  {member.name}
                </h3>
                <p className="text-primary font-medium text-xs mb-2">
                  {member.role}
                </p>
                <p className="text-foreground-muted text-xs leading-relaxed">
                  {member.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary to-primary-dark text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Ready to Join Our Community?
            </h2>
            <p className="text-white/80 text-lg max-w-2xl mx-auto mb-8">
              Experience the White Rose Speakers difference. Visit us as a guest
              and see how we can help you grow.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="https://www.toastmasters.org/Find-a-Club/01971684-white-rose-speakers/contact-club?id=8e2c929b-8cd7-ec11-a2fd-005056875f20"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-primary px-8 py-4 rounded-lg font-semibold hover:bg-white/90 transition-colors flex items-center gap-2"
              >
                Visit as a Guest
                <ArrowRight className="w-5 h-5" />
              </a>
              <Link
                href="/contact"
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-primary transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
