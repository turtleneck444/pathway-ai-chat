import { useState } from "react";
import { AI_Prompt } from "@/components/ui/animated-ai-input";
import { ModeSelector, AIMode } from "@/components/ModeSelector";
import { motion } from "framer-motion";

const modeColors: Record<AIMode, string> = {
  "real-estate": "hsl(43, 96%, 56%)",
  "homework": "hsl(217, 91%, 60%)",
  "business": "hsl(142, 76%, 36%)",
  "image": "hsl(280, 83%, 48%)",
  "creative": "hsl(340, 82%, 52%)",
  "artist": "hsl(24, 95%, 53%)",
};

const Index = () => {
  const [selectedMode, setSelectedMode] = useState<AIMode>("homework");

  return (
    <main className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-card/20 pointer-events-none" />
      
      {/* Floating orbs for visual effect */}
      <motion.div
        className="absolute top-20 left-20 w-72 h-72 rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ backgroundColor: modeColors[selectedMode] }}
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 50, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-20 right-20 w-96 h-96 rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ backgroundColor: modeColors[selectedMode] }}
        animate={{
          scale: [1, 1.3, 1],
          x: [0, -50, 0],
          y: [0, -30, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-12">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.h1 
            className="text-7xl font-black mb-4 bg-clip-text text-transparent bg-gradient-to-r"
            style={{
              backgroundImage: `linear-gradient(135deg, ${modeColors[selectedMode]}, hsl(var(--primary)))`,
            }}
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            PathwayAI
          </motion.h1>
          <motion.p 
            className="text-muted-foreground text-xl font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Multi-Modal Intelligence Platform
          </motion.p>
        </motion.div>

        <ModeSelector selectedMode={selectedMode} onModeChange={setSelectedMode} />
        
        <motion.div
          key={selectedMode}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="w-full flex justify-center"
        >
          <AI_Prompt mode={selectedMode} modeColor={modeColors[selectedMode]} />
        </motion.div>
      </div>
    </main>
  );
};

export default Index;
