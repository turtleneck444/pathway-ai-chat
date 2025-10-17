import { AI_Prompt } from "@/components/ui/animated-ai-input";

const Index = () => {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background dark">
      <div className="w-full">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-foreground mb-4">PathwayAI</h1>
          <p className="text-muted-foreground text-lg">Your intelligent AI companion</p>
        </div>
        <AI_Prompt />
      </div>
    </main>
  );
};

export default Index;
