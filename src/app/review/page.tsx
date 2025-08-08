import RecipeReview from "../recipe-review";

export default function ReviewPage() {
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
            <RecipeReview />
        </div>
    )
}
