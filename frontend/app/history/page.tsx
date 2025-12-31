"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { History, Eye, Trash2, ArrowLeft, Calendar, Leaf } from "lucide-react";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from "framer-motion";

export default function HistoryPage() {
    const router = useRouter();
    const [history, setHistory] = useState<any[]>([]);

    useEffect(() => {
        const saved = localStorage.getItem('compostHistory');
        if (saved) {
           try {
              setHistory(JSON.parse(saved));
           } catch (e) {
              console.error("Failed to parse history", e);
           }
        }
    }, []);

    const clearHistory = () => {
        if(confirm("Are you sure you want to clear your analysis history?")) {
           setHistory([]);
           localStorage.removeItem('compostHistory');
        }
    };
  
    const deleteHistoryItem = (id: number) => {
       const updated = history.filter(item => item.id !== id);
       setHistory(updated);
       localStorage.setItem('compostHistory', JSON.stringify(updated));
    }
  
    // Simple load function that pushes data to state - wait, passing state between routes is tricky without context.
    // Ideally we'd use a context or query params. For now, I'll skip "viewing" in detail on a separate page 
    // and just let them see the high level stats here. Use the Analysis page for full detail.
    // ACTUALLY: I can save the 'current' item to localStorage as 'tempLoad' and redirect to /analyze?load=true
    const loadReport = (entry: any) => {
         // This is a quick hack to pass data. A Context would be better in a larger app.
         // Or just rely on the user manually re-entering. 
         // Let's keep it simple: Just show the summary card here.
         console.log("Loading", entry);
    };

    return (
        <main className="min-h-screen bg-muted/5 pb-20">
            <div className="max-w-7xl mx-auto px-6 pt-10">
                <div className="flex items-center justify-between mb-12">
                     <div className="flex items-center gap-4">
                        <Link href="/" className="p-2 rounded-full bg-background border hover:bg-muted transition-colors">
                           <ArrowLeft className="h-5 w-5 text-muted-foreground" />
                        </Link>
                        <div>
                             <h1 className="text-3xl font-black">Analysis History</h1>
                             <p className="text-muted-foreground font-medium">Your archive of past soil maturity reports.</p>
                        </div>
                     </div>
                     {history.length > 0 && (
                        <Button variant="outline" onClick={clearHistory} className="text-destructive hover:bg-destructive/10 border-destructive/20 gap-2">
                           <Trash2 className="h-4 w-4" /> Clear Archive
                        </Button>
                     )}
                </div>

                {history.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-background rounded-[40px] border-4 border-dashed border-muted shadow-sm">
                       <div className="h-32 w-32 rounded-full bg-muted/20 flex items-center justify-center mb-6">
                          <History className="h-12 w-12 text-muted-foreground opacity-30" />
                       </div>
                       <h3 className="text-2xl font-black text-muted-foreground mb-2">No Reports Found</h3>
                       <p className="text-muted-foreground max-w-md text-center mb-8">Run your first compost analysis to save it to your local history archive.</p>
                       <Link href="/analyze">
                           <Button size="lg" className="rounded-full bg-emerald-600 hover:bg-emerald-700 font-bold">Start New Analysis</Button>
                       </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                       {history.map((entry, idx) => (
                          <motion.div 
                             key={entry.id}
                             initial={{ opacity: 0, scale: 0.95 }}
                             animate={{ opacity: 1, scale: 1 }}
                             transition={{ delay: idx * 0.05 }}
                             className="bg-white dark:bg-zinc-900 rounded-[32px] overflow-hidden shadow-sm hover:shadow-xl transition-all group border border-border/50"
                          >
                             <div className={`h-2 w-full ${['Mature', 'Curing'].includes(entry.result.Compost_Quality_Assessment?.Maturity_Stage) ? 'bg-emerald-500' : 'bg-orange-500'}`} />
                             <div className="p-8 space-y-6">
                                <div className="flex justify-between items-start">
                                   <div>
                                      <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">
                                         <Calendar className="h-3 w-3" />
                                         {new Date(entry.date).toLocaleDateString()}
                                      </div>
                                      <div className="text-xl font-black mt-2">{entry.result.Compost_Quality_Assessment.Maturity_Stage} Compost</div>
                                   </div>
                                   <div className="h-10 w-10 text-xs rounded-full bg-muted flex items-center justify-center font-black">
                                      {entry.result.Compost_Quality_Assessment.Predicted_Score.toFixed(0)}
                                   </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">Quality Status</span>
                                        <span className="font-bold">{entry.result.Compost_Quality_Assessment.Quality_Status}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">Plants Suitable</span>
                                        <span className="font-bold">{entry.result.Plant_Usability_Guide.Suitable_Plants_For_Use.length} Species</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">Issues Detected</span>
                                        <span className="font-bold text-orange-600">{entry.result.Compost_Quality_Assessment.Parameter_Improvements.length}</span>
                                    </div>
                                </div>
    
                                <div className="pt-4 border-t flex gap-2">
                                   <Button 
                                      variant="outline" 
                                      className="flex-1 rounded-xl group-hover:bg-primary/5 border-muted-foreground/20 hover:text-primary transition-colors"
                                      disabled // Placeholder for now
                                   >
                                      <Eye className="h-4 w-4 mr-2" /> Details
                                   </Button>
                                   <Button 
                                      variant="ghost" 
                                      size="icon"
                                      className="rounded-xl text-destructive hover:bg-destructive/10"
                                      onClick={() => deleteHistoryItem(entry.id)}
                                   >
                                      <Trash2 className="h-4 w-4" />
                                   </Button>
                                </div>
                             </div>
                          </motion.div>
                       ))}
                    </div>
                )}
            </div>
        </main>
    );
}
