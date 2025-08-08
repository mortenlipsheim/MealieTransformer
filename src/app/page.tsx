
'use client'

import Link from 'next/link';
import RecipeInput from './recipe-input';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';

export default function Home() {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-4">
      <div className="text-center">
        <h1 className="text-4xl font-headline font-bold">
          {t('Mealie Transformer')}
        </h1>
        <p className="text-muted-foreground">
          {t('Transform and translate recipes from any source for your Mealie instance.')}
        </p>
      </div>

      <RecipeInput />
    </div>
  );
}
