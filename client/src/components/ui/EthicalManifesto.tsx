// client/components/EthicalManifesto.tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function EthicalManifesto() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="link" className="text-sm">Read our ethical manifesto</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-screen overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Manifiesto Ético de ResearchConsultor</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 text-sm text-muted-foreground">
          <p>1. La IA nunca reemplaza al investigador humano.</p>
          <p>2. Solo ofrecemos diagnóstico metodológico, nunca escribimos el paper por ti.</p>
          <p>3. Todas las citas sugeridas deben existir en la literatura real.</p>
          <p>4. Promovemos rigor, reproducibilidad y transparencia científica.</p>
          <p>5. Tus datos nunca se usan para entrenar modelos.</p>
          <p>6. Este proyecto es open-source y sin ánimo de lucro.</p>
          <p className="font-medium">— Alonso Reyes, biólogo y creador</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}