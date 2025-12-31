'use client'
import { motion } from 'framer-motion'
import { Award, CheckCircle2, Globe2, Users } from 'lucide-react'

const stats = [
    { icon: Users, label: "Active Farmers", value: "2,500+" },
    { icon: Globe2, label: "Soil Analyzed", value: "15k Tons" },
    { icon: CheckCircle2, label: "Accuracy Rate", value: "92.4%" },
    { icon: Award, label: "USDA Compliant", value: "Standard" },
]

export function StatsStrip() {
    return (
        <section className="relative z-10 border-y border-black/5 bg-white/50 backdrop-blur-sm">
            <div className="mx-auto max-w-7xl px-6">
                <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-black/5">
                    {stats.map((stat, i) => (
                        <motion.div 
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1, duration: 0.5 }}
                            className="flex flex-col items-center justify-center py-8 lg:py-10 group hover:bg-white/40 transition-colors"
                        >
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 rounded-full bg-emerald-500/10 text-emerald-600 group-hover:scale-110 transition-transform">
                                    <stat.icon className="h-5 w-5" />
                                </div>
                                <span className="text-2xl lg:text-3xl font-black text-foreground">{stat.value}</span>
                            </div>
                            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{stat.label}</span>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
