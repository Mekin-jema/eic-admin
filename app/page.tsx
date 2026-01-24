"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function HeroSection() {
  return (
    <>
      {/* 💻 Desktop Hero Section */}
      <div className="hidden md:block relative bg-[url('/bgg.png')] bg-cover bg-center">
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/10 via-background/40 to-background/10"></div>

        {/* Content */}
        <div className="relative container mx-auto px-6 py-28 text-center">
          <motion.div
            className="w-fit mx-auto my-14"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
              Power Ethiopia Admin Dashboard
            </h1>
            <p className="text-lg mb-10 max-w-3xl mx-auto text-neutral-700 leading-relaxed">
              Monitor, analyze, and manage survey analytics with real-time insights.
              <br />
              <strong className="text-primary">
                Built for renewable energy data intelligence.
              </strong>
            </p>

            {/* ✅ Desktop link */}
            <Link
              href="https://survey-admin-panel.coolify.powerethio.com/dashboard"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                size="lg"
                className="rounded-2xl bg-primary text-primary-foreground text-lg px-8 py-6 
                hover:bg-primary/90 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Go to Dashboard
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* 📱 Mobile Hero Section */}
      <div className="relative block md:hidden bg-[url('/bg.png')] bg-cover bg-center m-1h-screen">
        {/* <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background/90"></div> */}

        <div className="relative container mx-auto px-5 py-20 text-center">
          <motion.div
            className="mx-auto"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h1 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
              Power Ethiopia Analytics
            </h1>
            <p className="text-base mb-6 text-muted-foreground">
              Access your real-time survey dashboard anywhere.
            </p>

            {/* ✅ Mobile link */}
            <Link
              href="https://survey-admin-panel.coolify.powerethio.com/admin/dashboard"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button className="bg-primary text-primary-foreground rounded-xl text-lg px-6 py-5 hover:bg-primary/90 transition-all shadow-md">
                Go to Dashboard <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </>
  );
}
