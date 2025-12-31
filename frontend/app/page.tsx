"use client";

import HeroSection from "@/components/tailark/hero-section";
import Features from "@/components/tailark/features-4";
import ContentSection from "@/components/tailark/content-7";
import { BackgroundAnimation } from "@/components/BackgroundAnimation";
import { StatsStrip } from "@/components/tailark/stats-strip";
import { Leaf, Twitter, Github, Linkedin, ArrowUpRight } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen relative overflow-hidden bg-transparent scroll-smooth mb-0 pb-0">
      <BackgroundAnimation />
      
      {/* Hero Section */}
      <HeroSection />
      
      {/* Stats Bridge - Solves vertical gap */}
      <StatsStrip />

      {/* Features Grid */}
      <Features />

      {/* Content / Ecosystem Section */}
      <ContentSection />

      {/* Footer */}
      <footer className="border-t py-16 px-6 bg-white/40 backdrop-blur-md relative z-10">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
             <div className="space-y-6 max-w-sm">
                <div className="flex items-center gap-2">
                   <div className="h-8 w-8 bg-gradient-to-br from-emerald-500 to-green-700 rounded-lg flex items-center justify-center text-white shadow-md">
                      <Leaf className="h-5 w-5" />
                   </div>
                   <span className="text-2xl font-black text-foreground">CompostAI</span>
                </div>
                <p className="text-muted-foreground font-medium leading-relaxed">
                   Democratizing precision agriculture through Artificial Intelligence. Built for large scale farmers and community gardeners alike.
                </p>
                <div className="flex gap-4">
                   <a href="#" className="h-10 w-10 border bg-white rounded-full flex items-center justify-center hover:bg-emerald-500/10 hover:border-emerald-500 hover:text-emerald-600 transition-all shadow-sm">
                      <Twitter className="h-4 w-4" />
                   </a>
                   <a href="#" className="h-10 w-10 border bg-white rounded-full flex items-center justify-center hover:bg-emerald-500/10 hover:border-emerald-500 hover:text-emerald-600 transition-all shadow-sm">
                      <Github className="h-4 w-4" />
                   </a>
                   <a href="#" className="h-10 w-10 border bg-white rounded-full flex items-center justify-center hover:bg-emerald-500/10 hover:border-emerald-500 hover:text-emerald-600 transition-all shadow-sm">
                      <Linkedin className="h-4 w-4" />
                   </a>
                </div>
             </div>
             <div className="grid grid-cols-2 md:grid-cols-3 gap-16">
                <div className="space-y-4">
                   <h5 className="font-black text-xs uppercase tracking-widest text-foreground">Platform</h5>
                   <ul className="space-y-3 text-sm text-muted-foreground font-medium">
                      <li><a href="/analyze" className="hover:text-emerald-600 transition-colors flex items-center gap-1">Analyzer <ArrowUpRight className="h-3 w-3" /></a></li>
                      <li><a href="/history" className="hover:text-emerald-600 transition-colors">History</a></li>
                      <li><a href="#" className="hover:text-emerald-600 transition-colors">API Docs</a></li>
                   </ul>
                </div>
                <div className="space-y-4">
                   <h5 className="font-black text-xs uppercase tracking-widest text-foreground">Resources</h5>
                   <ul className="space-y-3 text-sm text-muted-foreground font-medium">
                      <li><a href="#" className="hover:text-emerald-600 transition-colors">Soil Guides</a></li>
                      <li><a href="#" className="hover:text-emerald-600 transition-colors">Case Studies</a></li>
                      <li><a href="#" className="hover:text-emerald-600 transition-colors">Blog</a></li>
                   </ul>
                </div>
             </div>
          </div>
          <div className="max-w-7xl mx-auto mt-12 pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">
             <div>© 2025 AGRI-TECH INNOVATIONS. ALL RIGHTS RESERVED.</div>
             <div className="flex gap-8">
                <a href="#">Privacy</a>
                <a href="#">Terms</a>
                <a href="#">Cookies</a>
             </div>
          </div>
      </footer>
    </main>
  );
}
