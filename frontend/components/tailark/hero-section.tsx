'use client'
import React, { useState, useEffect } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, EffectCards } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/autoplay'
import 'swiper/css/effect-cards'
import Link from 'next/link'
import { Menu, Sprout, X, Leaf, ChevronRight, Activity, Zap, UserCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { motion, useScroll, useTransform } from 'framer-motion'

const menuItems = [
    { name: 'Analysis Hub', href: '/analyze' },
    { name: 'History', href: '/history' },
    { name: 'Resources', href: '#' },
]

export default function HeroSection() {
    const [menuState, setMenuState] = useState(false)
    const [scrolled, setScrolled] = useState(false)

    // Production-Grade: Header scroll effect
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <>
            <header 
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                    scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm border-b border-black/5' : 'bg-transparent border-transparent'
                }`}
            >
                <nav className="mx-auto max-w-7xl px-6 h-16 lg:h-20 flex items-center justify-between">
                    {/* Brand */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="h-9 w-9 bg-gradient-to-br from-emerald-600 to-green-700 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-500/30 transition-all">
                            <Leaf className="h-5 w-5" />
                        </div>
                        <span className="font-bold text-xl tracking-tight text-slate-900 group-hover:text-emerald-700 transition-colors">
                            CompostAI
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden lg:flex items-center gap-8">
                        <ul className="flex items-center gap-1">
                            {menuItems.map((item, index) => (
                                <li key={index}>
                                    <Link
                                        href={item.href}
                                        className="text-sm font-medium text-slate-600 hover:text-emerald-700 px-4 py-2 rounded-full hover:bg-emerald-50 transition-all"
                                    >
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                        <div className="w-px h-6 bg-slate-200 mx-2" />
                        <div className="flex items-center gap-3">
                            <Button variant="ghost" size="sm" className="text-slate-600 hover:text-emerald-700 font-medium">
                                Log in
                            </Button>
                            <Button
                                asChild
                                size="sm"
                                className="rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-500/20 px-6 font-semibold"
                            >
                                <Link href="/analyze">
                                    Get Started
                                </Link>
                            </Button>
                        </div>
                    </div>

                    {/* Mobile Toggle */}
                    <button
                        onClick={() => setMenuState(!menuState)}
                        className="lg:hidden p-2 text-slate-600"
                    >
                        {menuState ? <X /> : <Menu />}
                    </button>
                </nav>

                {/* Mobile Menu Overlay */}
                {menuState && (
                    <div className="fixed inset-0 top-[64px] bg-white z-40 p-6 flex flex-col gap-6 lg:hidden animate-in slide-in-from-top-4">
                        <ul className="space-y-4">
                            {menuItems.map((item, index) => (
                                <li key={index}>
                                    <Link
                                        href={item.href}
                                        onClick={() => setMenuState(false)}
                                        className="block text-lg font-medium text-slate-800 py-2 border-b border-slate-100"
                                    >
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                        <Button className="w-full bg-emerald-600" asChild>
                            <Link href="/analyze">Start Analysis</Link>
                        </Button>
                    </div>
                )}
            </header>

            <main className="overflow-hidden">
                {/* Reduced padding-top to tighten spacing: pt-28 (112px) */}
                <section className="relative pt-28 pb-10 lg:pt-36 lg:pb-16 text-left">
                    <div className="mx-auto max-w-7xl px-6 md:px-12">
                        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
                            {/* Left Column: Text */}
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, ease: "easeOut" }}
                                className="max-w-2xl mx-auto lg:mx-0"
                            >
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-wide mb-6">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                    v2.0 Beta Live
                                </div>

                                <h1 className="text-4xl font-extrabold md:text-6xl xl:text-7xl xl:[line-height:1.1] tracking-tight mb-6 text-slate-900">
                                    Analyze Your <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">Compost Potential</span>
                                </h1>
                                <p className="text-lg text-slate-600 leading-relaxed mb-8 max-w-lg">
                                    Precision machine learning for soil health. Transform raw laboratory data into actionable maturity insights instantly.
                                </p>

                                <div className="flex flex-col sm:flex-row gap-4">
                                    <Button
                                        size="lg"
                                        asChild
                                        className="h-12 px-8 rounded-full text-base font-bold bg-emerald-600 hover:bg-emerald-700 shadow-xl shadow-emerald-500/20">
                                        <Link href="/analyze">
                                            <Sprout className="mr-2 h-4 w-4" />
                                            Start Analyzing
                                        </Link>
                                    </Button>
                                    <Button
                                        size="lg"
                                        variant="outline"
                                        asChild
                                        className="h-12 px-8 rounded-full text-base font-bold border-slate-200 text-slate-700 hover:bg-slate-50">
                                        <Link href="#features">
                                            How it Works
                                        </Link>
                                    </Button>
                                </div>
                                
                                <div className="mt-8 flex items-center gap-4 text-sm text-slate-500">
                                    <div className="flex -space-x-2">
                                        {[1,2,3,4].map(i => (
                                            <div key={i} className={`h-8 w-8 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-[10px] font-bold z-[${5-i}]`}>
                                               <UserCircle className="text-slate-400" />
                                            </div>
                                        ))}
                                    </div>
                                    <p>Join <strong className="text-slate-900">1,200+</strong> farmers improving yields.</p>
                                </div>
                            </motion.div>

                            {/* Right Column: Visual Swiper */}
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
                                className="relative w-full max-w-md mx-auto lg:max-w-none lg:mx-0 perspective-1000 mt-8 lg:mt-0"
                            >
                                <div className="absolute inset-x-0 top-1/2 -z-[1] mx-auto h-2/3 w-2/3 -translate-y-1/2 rounded-full bg-emerald-400/20 blur-[80px]"></div>
                                
                                <Swiper
                                    effect={'cards'}
                                    grabCursor={true}
                                    modules={[Autoplay, EffectCards]}
                                    autoplay={{ delay: 3500, disableOnInteraction: false }}
                                    cardsEffect={{
                                        slideShadows: false,
                                        rotate: true,
                                        perSlideOffset: 12,
                                    }}
                                    className="w-[300px] h-[380px] sm:w-[360px] sm:h-[440px]"
                                >
                                    {[
                                        { color: 'text-emerald-600', bg: 'bg-emerald-500', icon: Zap, label: 'Model Accuracy', val: '92.4%', sub: 'Verified Samples' },
                                        { color: 'text-indigo-600', bg: 'bg-indigo-500', icon: Activity, label: 'Key Metrics', val: '12', sub: 'Chemical Analysis' },
                                        { color: 'text-orange-600', bg: 'bg-orange-500', icon: Leaf, label: 'Plant Species', val: '40+', sub: 'Growth Database' }
                                    ].map((slide, i) => (
                                        <SwiperSlide key={i} className="rounded-[32px] bg-white/80 backdrop-blur-xl border border-white shadow-2xl p-8 flex flex-col justify-between select-none">
                                            <div className={`h-14 w-14 rounded-2xl flex items-center justify-center ${slide.bg}/10 ${slide.color} mb-4`}>
                                                <slide.icon className="h-7 w-7" />
                                            </div>
                                            <div>
                                                <div className={`text-5xl font-black ${slide.color} mb-2 tracking-tighter`}>{slide.val}</div>
                                                <h3 className="text-xl font-bold text-slate-800">{slide.label}</h3>
                                                <p className="text-slate-500 mt-1 font-medium text-sm">{slide.sub}</p>
                                            </div>
                                            <div className={`h-1.5 w-full ${slide.bg}/20 rounded-full mt-6`}>
                                                <div className={`h-full w-[92%] ${slide.bg} rounded-full`} />
                                            </div>
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                            </motion.div>
                        </div>
                    </div>
                </section>
            </main>
        </>
    )
}
