
'use client'

import RecipeReview from "../recipe-review";
import { useTranslation } from "@/hooks/use-translation";

export default function ReviewPage() {
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
            <RecipeReview />
        </div>
    )
}
