"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Leaf, Droplets, FlaskConical, Thermometer, Wind, Sprout, AlertCircle, CheckCircle2, Activity, Clock, FileText, ChevronRight, Share2, Download, History, Search, Trash2, Eye, Twitter, Github, Linkedin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ParameterRadarChart } from "@/components/ParameterRadarChart";
import { PlantCard } from "@/components/PlantCard";
import { Tooltip } from "@/components/ui/tooltip-custom";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import { BackgroundAnimation } from "@/components/BackgroundAnimation";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const FEATURE_NAMES = [
  { id: "Temperature", label: "Temperature", unit: "°C", icon: Thermometer, color: "text-orange-500", bg: "bg-orange-500/10", tooltip: "Ideally between 40-60°C for active composting." },
  { id: "MC(%)", label: "Moisture Content", unit: "%", icon: Droplets, color: "text-blue-500", bg: "bg-blue-500/10", tooltip: "Optimal range is 40-60%. Too dry slows process, too wet causes odors." },
  { id: "pH", label: "pH Level", unit: "", icon: FlaskConical, color: "text-purple-500", bg: "bg-purple-500/10", tooltip: "Neutral to slightly alkaline (6.5-8.0) is best for finished compost." },
  { id: "C/N Ratio", label: "C/N Ratio", unit: "", icon: Wind, color: "text-emerald-500", bg: "bg-emerald-500/10", tooltip: "Carbon to Nitrogen ratio. Target 25-30:1 for fastest decomposition." },
  { id: "Ammonia(mg/kg)", label: "Ammonia", unit: "mg/kg", icon: FlaskConical, color: "text-yellow-600", bg: "bg-yellow-500/10", tooltip: "High levels indicate immature compost or lack of carbon." },
  { id: "Nitrate(mg/kg)", label: "Nitrate", unit: "mg/kg", icon: FlaskConical, color: "text-blue-600", bg: "bg-blue-600/10", tooltip: "Important plant nutrient. Increases as compost matures." },
  { id: "TN(%)", label: "Total Nitrogen", unit: "%", icon: Sprout, color: "text-green-600", bg: "bg-green-600/10", tooltip: "Essential for plant growth. typically 1-2% in finished compost." },
  { id: "TOC(%)", label: "Organic Carbon", unit: "%", icon: Leaf, color: "text-brown-600", bg: "bg-amber-800/10", tooltip: "Source of energy for microbes." },
  { id: "EC(ms/cm)", label: "Conductivity", unit: "ms/cm", icon: Wind, color: "text-indigo-500", bg: "bg-indigo-500/10", tooltip: "Salt content. Too high can damage sensitive plants." },
  { id: "OM(%)", label: "Organic Matter", unit: "%", icon: Leaf, color: "text-green-700", bg: "bg-green-700/10", tooltip: "Indicates the amount of organic material available to soil." },
  { id: "T Value", label: "T Value", unit: "", icon: Activity, color: "text-rose-500", bg: "bg-rose-500/10", tooltip: "Self-heating test value. Lower is more mature." },
  { id: "GI(%)", label: "Germination", unit: "%", icon: Sprout, color: "text-emerald-600", bg: "bg-emerald-600/10", tooltip: "Seed germination index. >80% indicates no phytotoxicity." },
];

export default function Home() {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("input");
  const [backendStatus, setBackendStatus] = useState<"checking" | "online" | "offline">("checking");
  const [history, setHistory] = useState<any[]>([]);
  const resultsRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('compostHistory');
    if (saved) {
       try {
          setHistory(JSON.parse(saved));
       } catch (e) {
          console.error("Failed to parse history", e);
       }
    }

    const checkHealth = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/health");
        if (res.ok) setBackendStatus("online");
        else setBackendStatus("offline");
      } catch {
        setBackendStatus("offline");
      }
    };
    checkHealth();
    const interval = setInterval(checkHealth, 10000);
    return () => clearInterval(interval);
  }, []);

  const saveToHistory = (newEntry: any) => {
     const updated = [newEntry, ...history];
     setHistory(updated);
     localStorage.setItem('compostHistory', JSON.stringify(updated));
  };

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

  const loadHistoryItem = (item: any) => {
     setFormData(item.inputs);
     setResult(item.result);
     setActiveTab("results");
     setTimeout(() => scrollToSection("analysis-hub"), 100);
  };

  const handleInputChange = (id: string, value: string) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSample = () => {
    const getRandom = (min: number, max: number, decimals: number = 2) => {
      const val = Math.random() * (max - min) + min;
      return val.toFixed(decimals);
    };

    const sample = {
      "Temperature": getRandom(40, 60, 1),      // Optimal range
      "MC(%)": getRandom(50, 60, 1),            // Optimal range
      "pH": getRandom(6.5, 7.5, 1),             // Neutral
      "C/N Ratio": getRandom(20, 30, 1),        // Optimal
      "Ammonia(mg/kg)": getRandom(10, 100, 1),  // Low toxicity
      "Nitrate(mg/kg)": getRandom(400, 800, 1), // Good nutrients
      "TN(%)": getRandom(1.2, 2.0, 2),          // Good N
      "TOC(%)": getRandom(30, 40, 1),           // Good C
      "EC(ms/cm)": getRandom(1.0, 3.0, 2),      // Safe salinity
      "OM(%)": getRandom(45, 65, 1),            // Good organic matter
      "T Value": getRandom(0.6, 0.8, 2),        // Stable
      "GI(%)": getRandom(85, 99, 1)             // High germination
    };
    setFormData(sample);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const params: Record<string, number> = {};
    for (const item of FEATURE_NAMES) {
      const val = parseFloat(formData[item.id] || "");
      if (isNaN(val)) {
        setError(`Please enter a valid number for ${item.label}`);
        setLoading(false);
        return;
      }
      params[item.id] = val;
    }

    try {
      const response = await fetch("http://localhost:5000/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Analysis failed");
      }

      const data = await response.json();
      setResult(data);
      
      saveToHistory({
         id: Date.now(),
         date: new Date().toISOString(),
         inputs: params,
         result: data
      });

      setActiveTab("results");
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!resultsRef.current) return;
    
    try {
      const canvas = await html2canvas(resultsRef.current, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Compost_Analysis_${Date.now()}.pdf`);
    } catch (err) {
      console.error("PDF Export Failed", err);
    }
  };

  const handleExportCSV = () => {
    if (!result) return;
    
    const headers = ["Parameter", "Value", "Unit"];
    const rows = FEATURE_NAMES.map(f => [
      f.label, 
      formData[f.id] || "0", 
      f.unit
    ]);
    
    rows.push(["---", "---", "---"]);
    rows.push(["Predicted Score", result.Compost_Quality_Assessment.Predicted_Score.toFixed(2), ""]);
    rows.push(["Quality Status", result.Compost_Quality_Assessment.Quality_Status, ""]);
    rows.push(["Maturity Stage", result.Compost_Quality_Assessment.Maturity_Stage, ""]);

    let csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n" 
      + rows.map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `compost_data_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 120; // Height of sticky navbar + extra padding
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <main className="min-h-screen relative overflow-hidden bg-background selection:bg-primary/30 scroll-smooth">
      <AnimatePresence>
         {loading && <LoadingOverlay />}
      </AnimatePresence>
      <BackgroundAnimation />
      
      {/* Nav */}
      <nav className="sticky top-0 z-50 glass border-b px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 group">
           <div className="h-10 w-10 nature-gradient rounded-xl flex items-center justify-center text-white shadow-lg group-hover:rotate-12 transition-transform">
              <Leaf className="h-6 w-6" />
           </div>
           <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-emerald-800">
             CompostQA <span className="text-muted-foreground font-light text-sm uppercase px-2 py-0.5 bg-muted rounded">v2.0</span>
           </span>
        </div>
        <div className="flex items-center gap-6">
           <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-muted/50 border text-[10px] font-bold uppercase tracking-widest">
              <div className={`h-2 w-2 rounded-full ${backendStatus === 'online' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : backendStatus === 'offline' ? 'bg-destructive' : 'bg-amber-500 animate-pulse'}`} />
              API: {backendStatus}
           </div>
           <button onClick={() => setActiveTab("input")} className={`text-sm font-medium transition-colors ${activeTab === 'input' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}>Optimizer</button>
           <button onClick={() => setActiveTab("results")} className={`text-sm font-medium transition-colors ${activeTab === 'results' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}>Intelligence</button>
           <button 
              onClick={() => setActiveTab("history")} 
              className={`text-sm font-medium transition-colors flex items-center gap-2 ${activeTab === 'history' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
           >
              History
           </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        
        {/* Hero Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-12 mb-16">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-1 space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 text-xs font-bold uppercase tracking-wider">
               <Sprout className="h-3 w-3" />
               Sustainable Agriculture OS
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-none">
              Analyze Your <br />
              <span className="text-primary italic">Compost</span> Potential
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-xl">
              Precision machine learning for soil health. Transform raw laboratory data into actionable maturity insights and customized plant growth guides.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
               <Button 
                  onClick={() => {
                    setActiveTab("input");
                    setTimeout(() => scrollToSection("analysis-hub"), 100);
                  }} 
                  size="lg" 
                  className="rounded-full h-14 px-8 text-lg nature-gradient border-none hover:shadow-primary/20 hover:scale-105 transition-all shadow-xl"
               >
                  Get Started <ChevronRight className="ml-2 h-5 w-5" />
               </Button>
               <Button 
                  variant="ghost" 
                  onClick={() => {
                    handleSample();
                    setActiveTab("input");
                    setTimeout(() => scrollToSection("analysis-hub"), 100);
                  }} 
                  size="lg" 
                  className="rounded-full h-14 px-8 text-lg hover:bg-primary/5 border border-primary/10"
               >
                  Try Sample Data
               </Button>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, rotate: 5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            className="flex-1 w-full max-w-[500px] aspect-square relative"
          >
             <div className="absolute inset-0 bg-primary/20 rounded-[40px] blur-3xl -rotate-6 animate-pulse" />
             <div className="relative glass rounded-[40px] p-8 h-full flex flex-col items-center justify-center overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 nature-gradient" />
                <div className="animate-leaf mb-6">
                   <div className="h-32 w-32 rounded-3xl nature-gradient flex items-center justify-center text-white shadow-2xl">
                      <Sprout className="h-20 w-20" />
                   </div>
                </div>
                <div className="text-center space-y-2">
                   <div className="text-3xl font-bold">92.4% Accuracy</div>
                   <p className="text-muted-foreground">Random Forest Regressor V4</p>
                </div>
                {/* Micro Stats */}
                <div className="mt-8 w-full grid grid-cols-2 gap-4">
                   <div className="p-4 rounded-2xl bg-muted/30 border text-center">
                      <div className="text-xs font-bold uppercase text-muted-foreground mb-1">Total Signals</div>
                      <div className="text-xl font-bold">12 KPI's</div>
                   </div>
                   <div className="p-4 rounded-2xl bg-muted/30 border text-center">
                      <div className="text-xs font-bold uppercase text-muted-foreground mb-1">Plant DB</div>
                      <div className="text-xl font-bold">40+ Species</div>
                   </div>
                </div>
             </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-8 border-t min-h-[800px]">
          {/* Main Controls Section */}
          <section className="mb-20 lg:col-span-12 scroll-mt-24" id="analysis-hub">
              <div className="flex items-end justify-between mb-8">
                 <div>
                    <h2 className="text-4xl font-black text-foreground flex items-center gap-3">
                       Analysis <span className="text-emerald-600">Hub</span>
                    </h2>
                    <p className="text-muted-foreground mt-2 font-medium">Precision calibration based on standardized environmental soil testing metrics.</p>
                 </div>
              </div>

              <Card className="glass border-none shadow-2xl rounded-[40px] overflow-hidden relative">
                 <div className="absolute top-0 left-0 w-full h-2 nature-gradient" />
                 <CardHeader className="pt-10 px-10 pb-0">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-3xl font-bold flex items-center gap-3">
                         <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Search className="h-5 w-5 text-primary" />
                         </div>
                         Metric Profile
                      </CardTitle>
                      <Button variant="ghost" className="text-primary hover:bg-primary/5 gap-2" onClick={handleSample}>
                         Fast-fill Samples
                      </Button>
                   </div>
                </CardHeader>
                <CardContent className="p-10">
                   <form onSubmit={handleSubmit} className="space-y-8">
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-10">
                         {FEATURE_NAMES.map((item) => (
                           <div key={item.id} className="space-y-3 group">
                              <div className="flex items-center justify-between">
                                 <Tooltip content={item.tooltip}>
                                    <label className="text-sm font-bold flex items-center gap-2 group-hover:text-primary transition-colors cursor-help">
                                       <div className={`p-1.5 rounded-lg ${item.bg} ${item.color}`}>
                                          <item.icon className="h-4 w-4" />
                                       </div>
                                       {item.label}
                                    </label>
                                 </Tooltip>
                                 <span className="text-[10px] font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded">{item.unit || "VALUE"}</span>
                              </div>
                              <Input 
                                 placeholder="0.00"
                                 type="number"
                                 step="any"
                                 value={formData[item.id] || ""}
                                 onChange={(e) => handleInputChange(item.id, e.target.value)}
                                 className="h-12 text-lg font-medium border-border/50 bg-muted/20 focus:bg-background focus:ring-primary/20 rounded-xl px-4 transition-all"
                              />
                           </div>
                         ))}
                      </div>
                      
                      <div className="pt-8 border-t flex flex-col sm:flex-row gap-4">
                         <Button 
                            type="submit" 
                            disabled={loading}
                            className="flex-1 h-16 text-xl font-bold nature-gradient border-none rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                         >
                            {loading ? "INITIALIZING MODEL..." : "GENERATE COMPREHENSIVE REPORT"}
                         </Button>
                         <Button 
                            type="button" 
                            variant="outline" 
                            className="h-16 px-8 rounded-2xl border-border/50 text-muted-foreground font-bold hover:bg-muted/50 transition-all"
                            onClick={() => setFormData({})}
                         >
                            RESET
                         </Button>
                      </div>

                      {error && (
                        <div className="flex items-center gap-2 p-4 rounded-2xl bg-destructive/10 text-destructive text-sm font-bold border border-destructive/20 animate-in fade-in zoom-in-95">
                           <AlertCircle className="h-5 w-5" />
                           {error}
                        </div>
                      )}
                   </form>
                </CardContent>
             </Card>
          </section>

          {/* History Section */}
          <section className={`lg:col-span-12 space-y-8 ${activeTab === 'history' ? 'block' : 'hidden'}`}>
             <div className="mb-8 flex items-center justify-between">
                <div>
                  <h2 className="text-4xl font-black mb-2 tracking-tight">Analysis <span className="text-primary">History</span></h2>
                  <p className="text-muted-foreground font-medium">Review your past soil composition analysis reports.</p>
                </div>
                {history.length > 0 && (
                   <Button variant="outline" onClick={clearHistory} className="text-destructive hover:bg-destructive/10 border-destructive/20">
                      Clear History
                   </Button>
                )}
             </div>

             {history.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-muted/10 rounded-[60px] border-4 border-dashed border-border/50">
                   <div className="h-32 w-32 rounded-full border-4 border-muted flex items-center justify-center mb-8">
                      <History className="h-12 w-12 text-muted-foreground opacity-30" />
                   </div>
                   <h3 className="text-2xl font-black text-muted-foreground opacity-30 mb-2 tracking-tighter uppercase">No History Found</h3>
                   <p className="text-muted-foreground font-medium">Run your first analysis to see it here.</p>
                   <Button variant="link" onClick={() => setActiveTab("input")} className="mt-4 text-primary">
                      Go to Optimizer
                   </Button>
                </div>
             ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                   {history.map((entry) => (
                      <motion.div 
                         key={entry.id}
                         initial={{ opacity: 0, scale: 0.95 }}
                         animate={{ opacity: 1, scale: 1 }}
                         className="glass rounded-[32px] overflow-hidden border-none shadow-lg hover:shadow-2xl transition-all group"
                      >
                         <div className={`h-2 w-full ${entry.result.Compost_Quality_Assessment.Quality_Status === 'High' ? 'bg-emerald-500' : 'bg-orange-500'}`} />
                         <div className="p-8 space-y-6">
                            <div className="flex justify-between items-start">
                               <div>
                                  <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">
                                     {new Date(entry.date).toLocaleDateString()}
                                  </div>
                                  <div className="text-2xl font-black">{entry.result.Compost_Quality_Assessment.Quality_Status} Quality</div>
                               </div>
                               <div className="px-3 py-1 rounded-full bg-primary/10 text-primary font-bold text-sm">
                                  Score: {entry.result.Compost_Quality_Assessment.Predicted_Score.toFixed(0)}
                               </div>
                            </div>

                            <div className="flex gap-2">
                               <Button 
                                  className="flex-1 rounded-xl nature-gradient"
                                  onClick={() => loadHistoryItem(entry)}
                               >
                                  <Eye className="h-4 w-4 mr-2" /> View
                               </Button>
                               <Button 
                                  variant="outline" 
                                  size="icon"
                                  className="rounded-xl border-destructive/20 text-destructive hover:bg-destructive/10"
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
          </section>

          {/* Result Section (Active only when result exists or results tab active) */}
          <section className={`lg:col-span-12 space-y-12 ${activeTab === 'results' ? 'block' : 'hidden'}`}>
             <AnimatePresence>
                {result ? (
                   <motion.div 
                      key="results-content"
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="space-y-12"
                      ref={resultsRef}
                   >
                      {/* Top Bar - Summary */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                         <Card className="glass border-none shadow-xl rounded-[32px] md:col-span-2 overflow-hidden relative">
                            <div className="absolute top-0 left-0 w-2 h-full nature-gradient" />
                            <CardContent className="p-10 flex flex-col md:flex-row items-center gap-10">
                               <div className="relative">
                                  <div className="w-40 h-40 rounded-full border-[12px] border-primary/10 flex items-center justify-center">
                                     <div className="text-5xl font-black text-primary">{result.Compost_Quality_Assessment.Predicted_Score.toFixed(0)}</div>
                                  </div>
                                  <div className="absolute -bottom-2 -right-2 bg-foreground text-background text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter">SCORE</div>
                               </div>
                               <div className="flex-1 space-y-4 text-center md:text-left">
                                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                                     <h2 className="text-4xl font-black">{result.Compost_Quality_Assessment.Quality_Status} QUALITY</h2>
                                     <div className="px-4 py-1 rounded-full bg-primary/10 text-primary font-bold border border-primary/20">{result.Compost_Quality_Assessment.Maturity_Stage}</div>
                                  </div>
                                  <p className="text-lg text-muted-foreground leading-relaxed italic border-l-4 border-primary/20 pl-6 py-2">
                                     "{result.Compost_Quality_Assessment.Overall_Recommendation}"
                                  </p>
                                  <div className="flex gap-4 pt-2">
                                     <Button size="sm" variant="outline" onClick={handleDownloadPDF} className="rounded-full gap-2 border-primary/20 text-primary">
                                        <Download className="h-4 w-4" /> Download Report
                                     </Button>
                                     <Button size="sm" variant="outline" onClick={handleExportCSV} className="rounded-full gap-2 border-primary/20 text-primary">
                                        <Share2 className="h-4 w-4" /> Export Data
                                     </Button>
                                  </div>
                               </div>
                            </CardContent>
                         </Card>

                         <div className="grid grid-rows-3 gap-4">
                            <div className="glass rounded-[24px] p-6 flex items-center gap-4 group hover:bg-orange-500/5 transition-colors">
                               <div className="h-12 w-12 rounded-2xl bg-orange-500/10 text-orange-600 flex items-center justify-center group-hover:scale-110 transition-transform"> <Clock className="h-6 w-6" /> </div>
                               <div>
                                  <div className="text-2xl font-black">{result.Compost_Quality_Assessment.Days_to_Maturity} Days</div>
                                  <div className="text-xs font-bold text-muted-foreground uppercase opacity-70 tracking-widest">To Final Maturity</div>
                               </div>
                            </div>
                            <div className="glass rounded-[24px] p-6 flex items-center gap-4 group hover:bg-emerald-500/5 transition-colors">
                               <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform"> <Sprout className="h-6 w-6" /> </div>
                               <div>
                                  <div className="text-2xl font-black">{result.Plant_Usability_Guide.Suitable_Plants_For_Use.length} Species</div>
                                  <div className="text-xs font-bold text-muted-foreground uppercase opacity-70 tracking-widest">Ready for Planting</div>
                               </div>
                            </div>
                            <div className="glass rounded-[24px] p-6 flex items-center gap-4 group hover:bg-blue-500/5 transition-colors">
                               <div className="h-12 w-12 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform"> <Activity className="h-6 w-6" /> </div>
                               <div>
                                  <div className="text-2xl font-black">{result.Compost_Quality_Assessment.Parameter_Improvements.length} Alerts</div>
                                  <div className="text-xs font-bold text-muted-foreground uppercase opacity-70 tracking-widest">Requiring Attention</div>
                               </div>
                            </div>
                         </div>
                      </div>

                      {/* Charts and Optimization */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                         <div className="space-y-6">
                            <h3 className="text-2xl font-black flex items-center gap-3">
                               <div className="h-8 w-8 rounded-lg bg-indigo-500/10 text-indigo-600 flex items-center justify-center"> <Activity className="h-4 w-4" /> </div>
                               CHEMICAL FINGERPRINT
                            </h3>
                            <Card className="glass rounded-[40px] border-none p-10 h-full flex flex-col justify-center">
                               <ParameterRadarChart data={formData as any} />
                               <div className="mt-8 text-center text-sm text-muted-foreground font-medium">
                                  Normalized KPI's visualization vs. Environmental baselines.
                               </div>
                            </Card>
                         </div>

                         <div className="space-y-6">
                            <h3 className="text-2xl font-black flex items-center gap-3">
                               <div className="h-8 w-8 rounded-lg bg-orange-500/10 text-orange-600 flex items-center justify-center"> <AlertCircle className="h-4 w-4" /> </div>
                               OPTIMIZATION ROADMAP
                            </h3>
                            <div className="space-y-4">
                               {result.Compost_Quality_Assessment.Parameter_Improvements.map((imp: any, idx: number) => (
                                 <Card key={idx} className="glass border-none rounded-3xl overflow-hidden group">
                                    <div className={`h-1.5 w-full ${imp.Priority === 'High' ? 'bg-destructive' : 'bg-orange-500'}`} />
                                    <CardContent className="p-6">
                                       <div className="flex justify-between items-start mb-6">
                                          <div>
                                             <div className="text-xl font-bold group-hover:text-primary transition-colors">{imp.Parameter}</div>
                                             <div className={`text-[10px] font-black uppercase tracking-widest mt-1 ${imp.Priority === 'High' ? 'text-destructive' : 'text-orange-500'}`}> {imp.Priority} PRIORITY ISSUE </div>
                                          </div>
                                          <div className="text-right">
                                             <div className="text-2xl font-black text-muted-foreground opacity-30">{imp.Current}</div>
                                             <div className="text-[10px] font-bold text-muted-foreground uppercase">CURRENT LEVEL</div>
                                          </div>
                                       </div>
                                       <div className="space-y-3">
                                          {imp.Actions.map((action: string, aidx: number) => (
                                            <div key={aidx} className="flex items-start gap-4 p-3 rounded-xl bg-muted/20 group-hover:bg-primary/5 transition-colors">
                                               <div className="h-6 w-6 rounded-full bg-background border flex items-center justify-center mt-0.5 shrink-0 shadow-sm font-black text-[10px] text-primary">{aidx + 1}</div>
                                               <p className="text-sm font-medium leading-tight"> {action} </p>
                                            </div>
                                          ))}
                                       </div>
                                    </CardContent>
                                 </Card>
                               ))}
                            </div>
                         </div>
                      </div>

                      {/* Plant Matrix */}
                      <div className="space-y-12">
                         <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b-2 pb-8">
                            <div>
                               <h2 className="text-5xl font-black mb-4">Plant Compatibility <span className="text-primary">Matrix</span></h2>
                               <p className="text-xl text-muted-foreground">ML-Matched species based on the current nutrient & toxicity profile.</p>
                            </div>
                            <div className="flex gap-4">
                               <div className="flex items-center gap-2 px-4 py-2 rounded-full border bg-muted/50 text-xs font-bold uppercase tracking-wider">
                                  <div className="h-3 w-3 rounded-full bg-primary" /> Ready to Plant
                               </div>
                               <div className="flex items-center gap-2 px-4 py-2 rounded-full border bg-muted/50 text-xs font-bold uppercase tracking-wider">
                                  <div className="h-3 w-3 rounded-full bg-orange-400" /> Conditional
                               </div>
                            </div>
                         </div>

                            {/* Suitable Grid */}
                         <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                            {result.Plant_Usability_Guide.Suitable_Plants_For_Use.length > 0 ? (
                              result.Plant_Usability_Guide.Suitable_Plants_For_Use.map((plant: any, idx: number) => (
                                <PlantCard key={idx} plant={plant} />
                              ))
                            ) : (
                              <div className="col-span-full py-12 text-center border-2 border-dashed border-muted rounded-3xl bg-muted/10">
                                 <Sprout className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-50" />
                                 <h3 className="text-xl font-bold text-muted-foreground">No Perfectly Suitable Plants Found</h3>
                                 <p className="max-w-md mx-auto mt-2 text-muted-foreground/80">
                                    The current compost profile has multiple constraints preventing optimal growth. 
                                    Check the "Conditional" list below or refer to the improvements section.
                                 </p>
                              </div>
                            )}

                            {/* Conditional Simple List */}
                            {result.Plant_Usability_Guide.Conditionally_Usable_Plants.map((plant: any, idx: number) => (
                              <div key={idx} className="glass rounded-[40px] p-10 border-none border-l-4 border-orange-400 group relative grayscale hover:grayscale-0 transition-opacity">
                                 <div className="absolute top-4 right-4 h-8 w-8 rounded-full bg-orange-400/10 text-orange-600 flex items-center justify-center"> <AlertCircle className="h-4 w-4" /> </div>
                                 <h4 className="text-xl font-bold mb-1 opacity-50 group-hover:opacity-100">{plant.Plant_Name}</h4>
                                 <p className="text-[10px] font-black uppercase text-muted-foreground mb-4 opacity-50 group-hover:opacity-100">{plant.Plant_Type}</p>
                                 <div className="text-xs font-bold text-orange-600 mb-2">RESTRICTED: {plant.When_to_Use}</div>
                                 <p className="text-xs text-muted-foreground italic leading-relaxed">Reason: {plant.Reason}</p>
                              </div>
                            ))}
                         </div>
                      </div>
                   </motion.div>
                ) : (
                   <div className="flex flex-col items-center justify-center py-20 bg-muted/10 rounded-[60px] border-4 border-dashed border-border/50">
                      <div className="h-32 w-32 rounded-full border-4 border-muted flex items-center justify-center mb-8">
                         <Search className="h-12 w-12 text-muted-foreground opacity-30" />
                      </div>
                      <h3 className="text-4xl font-black text-muted-foreground opacity-30 mb-2 tracking-tighter uppercase">Waiting for Metrics</h3>
                      <p className="text-muted-foreground font-medium">Configure your KPI's in the Optimizer hub above.</p>
                   </div>
                )}
             </AnimatePresence>
          </section>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-20 border-t py-20 px-6 bg-muted/10 relative">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
             <div className="space-y-6 max-w-sm">
                <div className="flex items-center gap-2">
                   <div className="h-8 w-8 nature-gradient rounded-lg flex items-center justify-center text-white">
                      <Leaf className="h-5 w-5" />
                   </div>
                   <span className="text-2xl font-black">CompostQA</span>
                </div>
                <p className="text-muted-foreground font-medium leading-relaxed">
                   Democratizing precision agriculture through Artificial Intelligence. Built for large scale farmers and community gardeners alike.
                </p>
                <div className="flex gap-4">
                   <a href="#" className="h-10 w-10 border rounded-full flex items-center justify-center hover:bg-primary/5 hover:border-primary hover:text-primary transition-all">
                      <Twitter className="h-4 w-4" />
                   </a>
                   <a href="#" className="h-10 w-10 border rounded-full flex items-center justify-center hover:bg-primary/5 hover:border-primary hover:text-primary transition-all">
                      <Github className="h-4 w-4" />
                   </a>
                   <a href="#" className="h-10 w-10 border rounded-full flex items-center justify-center hover:bg-primary/5 hover:border-primary hover:text-primary transition-all">
                      <Linkedin className="h-4 w-4" />
                   </a>
                </div>
             </div>
             <div className="grid grid-cols-2 md:grid-cols-3 gap-16">
                <div className="space-y-4">
                   <h5 className="font-black text-sm uppercase tracking-widest">Platform</h5>
                   <ul className="space-y-2 text-sm text-muted-foreground font-medium">
                      <li><a href="#" className="hover:text-primary transition-colors">ML Models</a></li>
                      <li><a href="#" className="hover:text-primary transition-colors">Integrations</a></li>
                      <li><a href="#" className="hover:text-primary transition-colors">Documentation</a></li>
                   </ul>
                </div>
                <div className="space-y-4">
                   <h5 className="font-black text-sm uppercase tracking-widest">Support</h5>
                   <ul className="space-y-2 text-sm text-muted-foreground font-medium">
                      <li>
                        <span className={`inline-flex items-center gap-2 ${backendStatus === 'online' ? 'text-emerald-500' : 'text-destructive'}`}>
                           <div className={`h-2 w-2 rounded-full ${backendStatus === 'online' ? 'bg-emerald-500 animate-pulse' : 'bg-destructive'}`} />
                           API {backendStatus === 'online' ? 'Operational' : 'Offline'}
                        </span>
                      </li>
                      <li><a href="#" className="hover:text-primary transition-colors">Help Center</a></li>
                      <li><a href="#" className="hover:text-primary transition-colors">Soil Guides</a></li>
                   </ul>
                </div>
             </div>
          </div>
          <div className="max-w-7xl mx-auto mt-20 pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">
             <div>© 2025 AGRI-TECH INNOVATIONS. ALL RIGHTS RESERVED.</div>
             <div className="flex gap-8">
                <a href="#">Privacy Policy</a>
                <a href="#">Terms of Service</a>
                <a href="#">Cookies</a>
             </div>
          </div>
      </footer>
    </main>
  );
}
