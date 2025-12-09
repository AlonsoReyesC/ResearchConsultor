// client/components/LoginDialog.tsx
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export function LoginDialog() {
  const [open, setOpen] = useState(false);

  const handleLogin = () => {
    // Login demo instantáneo
    localStorage.setItem("userId", "demo-user");
    alert("¡Bienvenido! Ahora puedes crear proyectos ilimitados.");
    setOpen(false);
    window.location.reload(); // recarga para que vea los proyectos
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full sm:w-auto">Login</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Acceso demo</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div>
            <Label>Usuario</Label>
            <Input value="demo" readOnly />
          </div>
          <div>
            <Label>Contraseña</Label>
            <Input value="demo" readOnly />
          </div>
          <Button onClick={handleLogin} className="w-full">
            Entrar
          </Button>
          <p className="text-sm text-center text-muted-foreground">
            Es solo una versión demo: todos usan el mismo usuario
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
