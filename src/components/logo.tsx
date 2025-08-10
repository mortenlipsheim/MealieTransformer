
import { useTranslation } from "@/hooks/use-translation";
import { ChefHat } from "lucide-react";

export default function Logo() {
  const { t, isMounted } = useTranslation();
  return (
    <div className="flex items-center gap-2">
      <ChefHat className="w-8 h-8 text-primary" />
      <h1 className="text-xl font-headline font-bold text-foreground">
        {isMounted ? t("Mealie Transformer") : "Mealie Transformer"}
      </h1>
    </div>
  );
}
