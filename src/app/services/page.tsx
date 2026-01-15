"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Mic,
  Users,
  MessageSquare,
  Award,
  Lightbulb,
  Target,
  BookOpen,
  ArrowRight,
  Check,
} from "lucide-react";

const services = [
  {
    icon: Mic,
    title: "Public Speaking Training",
    description:
      "Comprehensive training in public speaking and leadership skills through structured programs and practical workshops, tailored to individuals at all levels.",
    features: [
      "Prepared speech opportunities",
      "Constructive evaluations",
      "Pathways learning experience",
      "Video recordings for review",
    ],
  },
  {
    icon: Users,
    title: "Meeting Facilitation",
    description:
      "Our meetings are expertly facilitated by volunteers who guide members through prepared speeches, evaluations, and impromptu speaking exercises.",
    features: [
      "Structured meeting format",
      "Rotational leadership roles",
      "Time management practice",
      "Supportive atmosphere",
    ],
  },
  {
    icon: MessageSquare,
    title: "Communication Skills Development",
    description:
      "Focus on enhancing communication abilities across diverse backgrounds, developing confident speakers and inspiring leaders.",
    features: [
      "Active listening skills",
      "Body language awareness",
      "Voice modulation techniques",
      "Storytelling mastery",
    ],
  },
  {
    icon: Award,
    title: "Personal Growth Programs",
    description:
      "A transformative journey towards greater self-confidence and personal growth, guided by core values of Integrity, Respect, Service, and Excellence.",
    features: [
      "Self-assessment tools",
      "Goal setting guidance",
      "Progress tracking",
      "Recognition and awards",
    ],
  },
];

const meetingStructure = [
  {
    icon: BookOpen,
    title: "Prepared Speeches",
    description:
      "Members deliver 5-7 minute speeches from the Pathways program, practicing specific communication techniques.",
  },
  {
    icon: Target,
    title: "Evaluations",
    description:
      "Each speech receives constructive feedback from an assigned evaluator, helping speakers identify strengths and areas for improvement.",
  },
  {
    icon: Lightbulb,
    title: "Table Topics",
    description:
      "Impromptu speaking section where participants respond to random questions, building quick-thinking skills.",
  },
];

export default function ServicesPage() {
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
              What We Offer
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
              Develop Your Communication & Leadership Skills
            </h1>
            <p className="text-lg text-white/80">
              Through our proven Toastmasters methodology, we provide a supportive
              environment where you can practice and grow at your own pace.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-lg border border-border"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-primary to-primary-light rounded-xl flex items-center justify-center mb-6">
                  <service.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">
                  {service.title}
                </h3>
                <p className="text-foreground-muted mb-6">{service.description}</p>
                <ul className="space-y-3">
                  {service.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 text-primary" />
                      </div>
                      <span className="text-foreground-muted text-sm">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Meeting Structure */}
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
              Our Meeting Structure
            </h2>
            <p className="text-foreground-muted text-lg max-w-2xl mx-auto">
              Each meeting includes three key components designed to help you
              develop different aspects of communication.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {meetingStructure.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <item.icon className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">
                  {item.title}
                </h3>
                <p className="text-foreground-muted">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pathways Section */}
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
                The Pathways Learning Experience
              </h2>
              <p className="text-foreground-muted text-lg mb-6">
                Pathways is Toastmasters&apos; cutting-edge education program that
                offers personalized learning tracks based on your goals and
                interests.
              </p>
              <p className="text-foreground-muted text-lg mb-8">
                Choose from 11 different paths, each focused on building specific
                competencies that matter to you, from leadership to presentation
                design to persuasive influence.
              </p>
              <a
                href="https://www.toastmasters.org/pathways-overview"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all"
              >
                Learn more about Pathways
                <ArrowRight className="w-5 h-5" />
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-2 gap-4"
            >
              {[
                "Dynamic Leadership",
                "Presentation Mastery",
                "Motivational Strategies",
                "Persuasive Influence",
                "Team Collaboration",
                "Strategic Relationships",
                "Innovative Planning",
                "Visionary Communication",
              ].map((path, index) => (
                <div
                  key={path}
                  className="bg-white rounded-xl p-4 shadow-md border border-border"
                >
                  <p className="text-foreground font-medium text-sm">{path}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
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
              Benefits of Joining
            </h2>
            <p className="text-foreground-muted text-lg max-w-2xl mx-auto">
              Membership offers far more than just public speaking practice.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                title: "Build Confidence",
                description:
                  "Practice in a safe environment and watch your confidence grow.",
              },
              {
                title: "Network",
                description:
                  "Connect with professionals from diverse industries and backgrounds.",
              },
              {
                title: "Develop Leadership",
                description:
                  "Take on club roles and develop real leadership experience.",
              },
              {
                title: "Receive Feedback",
                description:
                  "Get constructive, actionable feedback on every speech you give.",
              },
              {
                title: "Learn at Your Pace",
                description:
                  "Progress through the program at a speed that suits you.",
              },
              {
                title: "Have Fun",
                description:
                  "Enjoy a supportive community that celebrates your progress.",
              },
            ].map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-md border border-border"
              >
                <h3 className="text-lg font-bold text-foreground mb-2">
                  {benefit.title}
                </h3>
                <p className="text-foreground-muted text-sm">
                  {benefit.description}
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
              Experience It for Yourself
            </h2>
            <p className="text-white/80 text-lg max-w-2xl mx-auto mb-8">
              The best way to understand what we offer is to visit a meeting.
              Guests are always welcome!
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
                Contact Us First
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
