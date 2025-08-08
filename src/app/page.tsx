import Link from "next/link";
import RecipeInput from "./recipe-input";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function Home() {
  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Link href="/">
          <Button variant="outline" size="icon">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <h1 className="text-4xl font-bold">Mealie Transformer</h1>
      </div>
      <RecipeInput />
    </div>
  );
}
