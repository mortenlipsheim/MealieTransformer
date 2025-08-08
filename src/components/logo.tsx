import { ChefHat } from "lucide-react";

export default function Logo() {
  return (
    <div className="flex items-center gap-2 p-4">
      <ChefHat className="w-8 h-8 text-primary" />
      <h1 className="text-xl font-headline font-bold text-foreground">
        Mealie Transformer
      </h1>
    </div>
  );
}
