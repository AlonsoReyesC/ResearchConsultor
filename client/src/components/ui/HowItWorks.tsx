// client/components/HowItWorks.tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function HowItWorks() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="link" className="text-sm">How it worksButton>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>¿Cómo funciona ResearchConsultor?</DialogTitle>
        </DialogHeader>
        <ol className="list-decimal list-inside space-y-3 text-sm text-muted-foreground">
          <li>Crea un nuevo proyecto de investigación</li>
          <li>Rellena título, problema, objetivos, literatura y metodología</li>
          <li>Haz click en “Run diagnosis”</li>
          <li>La IA (gpt-4o) analiza tu propuesta y te da 5–10 sugerencias expertas</li>
          <li>Acepta o rechaza cada sugerencia → tu proyecto mejora</li>
          <li>¡Listo para enviar a revista o tesis!</li>
        </ol>
      </DialogContent>
    </Dialog>
  );
}