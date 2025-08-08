# **App Name**: Mealie Transformer

## Core Features:

- Recipe Input UI: Provides a UI for users to input recipe URLs, pasted text, photo taken within the app or uploaded image, or YouTube video links.
- Recipe Data Extraction: AI tool to scrape recipe data from URLs (web pages or YouTube videos), extract text from images and generate recipe, or process pasted text.
- Recipe Translation: AI tool to convert recipes into the user's target language based on configured settings. This is a tool to help with translations.
- Unit Conversion: AI tool to convert recipe measuring units to the user's specified system (Metric or US). This is a tool to help with conversions.
- Recipe Review & Edit UI: Provides an interface that replicates Mealie's 'Create Recipe' functionality, allowing users to review, edit, and add recipe details (ingredients, steps, etc.) before posting.
- Parameter Storage: Saves user preferences, including UI language, translation language, and measurement system, in a text-based database.
- Post to Mealie API: Function to post transformed recipe data to a Mealie instance via the Mealie API, including appropriate headers and JSON formatting, with fail-safe mechanisms.

## Style Guidelines:

- Primary color: A warm, earthy orange (#E27245) to evoke a sense of home cooking and comfort.
- Background color: Very light, desaturated orange (#F8EFE8) for a clean, appetizing backdrop.
- Accent color: Muted yellow-orange (#D69E2E) to provide highlights and call attention to important actions.
- Headline font: 'Playfair', serif, for recipe titles and headings, imparting elegance.
- Body font: 'PT Sans', sans-serif, for ingredients, instructions and descriptions to be legible and clean.
- Cooking-themed icons derived from the Mealie project, such as utensils, pots, pans, and ingredients.
- Multi-language support with JSON-based language files, allowing for easy addition of new languages; settings page for language selection, measuring system and translation targets.