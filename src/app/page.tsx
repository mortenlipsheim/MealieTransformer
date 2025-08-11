
'use client'

import Link from 'next/link';
import RecipeInput from './recipe-input';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/use-translation';
import Logo from '@/components/logo';
import { Settings } from 'lucide-react';

export default function Home() {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-4 w-full max-w-4xl">
       <div className="flex justify-between items-center w-full">
         <Logo />
         <Link href="/settings">
            <Button variant="outline">
              <Settings className="mr-2 h-4 w-4" />
              {t('Settings')}
            </Button>
         </Link>
       </div>

      <div className="text-center mt-8">
        <p className="text-muted-foreground text-lg">
          {t('Transform and translate recipes from any source for your Mealie instance.')}
        </p>
      </div>

      <RecipeInput />
    </div>
  );
}
