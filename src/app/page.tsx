import Link from 'next/link';
import RecipeInput from './recipe-input';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col gap-4">
      <div className="text-center">
        <h1 className="text-4xl font-headline font-bold">
          Mealie Transformer
        </h1>
        <p className="text-muted-foreground">
          Transform and translate recipes from any source for your Mealie
          instance.
        </p>
      </div>

      <RecipeInput />
    </div>
  );
}
