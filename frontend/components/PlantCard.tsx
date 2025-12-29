import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Sprout, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PlantCardProps {
  plant: any;
}

export function PlantCard({ plant }: PlantCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      layout
      className="glass group rounded-[40px] overflow-hidden border-none shadow-xl hover:shadow-2xl transition-all relative"
    >
      <div className="h-2 nature-gradient w-full absolute top-0 left-0 z-10" />
      <div className="p-10 space-y-6 relative z-0">
        <div className="flex justify-between items-start">
          <div>
            <h4 className="text-2xl font-black group-hover:text-primary transition-colors">{plant.Plant_Name}</h4>
            <div className="flex items-center gap-2 mt-1">
               <Sprout className="h-3 w-3 text-muted-foreground" />
               <p className="text-xs font-bold text-muted-foreground uppercase opacity-70 tracking-widest">{plant.Plant_Type}</p>
            </div>
          </div>
          <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shadow-inner">
            <CheckCircle2 className="h-6 w-6" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10">
          <div className="text-[10px] font-black text-primary uppercase mb-2">AGRONOMIST ADVICE</div>
          <p className="text-sm font-medium leading-relaxed italic">"{plant.Usage_Advice}"</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-[20px] bg-muted/30 border">
            <div className="flex items-center gap-2 mb-1">
               <Clock className="h-3 w-3 text-muted-foreground" />
               <div className="text-[10px] font-bold text-muted-foreground uppercase">Harvest</div>
            </div>
            <div className="text-sm font-bold">{plant.Time_to_Harvest || "90 Days"}</div>
          </div>
          <div className="p-4 rounded-[20px] bg-muted/30 border">
            <div className="flex items-center gap-2 mb-1">
               <ActivityIcon className="h-3 w-3 text-muted-foreground" />
               <div className="text-[10px] font-bold text-muted-foreground uppercase">Growth</div>
            </div>
            <div className="text-sm font-bold">{plant.Growth_Rate || "Stable"}</div>
          </div>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4 pt-4 border-t border-dashed"
            >
              <div>
                 <div className="text-[10px] font-black text-muted-foreground uppercase mb-2">Specific Requirements</div>
                 <p className="text-sm text-foreground/80 leading-relaxed bg-muted/30 p-3 rounded-xl border">
                    {plant.Specific_Requirements || "No specific soil amendments required beyond standard compost application."}
                 </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div className="bg-blue-500/5 p-3 rounded-xl border border-blue-500/10">
                    <div className="text-[10px] font-bold text-blue-600 uppercase mb-1">Water Need</div>
                    <div className="text-sm font-medium">Moderate</div>
                 </div>
                 <div className="bg-yellow-500/5 p-3 rounded-xl border border-yellow-500/10">
                    <div className="text-[10px] font-bold text-yellow-600 uppercase mb-1">Sunlight</div>
                    <div className="text-sm font-medium">Full Sun</div>
                 </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <Button 
          variant="ghost" 
          onClick={() => setIsExpanded(!isExpanded)}
          className={`w-full h-12 rounded-2xl transition-all font-bold ${isExpanded ? 'bg-primary/10 text-primary' : 'bg-transparent text-muted-foreground hover:bg-primary hover:text-white'}`}
        >
          {isExpanded ? "HIDE PROFILE" : "VIEW GROWTH PROFILE"}
        </Button>
      </div>
    </motion.div>
  );
}

function ActivityIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  )
}
