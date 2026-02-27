import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 text-center">
      <h1 className="text-6xl font-extrabold text-muted-foreground">404</h1>
      <p className="text-xl font-semibold">Ativo ou página não encontrada</p>
      <p className="text-sm text-muted-foreground">
        Verifique se o ticker está correto ou volte ao screener.
      </p>
      <Button asChild>
        <Link href="/screener">Ver todos os ativos</Link>
      </Button>
    </div>
  );
}
