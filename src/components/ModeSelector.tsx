import { motion } from "framer-motion";
import { Home, GraduationCap, Briefcase, Image, Sparkles, Palette } from "lucide-react";
import { cn } from "@/lib/utils";

export type AIMode = "real-estate" | "homework" | "business" | "image" | "creative" | "artist";

interface ModeSelectorProps {
  selectedMode: AIMode;
  onModeChange: (mode: AIMode) => void;
}

const modes = [
  {
    id: "real-estate" as AIMode,
    name: "Real Estate",
    icon: Home,
    color: "hsl(var(--real-estate))",
    description: "Property analysis & market insights",
  },
  {
    id: "homework" as AIMode,
    name: "Homework",
    icon: GraduationCap,
    color: "hsl(var(--homework))",
    description: "Academic help & explanations",
  },
  {
    id: "business" as AIMode,
    name: "Business",
    icon: Briefcase,
    color: "hsl(var(--business))",
    description: "Strategy & analytics",
  },
  {
    id: "image" as AIMode,
    name: "Image",
    icon: Image,
    color: "hsl(var(--image))",
    description: "Visual analysis & generation",
  },
  {
    id: "creative" as AIMode,
    name: "Creative",
    icon: Sparkles,
    color: "hsl(var(--creative))",
    description: "Writing & ideation",
  },
  {
    id: "artist" as AIMode,
    name: "Artist",
    icon: Palette,
    color: "hsl(var(--artist))",
    description: "Art creation & critique",
  },
];

export function ModeSelector({ selectedMode, onModeChange }: ModeSelectorProps) {
  return (
    <div className="w-full max-w-5xl mx-auto mb-8">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {modes.map((mode) => {
          const Icon = mode.icon;
          const isSelected = selectedMode === mode.id;
          
          return (
            <motion.button
              key={mode.id}
              onClick={() => onModeChange(mode.id)}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              className={cn(
                "relative group p-6 rounded-2xl border-2 transition-all duration-300",
                "bg-card/50 backdrop-blur-sm",
                isSelected
                  ? "border-opacity-100 shadow-2xl"
                  : "border-border/20 hover:border-opacity-50"
              )}
              style={{
                borderColor: isSelected ? mode.color : undefined,
                boxShadow: isSelected ? `0 0 30px ${mode.color}40` : undefined,
              }}
            >
              {isSelected && (
                <motion.div
                  layoutId="mode-highlight"
                  className="absolute inset-0 rounded-2xl opacity-10"
                  style={{ backgroundColor: mode.color }}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              
              <div className="relative z-10 flex flex-col items-center gap-3">
                <div
                  className={cn(
                    "p-3 rounded-xl transition-all duration-300",
                    isSelected ? "animate-pulse-glow" : "opacity-70 group-hover:opacity-100"
                  )}
                  style={{
                    backgroundColor: isSelected ? `${mode.color}20` : "hsl(var(--muted))",
                  }}
                >
                  <Icon
                    className="w-6 h-6 transition-transform duration-300 group-hover:scale-110"
                    style={{ color: mode.color }}
                  />
                </div>
                
                <div className="text-center">
                  <h3
                    className={cn(
                      "font-semibold text-sm mb-1 transition-colors",
                      isSelected ? "text-foreground" : "text-muted-foreground"
                    )}
                  >
                    {mode.name}
                  </h3>
                  <p className="text-xs text-muted-foreground/70 leading-tight">
                    {mode.description}
                  </p>
                </div>
              </div>

              {isSelected && (
                <motion.div
                  className="absolute -inset-1 rounded-2xl opacity-20 blur-xl"
                  style={{ backgroundColor: mode.color }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.2 }}
                  transition={{ duration: 0.5 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
