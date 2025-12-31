"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Leaf, Droplets, FlaskConical, Thermometer, Wind, Sprout, AlertCircle, Activity, Clock, Search, Download, Share2, ArrowLeft, CheckCircle2, XCircle, RotateCcw, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ParameterRadarChart } from "@/components/ParameterRadarChart";
import { PlantCard } from "@/components/PlantCard";
import { Tooltip } from "@/components/ui/tooltip-custom";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// --- CONFIGURATION ---
const FEATURE_DEFS = [
  { id: "Temperature", label: "Temperature", unit: "°C", icon: Thermometer, color: "text-orange-500", bg: "bg-orange-500/10", min: 0, max: 80, ideal: [40, 65], tooltip: "Active composting zone: 40-65°C." },
  { id: "MC(%)", label: "Moisture", unit: "%", icon: Droplets, color: "text-blue-500", bg: "bg-blue-500/10", min: 0, max: 100, ideal: [40, 60], tooltip: "Target 40-60%. Sponge-like consistency." },
  { id: "pH", label: "pH Level", unit: "pH", icon: FlaskConical, color: "text-purple-500", bg: "bg-purple-500/10", min: 0, max: 14, ideal: [6.0, 8.0], tooltip: "Neutral range (6-8) preferred." },
  { id: "C/N Ratio", label: "C/N Ratio", unit: ":1", icon: Wind, color: "text-emerald-500", bg: "bg-emerald-500/10", min: 0, max: 100, ideal: [20, 35], tooltip: "Carbon/Nitrogen balance. 30:1 is golden." },
  { id: "Ammonia(mg/kg)", label: "Ammonia", unit: "mg/kg", icon: FlaskConical, color: "text-yellow-600", bg: "bg-yellow-500/10", min: 0, max: 1000, ideal: [0, 100], tooltip: "<100 mg/kg indicates maturity." },
  { id: "Nitrate(mg/kg)", label: "Nitrate", unit: "mg/kg", icon: FlaskConical, color: "text-blue-600", bg: "bg-blue-600/10", min: 0, max: 2000, ideal: [200, 1000], tooltip: "Increases as compost stabilizes." },
  { id: "TN(%)", label: "Total Nitrogen", unit: "%", icon: Sprout, color: "text-green-600", bg: "bg-green-600/10", min: 0, max: 5, ideal: [1, 3], tooltip: "Nutrient value for plants." },
  { id: "TOC(%)", label: "Total Org. Carbon", unit: "%", icon: Leaf, color: "text-amber-700", bg: "bg-amber-700/10", min: 0, max: 60, ideal: [30, 45], tooltip: "Energy source for microbes." },
  { id: "EC(ms/cm)", label: "Conductivity", unit: "mS/cm", icon: Activity, color: "text-indigo-500", bg: "bg-indigo-500/10", min: 0, max: 10, ideal: [0, 4], tooltip: "Salinity. High EC hurts seedlings." },
  { id: "OM(%)", label: "Organic Matter", unit: "%", icon: Leaf, color: "text-green-700", bg: "bg-green-700/10", min: 0, max: 100, ideal: [40, 70], tooltip: "Overall organic content." },
  { id: "T Value", label: "Self-Heating (T)", unit: "", icon: Activity, color: "text-rose-500", bg: "bg-rose-500/10", min: 0, max: 5, ideal: [0, 1], tooltip: "Rotnegrad Self-heating test." },
  { id: "GI(%)", label: "Germination Index", unit: "%", icon: Sprout, color: "text-emerald-600", bg: "bg-emerald-600/10", min: 0, max: 120, ideal: [80, 120], tooltip: ">80% means no toxicity." },
];

// Custom Input Component with Real-time visual feedback
const SmartInput = ({ def, value, onChange }: { def: any, value: string, onChange: (val: string) => void }) => {
    const numVal = parseFloat(value);
    const status = isNaN(numVal) ? 'empty' : (numVal >= def.ideal[0] && numVal <= def.ideal[1] ? 'good' : 'warning');
    
    return (
        <div className="space-y-3 group relative">
             <div className="flex items-center justify-between">
                <Tooltip content={def.tooltip}>
                   <label className="text-sm font-bold flex items-center gap-2 group-hover:text-emerald-600 transition-colors cursor-help">
                      <div className={`p-1.5 rounded-lg ${def.bg} ${def.color} transition-transform group-hover:scale-110`}>
                         <def.icon className="h-4 w-4" />
                      </div>
                      {def.label}
                   </label>
                </Tooltip>
                
                {/* Status Badge */}
                <div className="flex items-center gap-2">
                    {status === 'good' && <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1 animate-in fade-in"><CheckCircle2 className="h-3 w-3" /> OPTIMAL</span>}
                    {status === 'warning' && <span className="text-[10px] font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full flex items-center gap-1 animate-in fade-in"><AlertCircle className="h-3 w-3" /> ATTENTION</span>}
                    <span className="text-[10px] font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded">{def.unit}</span>
                </div>
             </div>
             
             <div className="relative">
                <Input 
                   placeholder={`${def.ideal[0]} - ${def.ideal[1]}`}
                   type="number"
                   step="any"
                   value={value}
                   onChange={(e) => onChange(e.target.value)}
                   className={`h-12 text-lg font-medium border-border/50 bg-muted/20 focus:bg-white focus:ring-emerald-500/20 rounded-xl px-4 transition-all ${
                       status === 'good' ? 'border-emerald-500/50 bg-emerald-50/10' : 
                       status === 'warning' ? 'border-amber-500/30 bg-amber-50/10' : ''
                   }`}
                />
                {/* Micro Progress Bar */}
                {status !== 'empty' && (
                  <div className="absolute bottom-0 left-4 right-4 h-[2px] bg-muted/30 rounded-full overflow-hidden">
                      <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(((numVal - def.min) / (def.max - def.min)) * 100, 100)}%` }}
                          className={`h-full ${status === 'good' ? 'bg-emerald-500' : 'bg-amber-500'}`} 
                      />
                  </div>
                )}
             </div>
        </div>
    );
}

export default function AnalysisPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const [simulatedLog, setSimulatedLog] = useState<string>("");

  const handleInputChange = (id: string, value: string) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSample = (type: 'mature' | 'immature') => {
    // Pro Feature: Different sample types
    const noise = () => (Math.random() - 0.5) * 5;
    
    if (type === 'mature') {
        setFormData({
            "Temperature": (55 + noise()).toFixed(1),
            "MC(%)": (50 + noise()).toFixed(1),
            "pH": (7.2 + Math.random()).toFixed(1),
            "C/N Ratio": (25 + Math.random()*2).toFixed(1),
            "Ammonia(mg/kg)": "45.00",
            "Nitrate(mg/kg)": "850.00",
            "TN(%)": "1.85",
            "TOC(%)": "35.50",
            "EC(ms/cm)": "2.10",
            "OM(%)": "55.00",
            "T Value": "0.50",
            "GI(%)": "95.00"
        });
    } else {
        setFormData({
            "Temperature": (75 + noise()).toFixed(1), // Too high
            "MC(%)": (30 + noise()).toFixed(1), // Too dry
            "pH": (5.5 + Math.random()).toFixed(1), // Acidic
            "C/N Ratio": (15 + Math.random()).toFixed(1), // Nitrogen heavy
            "Ammonia(mg/kg)": "450.00",
            "Nitrate(mg/kg)": "100.00",
            "TN(%)": "0.80",
            "TOC(%)": "50.00",
            "EC(ms/cm)": "5.50",
            "OM(%)": "40.00",
            "T Value": "4.00",
            "GI(%)": "45.00"
        });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSimulatedLog("Connecting to Inference Engine...");

    const params: Record<string, number> = {};
    for (const item of FEATURE_DEFS) {
      const val = parseFloat(formData[item.id] || "");
      if (isNaN(val)) {
        setError(`Please check the value for ${item.label}`);
        setLoading(false);
        return;
      }
      params[item.id] = val;
    }

    // Cinematic Delay for Effect
    const logs = ["Parsing Chemical Profile...", "Running Random Forest Regression...", "Cross-referencing Plant Database...", "Generating Improvements..."];
    for (let i = 0; i < logs.length; i++) {
        setSimulatedLog(logs[i]);
        await new Promise(r => setTimeout(r, 400));
    }

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const response = await fetch(`${API_URL}/api/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        throw new Error((await response.json()).error || "Analysis failed");
      }

      const data = await response.json();
      setResult(data);
      
      const saved = localStorage.getItem('compostHistory');
      const history = saved ? JSON.parse(saved) : [];
      localStorage.setItem('compostHistory', JSON.stringify([
         { id: Date.now(), date: new Date().toISOString(), inputs: params, result: data },
         ...history
      ]));
      
      setTimeout(() => {
          resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);

    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  // ... (PDF/CSV handlers same as before) ...
  const handleDownloadPDF = async () => {
    if (!resultsRef.current) return;
    const canvas = await html2canvas(resultsRef.current, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`Compost_Analysis_${Date.now()}.pdf`);
  };

  const handleExportCSV = () => {
      if (!result) return;
      const rows = [
          ["Parameter", "Value", "Unit"],
          ...FEATURE_DEFS.map(f => [f.label, formData[f.id] || "0", f.unit]),
          ["---", "---", "---"],
          ["Predicted Score", result.Compost_Quality_Assessment.Predicted_Score.toFixed(2)],
          ["Quality Status", result.Compost_Quality_Assessment.Quality_Status],
          ["Maturity Stage", result.Compost_Quality_Assessment.Maturity_Stage]
      ];
      const csvContent = "data:text/csv;charset=utf-8," + rows.map(e => e.join(",")).join("\n");
      const link = document.createElement("a");
      link.setAttribute("href", encodeURI(csvContent));
      link.setAttribute("download", `compost_data_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  };

  return (
    <main className="min-h-screen bg-white">
      <AnimatePresence>
         {loading && (
             <div className="fixed inset-0 z-[100] bg-zinc-950/80 backdrop-blur-sm flex items-center justify-center">
                 <div className="text-center space-y-4">
                     <div className="h-16 w-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"/>
                     <div className="font-mono text-emerald-400 text-sm animate-pulse">{simulatedLog}</div>
                 </div>
             </div>
         )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-6 pt-8 pb-20">
         {/* Navigation */}
         <div className="flex items-center justify-between mb-10">
            <Link href="/" className="flex items-center gap-2 group text-muted-foreground hover:text-emerald-700 transition-colors">
               <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
               <span className="font-bold">Back to Home</span>
            </Link>
            <div className="flex gap-2">
                 <Button variant="outline" size="sm" onClick={() => handleSample('immature')} className="text-xs font-bold text-amber-600 border-amber-200 hover:bg-amber-50">
                    Load Immature Sample
                 </Button>
                 <Button variant="outline" size="sm" onClick={() => handleSample('mature')} className="text-xs font-bold text-emerald-600 border-emerald-200 hover:bg-emerald-50">
                    Load Mature Sample
                 </Button>
            </div>
         </div>
      
         <section className="mb-20">
             <div className="text-center mb-12 space-y-4">
                 <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-wide">
                    <Activity className="h-3 w-3" /> AI Analysis Engine v2.0
                 </div>
                 <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">Input Chemical Profile</h1>
                 <p className="text-slate-500 max-w-lg mx-auto text-lg">Enter lab results below. Our system checks parameter validity in real-time.</p>
             </div>

             <Card className="border shadow-2xl shadow-emerald-900/5 rounded-[40px] overflow-hidden bg-white relative">
                 <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500" />
                 <CardContent className="p-8 md:p-12">
                    <form onSubmit={handleSubmit} className="space-y-12">
                       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-10">
                          {FEATURE_DEFS.map((def) => (
                              <SmartInput 
                                  key={def.id} 
                                  def={def} 
                                  value={formData[def.id] || ""} 
                                  onChange={(val) => handleInputChange(def.id, val)}
                              />
                          ))}
                       </div>
                       
                       <div className="pt-8 border-t flex flex-col sm:flex-row gap-4 justify-center">
                          <Button 
                             type="button" 
                             variant="ghost" 
                             className="h-14 px-8 rounded-xl text-muted-foreground font-bold hover:bg-muted/50 transition-all hover:text-foreground"
                             onClick={() => setFormData({})}
                          >
                             <RotateCcw className="mr-2 h-4 w-4" /> Reset Form
                          </Button>
                          <Button 
                             type="submit" 
                             disabled={loading}
                             className="h-14 min-w-[240px] text-lg font-bold bg-emerald-600 hover:bg-emerald-700 text-white border-none rounded-xl shadow-xl shadow-emerald-500/20 transition-all hover:scale-105 active:scale-95"
                          >
                             Generate Report <ChevronRight className="ml-2 h-5 w-5" />
                          </Button>
                       </div>
                    </form>
                 </CardContent>
             </Card>
         </section>

         {/* Results Section */}
         <AnimatePresence>
            {result && (
               <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  ref={resultsRef}
                  className="space-y-8"
               >
                   {/* Divider */}
                   <div className="flex items-center gap-4 py-8">
                       <div className="h-px flex-1 bg-border/50" />
                       <span className="text-xs font-black uppercase text-muted-foreground tracking-widest">Analysis Results</span>
                       <div className="h-px flex-1 bg-border/50" />
                   </div>

                  {/* Summary Dashboard */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                     {/* Score Card */}
                     <Card className="lg:col-span-2 border-none shadow-2xl rounded-[40px] overflow-hidden relative bg-slate-900 text-white">
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/20 blur-[120px] rounded-full pointer-events-none" />
                        <CardContent className="p-10 md:p-14 flex flex-col md:flex-row items-center gap-12 relative z-10">
                           <div className="relative shrink-0">
                              <svg className="w-48 h-48 transform -rotate-90">
                                <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="16" fill="transparent" className="text-white/10" />
                                <motion.circle 
                                    initial={{ strokeDasharray: "0 1000" }}
                                    animate={{ strokeDasharray: `${result.Compost_Quality_Assessment.Predicted_Score * 5.5} 1000` }}
                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                    cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="16" fill="transparent" className="text-emerald-500" strokeLinecap="round" 
                                />
                              </svg>
                              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                                 <div className="text-6xl font-black tracking-tighter">{result.Compost_Quality_Assessment.Predicted_Score.toFixed(0)}</div>
                                 <div className="text-sm font-bold text-emerald-400">SCORE</div>
                              </div>
                           </div>
                           
                           <div className="flex-1 space-y-6 text-center md:text-left">
                              <div>
                                 <div className="text-emerald-400 font-bold tracking-widest uppercase mb-2 text-sm">{result.Compost_Quality_Assessment.Maturity_Stage} Phase</div>
                                 <h2 className="text-4xl md:text-5xl font-black leading-tight text-white mb-4">
                                    {result.Compost_Quality_Assessment.Quality_Status} Quality
                                 </h2>
                                 <p className="text-lg text-slate-300 leading-relaxed font-medium">
                                    {result.Compost_Quality_Assessment.Overall_Recommendation}
                                 </p>
                              </div>
                              <div className="flex flex-wrap gap-4 justify-center md:justify-start pt-2">
                                 <Button onClick={handleDownloadPDF} variant="outline" className="h-10 border-white/20 text-white hover:bg-white/10 hover:text-white rounded-full bg-transparent">
                                    <Download className="mr-2 h-4 w-4" /> Download Report
                                 </Button>
                                 <Button onClick={handleExportCSV} variant="outline" className="h-10 border-white/20 text-white hover:bg-white/10 hover:text-white rounded-full bg-transparent">
                                    <Share2 className="mr-2 h-4 w-4" /> Export CSV
                                 </Button>
                              </div>
                           </div>
                        </CardContent>
                     </Card>

                     {/* Stats Sidebar */}
                     <div className="space-y-4">
                        {[
                            { label: "Maturity Time", val: `${result.Compost_Quality_Assessment.Days_to_Maturity} Days`, icon: Clock, color: "text-orange-500", bg: "bg-orange-500/10" },
                            { label: "Plant Species", val: `${result.Plant_Usability_Guide.Suitable_Plants_For_Use.length} Matches`, icon: Sprout, color: "text-emerald-500", bg: "bg-emerald-500/10" },
                            { label: "Active Alerts", val: `${result.Compost_Quality_Assessment.Parameter_Improvements.length} Issues`, icon: AlertCircle, color: "text-rose-500", bg: "bg-rose-500/10" }
                        ].map((stat, i) => (
                            <Card key={i} className="border-none shadow-lg rounded-3xl p-6 flex items-center gap-5 hover:scale-[1.02] transition-transform">
                                <div className={`h-14 w-14 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center shrink-0`}>
                                    <stat.icon className="h-7 w-7" />
                                </div>
                                <div>
                                    <div className="text-2xl font-black text-slate-900">{stat.val}</div>
                                    <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{stat.label}</div>
                                </div>
                            </Card>
                        ))}
                     </div>
                  </div>

                  {/* Deep Dive Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                     <Card className="border shadow-lg rounded-[32px] p-8">
                        <h3 className="text-xl font-black mb-6 flex items-center gap-2">
                            <Activity className="h-5 w-5 text-indigo-500" /> Chemical Fingerprint
                        </h3>
                        {/* Wrapper for Radar to ensure it fits */}
                        <div className="h-[400px] w-full flex items-center justify-center">
                            <ParameterRadarChart data={formData as any} />
                        </div>
                     </Card>

                     <div className="space-y-4">
                        <h3 className="text-xl font-black mb-6 px-4 flex items-center gap-2">
                            <CheckCircle2 className="h-5 w-5 text-emerald-500" /> Recommended Actions
                        </h3>
                        {result.Compost_Quality_Assessment.Parameter_Improvements.length === 0 ? (
                             <div className="p-8 rounded-3xl bg-emerald-50 border border-emerald-100 text-center">
                                 <CheckCircle2 className="h-12 w-12 text-emerald-500 mx-auto mb-4" />
                                 <h4 className="font-bold text-emerald-900 text-lg">No Improvements Needed</h4>
                                 <p className="text-emerald-700 mt-2 text-sm">Your compost sample is in excellent condition.</p>
                             </div>
                        ) : (
                            result.Compost_Quality_Assessment.Parameter_Improvements.map((imp: any, idx: number) => (
                                <div key={idx} className="bg-white border rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow group">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="font-bold text-lg text-slate-800">{imp.Parameter} Issue</div>
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${imp.Priority === 'High' ? 'bg-rose-100 text-rose-600' : 'bg-orange-100 text-orange-600'}`}>
                                            {imp.Priority} Priority
                                        </span>
                                    </div>
                                    <ul className="space-y-3">
                                        {imp.Actions.map((action: string, ai: number) => (
                                            <li key={ai} className="flex gap-3 text-sm font-medium text-slate-600">
                                                <div className="h-5 w-5 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-[10px] font-bold shrink-0">{ai+1}</div>
                                                {action}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))
                        )}
                     </div>
                  </div>

                  {/* Plant Matrix */}
                  <div className="pt-12 border-t">
                      <div className="mb-8">
                          <h2 className="text-3xl font-black text-slate-900">Plant Compatibility</h2>
                          <p className="text-slate-500">Species matched by root sensitivity analysis.</p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                         {result.Plant_Usability_Guide.Suitable_Plants_For_Use.map((plant: any, idx: number) => (
                             <PlantCard key={idx} plant={plant} />
                         ))}
                         {result.Plant_Usability_Guide.Conditionally_Usable_Plants.map((plant: any, idx: number) => (
                            <div key={idx} className="bg-slate-50 rounded-3xl p-8 border border-slate-100 relative opacity-75 hover:opacity-100 transition-opacity">
                                <div className="flex justify-between items-start mb-4">
                                    <h4 className="text-xl font-bold text-slate-700">{plant.Plant_Name}</h4>
                                    <AlertCircle className="h-5 w-5 text-orange-500" />
                                </div>
                                <div className="text-xs font-bold text-orange-600 bg-orange-50 w-fit px-2 py-1 rounded mb-4">CONDITIONAL</div>
                                <p className="text-sm text-slate-500 leading-relaxed font-medium">{plant.Reason}</p>
                            </div>
                         ))}
                      </div>
                  </div>
               </motion.div>
            )}
         </AnimatePresence>
      </div>
    </main>
  );
}
