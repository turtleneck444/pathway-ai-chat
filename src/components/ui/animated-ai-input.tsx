"use client";

import { ArrowRight, Check, ChevronDown } from "lucide-react";
import { useState, useRef, useCallback, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";

interface UseAutoResizeTextareaProps {
    minHeight: number;
    maxHeight?: number;
}

function useAutoResizeTextarea({
    minHeight,
    maxHeight,
}: UseAutoResizeTextareaProps) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const adjustHeight = useCallback(
        (reset?: boolean) => {
            const textarea = textareaRef.current;
            if (!textarea) return;

            if (reset) {
                textarea.style.height = `${minHeight}px`;
                return;
            }

            textarea.style.height = `${minHeight}px`;

            const newHeight = Math.max(
                minHeight,
                Math.min(
                    textarea.scrollHeight,
                    maxHeight ?? Number.POSITIVE_INFINITY
                )
            );

            textarea.style.height = `${newHeight}px`;
        },
        [minHeight, maxHeight]
    );

    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = `${minHeight}px`;
        }
    }, [minHeight]);

    useEffect(() => {
        const handleResize = () => adjustHeight();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [adjustHeight]);

    return { textareaRef, adjustHeight };
}

const OPENAI_ICON = (
    <>
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 256 260"
            aria-label="OpenAI Icon"
            className="w-4 h-4 dark:hidden block"
        >
            <title>OpenAI Icon Light</title>
            <path d="M239.184 106.203a64.716 64.716 0 0 0-5.576-53.103C219.452 28.459 191 15.784 163.213 21.74A65.586 65.586 0 0 0 52.096 45.22a64.716 64.716 0 0 0-43.23 31.36c-14.31 24.602-11.061 55.634 8.033 76.74a64.665 64.665 0 0 0 5.525 53.102c14.174 24.65 42.644 37.324 70.446 31.36a64.72 64.72 0 0 0 48.754 21.744c28.481.025 53.714-18.361 62.414-45.481a64.767 64.767 0 0 0 43.229-31.36c14.137-24.558 10.875-55.423-8.083-76.483Zm-97.56 136.338a48.397 48.397 0 0 1-31.105-11.255l1.535-.87 51.67-29.825a8.595 8.595 0 0 0 4.247-7.367v-72.85l21.845 12.636c.218.111.37.32.409.563v60.367c-.056 26.818-21.783 48.545-48.601 48.601Zm-104.466-44.61a48.345 48.345 0 0 1-5.781-32.589l1.534.921 51.722 29.826a8.339 8.339 0 0 0 8.441 0l63.181-36.425v25.221a.87.87 0 0 1-.358.665l-52.335 30.184c-23.257 13.398-52.97 5.431-66.404-17.803ZM23.549 85.38a48.499 48.499 0 0 1 25.58-21.333v61.39a8.288 8.288 0 0 0 4.195 7.316l62.874 36.272-21.845 12.636a.819.819 0 0 1-.767 0L41.353 151.53c-23.211-13.454-31.171-43.144-17.804-66.405v.256Zm179.466 41.695-63.08-36.63L161.73 77.86a.819.819 0 0 1 .768 0l52.233 30.184a48.6 48.6 0 0 1-7.316 87.635v-61.391a8.544 8.544 0 0 0-4.4-7.213Zm21.742-32.69-1.535-.922-51.619-30.081a8.39 8.39 0 0 0-8.492 0L99.98 99.808V74.587a.716.716 0 0 1 .307-.665l52.233-30.133a48.652 48.652 0 0 1 72.236 50.391v.205ZM88.061 139.097l-21.845-12.585a.87.87 0 0 1-.41-.614V65.685a48.652 48.652 0 0 1 79.757-37.346l-1.535.87-51.67 29.825a8.595 8.595 0 0 0-4.246 7.367l-.051 72.697Zm11.868-25.58 28.138-16.217 28.188 16.218v32.434l-28.086 16.218-28.188-16.218-.052-32.434Z" />
        </svg>
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 256 260"
            aria-label="OpenAI Icon"
            className="w-4 h-4 hidden dark:block"
        >
            <title>OpenAI Icon Dark</title>
            <path
                fill="#fff"
                d="M239.184 106.203a64.716 64.716 0 0 0-5.576-53.103C219.452 28.459 191 15.784 163.213 21.74A65.586 65.586 0 0 0 52.096 45.22a64.716 64.716 0 0 0-43.23 31.36c-14.31 24.602-11.061 55.634 8.033 76.74a64.665 64.665 0 0 0 5.525 53.102c14.174 24.65 42.644 37.324 70.446 31.36a64.72 64.72 0 0 0 48.754 21.744c28.481.025 53.714-18.361 62.414-45.481a64.767 64.767 0 0 0 43.229-31.36c14.137-24.558 10.875-55.423-8.083-76.483Zm-97.56 136.338a48.397 48.397 0 0 1-31.105-11.255l1.535-.87 51.67-29.825a8.595 8.595 0 0 0 4.247-7.367v-72.85l21.845 12.636c.218.111.37.32.409.563v60.367c-.056 26.818-21.783 48.545-48.601 48.601Zm-104.466-44.61a48.345 48.345 0 0 1-5.781-32.589l1.534.921 51.722 29.826a8.339 8.339 0 0 0 8.441 0l63.181-36.425v25.221a.87.87 0 0 1-.358.665l-52.335 30.184c-23.257 13.398-52.97 5.431-66.404-17.803ZM23.549 85.38a48.499 48.499 0 0 1 25.58-21.333v61.39a8.288 8.288 0 0 0 4.195 7.316l62.874 36.272-21.845 12.636a.819.819 0 0 1-.767 0L41.353 151.53c-23.211-13.454-31.171-43.144-17.804-66.405v.256Zm179.466 41.695-63.08-36.63L161.73 77.86a.819.819 0 0 1 .768 0l52.233 30.184a48.6 48.6 0 0 1-7.316 87.635v-61.391a8.544 8.544 0 0 0-4.4-7.213Zm21.742-32.69-1.535-.922-51.619-30.081a8.39 8.39 0 0 0-8.492 0L99.98 99.808V74.587a.716.716 0 0 1 .307-.665l52.233-30.133a48.652 48.652 0 0 1 72.236 50.391v.205ZM88.061 139.097l-21.845-12.585a.87.87 0 0 1-.41-.614V65.685a48.652 48.652 0 0 1 79.757-37.346l-1.535.87-51.67 29.825a8.595 8.595 0 0 0-4.246 7.367l-.051 72.697Zm11.868-25.58 28.138-16.217 28.188 16.218v32.434l-28.086 16.218-28.188-16.218-.052-32.434Z"
            />
        </svg>
    </>
);

interface AI_PromptProps {
    mode: string;
    modeColor: string;
}

export function AI_Prompt({ mode, modeColor }: AI_PromptProps) {
    const [value, setValue] = useState("");
    const { textareaRef, adjustHeight } = useAutoResizeTextarea({
        minHeight: 72,
        maxHeight: 300,
    });
    const [selectedModel, setSelectedModel] = useState("gpt-5-mini-2025-08-07");
    const [isLoading, setIsLoading] = useState(false);
    const [conversationHistory, setConversationHistory] = useState<Array<{role: string, content: string}>>([]);

    const AI_MODELS = [
        { id: "gpt-5-2025-08-07", name: "GPT-5" },
        { id: "gpt-5-mini-2025-08-07", name: "GPT-5 Mini" },
        { id: "gpt-5-nano-2025-08-07", name: "GPT-5 Nano" },
        { id: "o3-2025-04-16", name: "O3" },
        { id: "o4-mini-2025-04-16", name: "O4 Mini" },
    ];

    const handleSendMessage = async () => {
        if (!value.trim() || isLoading) return;
        
        const userMessage = value.trim();
        setValue("");
        adjustHeight(true);
        setIsLoading(true);

        try {
            const { data, error } = await supabase.functions.invoke('chat-with-ai', {
                body: {
                    message: userMessage,
                    model: selectedModel,
                    conversationHistory,
                    mode
                }
            });

            if (error) throw error;

            setConversationHistory([
                ...conversationHistory,
                { role: 'user', content: userMessage },
                { role: 'assistant', content: data.response }
            ]);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey && value.trim() && !isLoading) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <div className="w-full max-w-4xl py-4">
            <motion.div 
                className="rounded-3xl p-1.5 backdrop-blur-xl"
                style={{
                    background: `linear-gradient(135deg, ${modeColor}15, ${modeColor}05)`,
                    border: `1px solid ${modeColor}30`,
                    boxShadow: `0 0 40px ${modeColor}20`
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="relative">
                    <div className="relative flex flex-col">
                        <div className="overflow-y-auto" style={{ maxHeight: "400px" }}>
                            <Textarea
                                id="ai-input"
                                value={value}
                                placeholder={`Ask ${mode} mode anything...`}
                                disabled={isLoading}
                                className={cn(
                                    "w-full rounded-2xl rounded-b-none px-6 py-4 bg-card/50 border-none text-foreground placeholder:text-muted-foreground/70 resize-none focus-visible:ring-0 focus-visible:ring-offset-0 backdrop-blur-sm transition-all",
                                    "min-h-[72px]",
                                    isLoading && "opacity-50 cursor-not-allowed"
                                )}
                                ref={textareaRef}
                                onKeyDown={handleKeyDown}
                                onChange={(e) => {
                                    setValue(e.target.value);
                                    adjustHeight();
                                }}
                            />
                        </div>

                        <div className="h-16 bg-card/30 backdrop-blur-sm rounded-b-2xl flex items-center">
                            <div className="absolute left-4 right-4 bottom-4 flex items-center justify-between w-[calc(100%-32px)]">
                                <div className="flex items-center gap-3">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                disabled={isLoading}
                                                className="flex items-center gap-2 h-9 px-3 text-xs rounded-lg hover:bg-accent/50 transition-all"
                                                style={{ color: modeColor }}
                                            >
                                                <AnimatePresence mode="wait">
                                                    <motion.div
                                                        key={selectedModel}
                                                        initial={{ opacity: 0, y: -5 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, y: 5 }}
                                                        transition={{ duration: 0.15 }}
                                                        className="flex items-center gap-2"
                                                    >
                                                        {OPENAI_ICON}
                                                        {AI_MODELS.find(m => m.id === selectedModel)?.name}
                                                        <ChevronDown className="w-3 h-3 opacity-50" />
                                                    </motion.div>
                                                </AnimatePresence>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent className="min-w-[12rem] bg-card/95 backdrop-blur-xl border-border/50">
                                            {AI_MODELS.map((model) => (
                                                <DropdownMenuItem
                                                    key={model.id}
                                                    onSelect={() => setSelectedModel(model.id)}
                                                    className="flex items-center justify-between gap-2 cursor-pointer"
                                                >
                                                    <div className="flex items-center gap-2">
                                                        {OPENAI_ICON}
                                                        <span>{model.name}</span>
                                                    </div>
                                                    {selectedModel === model.id && (
                                                        <Check className="w-4 h-4" style={{ color: modeColor }} />
                                                    )}
                                                </DropdownMenuItem>
                                            ))}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                                <motion.button
                                    type="button"
                                    onClick={handleSendMessage}
                                    disabled={!value.trim() || isLoading}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className={cn(
                                        "rounded-xl p-3 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed",
                                        "shadow-lg"
                                    )}
                                    style={{
                                        backgroundColor: value.trim() && !isLoading ? `${modeColor}40` : 'hsl(var(--muted))',
                                        boxShadow: value.trim() && !isLoading ? `0 0 20px ${modeColor}30` : 'none'
                                    }}
                                    aria-label="Send message"
                                >
                                    <ArrowRight
                                        className={cn("w-5 h-5 transition-all duration-200")}
                                        style={{ color: value.trim() && !isLoading ? modeColor : 'hsl(var(--muted-foreground))' }}
                                    />
                                </motion.button>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
            
            {conversationHistory.length > 0 && (
                <motion.div 
                    className="mt-6 space-y-4 max-h-[400px] overflow-y-auto rounded-2xl p-4 bg-card/30 backdrop-blur-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    {conversationHistory.map((msg, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className={cn(
                                "p-4 rounded-xl",
                                msg.role === 'user' 
                                    ? 'bg-primary/10 ml-auto max-w-[80%]' 
                                    : 'bg-accent/10 mr-auto max-w-[80%]'
                            )}
                        >
                            <p className="text-sm text-foreground/90">{msg.content}</p>
                        </motion.div>
                    ))}
                </motion.div>
            )}
        </div>
    );
}
