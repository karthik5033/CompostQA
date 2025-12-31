'use client'
import { Cpu, Fingerprint, Pencil, Settings2, Sparkles, Zap, Sprout, Activity, Leaf, BarChart3, Database, ShieldCheck } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Features() {
    return (
        // Reduced padding from py-20 to py-12 to remove blank space
        <section className="py-12 md:py-16 relative z-10" id="features">
            <div className="mx-auto max-w-6xl space-y-8 px-6">
                <div className="relative z-10 mx-auto max-w-2xl space-y-4 text-center">
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-balance text-3xl font-bold lg:text-4xl text-foreground drop-shadow-sm"
                    >
                        The Intelligence Behind <span className="text-emerald-600">Your Soil</span>
                    </motion.h2>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-muted-foreground text-lg leading-relaxed"
                    >
                        CompostAI transforms complex chemical data into actionable agricultural insights using advanced machine learning algorithms.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {[
                        { icon: Zap, color: 'text-yellow-600', bg: 'bg-yellow-500/10', title: 'Instant Analysis', desc: 'Real-time processing of 12 key compost parameters to determine maturity instantly.' },
                        { icon: Cpu, color: 'text-indigo-600', bg: 'bg-indigo-500/10', title: 'ML Powered', desc: 'Random Forest Regression model with 92.4% accuracy trained on 450+ verified samples.' },
                        { icon: Sprout, color: 'text-emerald-600', bg: 'bg-emerald-500/10', title: 'Plant Matching', desc: 'Suitability matching for over 40 plant species based on specific toxicity profiles.' },
                        { icon: Activity, color: 'text-orange-600', bg: 'bg-orange-500/10', title: 'Optimization', desc: 'Get prioritized, step-by-step remediation guides to fix chemical imbalances.' },
                        { icon: BarChart3, color: 'text-blue-600', bg: 'bg-blue-500/10', title: 'Visual Fingerprint', desc: 'Advanced radar charts and visualizations to understand compost composition.' },
                        { icon: ShieldCheck, color: 'text-rose-600', bg: 'bg-rose-500/10', title: 'Safety First', desc: 'Detection of phytotoxicity risks including Ammonia levels and Germination Index.' },
                    ].map((feature, idx) => (
                        <motion.div 
                            key={idx} 
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: idx * 0.1 }}
                            className="group relative overflow-hidden rounded-3xl border bg-white/50 backdrop-blur-sm p-6 hover:bg-white/80 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                        >
                             <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl ${feature.bg} ${feature.color} ring-1 ring-inset ring-black/5 group-hover:scale-110 transition-transform duration-300`}>
                                 <feature.icon className="h-6 w-6" />
                             </div>
                             <h3 className="mb-2 text-lg font-bold text-foreground tracking-wide">{feature.title}</h3>
                             <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                                 {feature.desc}
                             </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
