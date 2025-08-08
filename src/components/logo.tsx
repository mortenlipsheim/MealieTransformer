import { ChefHat } from "lucide-react";

export default function Logo() {
  return (
    <div className="flex justify-center items-center gap-2">
      <ChefHat className="w-8 h-8 text-primary" />
      <h1 className="text-3xl font-headline font-bold text-foreground">
        Mealie Transformer
      </h1>
    </div>
  );
}
