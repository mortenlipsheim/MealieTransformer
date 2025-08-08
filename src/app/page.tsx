import RecipeInput from "./recipe-input";

export default function Home() {
  return (
    <div>
      <h1 className="text-4xl font-bold">Mealie Transformer</h1>
      <p className="text-gray-600 mt-2">
        Transform and translate recipes from any source for your Mealie
        instance.
      </p>
      <div className="mt-8">
        <RecipeInput />
      </div>
    </div>
  );
}
