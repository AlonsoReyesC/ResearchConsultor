import React, { useState } from "react";
import { Check, X, MessageSquare, AlertTriangle, Lightbulb, ChevronRight, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Suggestion {
  id: string;
  type: "risk" | "improvement" | "gap" | "citation";
  title: string;
  description: string;
  rationale: string;
  accepted?: boolean;
}

export function SuggestionCard({ suggestion, onAccept, onReject }: { 
  suggestion: Suggestion; 
  onAccept: (id: string) => void; 
  onReject: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);

  if (suggestion.accepted !== undefined) return null;

  return (
    <Card className={cn(
      "mb-4 border-l-4 transition-all duration-300 animate-in slide-in-from-right-4",
      suggestion.type === "risk" ? "border-l-destructive" :
      suggestion.type === "improvement" ? "border-l-blue-500" :
      suggestion.type === "gap" ? "border-l-amber-500" : "border-l-green-500"
    )}>
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start gap-2">
          <Badge variant="outline" className={cn(
            "capitalize",
            suggestion.type === "risk" ? "text-destructive border-destructive/20 bg-destructive/5" :
            suggestion.type === "improvement" ? "text-blue-600 border-blue-200 bg-blue-50" :
            suggestion.type === "gap" ? "text-amber-600 border-amber-200 bg-amber-50" : "text-green-600 border-green-200 bg-green-50"
          )}>
            {suggestion.type}
          </Badge>
          <span className="text-xs text-muted-foreground">Just now</span>
        </div>
        <CardTitle className="text-sm font-bold mt-2">{suggestion.title}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-2 text-sm">
        <p className="text-muted-foreground mb-3">{suggestion.description}</p>
        
        {expanded && (
          <div className="bg-secondary/50 p-3 rounded-md mb-3 text-xs border border-border">
            <p className="font-semibold mb-1">Methodological Rationale:</p>
            <p className="opacity-90">{suggestion.rationale}</p>
          </div>
        )}

        <div className="flex items-center gap-2 mt-2">
          <Button 
            size="sm" 
            variant="outline" 
            className="h-8 w-8 p-0 rounded-full hover:bg-green-100 hover:text-green-700 hover:border-green-200"
            onClick={() => onAccept(suggestion.id)}
          >
            <Check className="h-4 w-4" />
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            className="h-8 w-8 p-0 rounded-full hover:bg-red-100 hover:text-red-700 hover:border-red-200"
            onClick={() => onReject(suggestion.id)}
          >
            <X className="h-4 w-4" />
          </Button>
          <Button 
            size="sm" 
            variant="ghost" 
            className="h-8 ml-auto text-xs"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? "Less info" : "Why?"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
