import { Cpu, Zap, Microscope, Sprout } from 'lucide-react'
import Image from 'next/image'

export default function ContentSection() {
    return (
        <section className="py-20 md:py-32 overflow-hidden relative z-10">
            <div className="mx-auto max-w-7xl space-y-8 px-6 md:space-y-24">
                <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-center">
                    <div className="flex-1 space-y-8">
                        <h2 className="text-4xl font-bold lg:text-5xl text-foreground leading-tight">
                            The ecosystem bringing <span className="text-emerald-600">clarity</span> to decomposition.
                        </h2>
                        <div className="space-y-6 text-lg text-muted-foreground">
                            <p className="leading-relaxed">
                                Composting is evolving to be more than just organic waste management. <span className="text-foreground font-bold">It supports a regenerative ecosystem</span> — from soil health to sustainable food production systems.
                            </p>
                            <p className="leading-relaxed">
                                Our platform bridges the gap between laboratory chemical analysis and practical agricultural application, helping farmers and gardeners make data-driven decisions.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-6 pt-4">
                            <div className="space-y-3 p-4 rounded-2xl bg-muted/50 border border-border/50">
                                <div className="flex items-center gap-2 text-emerald-600">
                                    <Microscope className="size-5" />
                                    <h3 className="text-sm font-bold uppercase tracking-wider">Precision</h3>
                                </div>
                                <p className="text-muted-foreground text-sm font-medium">Validating maturity through normalized chemical indicators and biological assays.</p>
                            </div>
                            <div className="space-y-3 p-4 rounded-2xl bg-muted/50 border border-border/50">
                                <div className="flex items-center gap-2 text-emerald-600">
                                    <Sprout className="size-5" />
                                    <h3 className="text-sm font-bold uppercase tracking-wider">Growth</h3>
                                </div>
                                <p className="text-muted-foreground text-sm font-medium">Direct correlation between compost quality and specific plant species compatibility.</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex-1 w-full">
                        <div className="relative aspect-square md:aspect-[4/3] w-full rounded-3xl border border-border/50 bg-white/50 backdrop-blur-sm p-2 shadow-2xl shadow-emerald-900/5">
                             <div className="absolute inset-0 bg-grid-black/[0.02]" />
                             <div className="w-full h-full rounded-[20px] bg-white overflow-hidden relative flex flex-col items-center justify-center border border-border/10">
                                <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/5 via-transparent to-transparent opacity-50" />
                                
                                <div className="relative z-10 flex flex-col items-center gap-6 text-center animate-pulse">
                                    <div className="h-24 w-24 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 shadow-xl">
                                        <Zap className="h-12 w-12" />
                                    </div>
                                    <div className="space-y-2">
                                        <div className="text-5xl font-black text-emerald-900 tracking-tight">92.4%</div>
                                        <div className="text-xs uppercase font-bold text-emerald-600 tracking-[0.2em]">Model Accuracy</div>
                                    </div>
                                </div>
                                
                                {/* Decorative UI elements */}
                                <div className="absolute bottom-6 left-6 right-6 h-1.5 bg-muted rounded-full overflow-hidden">
                                    <div className="h-full w-[92%] bg-emerald-500 rounded-full shadow-lg shadow-emerald-500/30" />
                                </div>
                             </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
