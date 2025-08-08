"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function RecipeInput() {
  const [url, setUrl] = useState("");

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Recipe Input</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="url">
          <TabsList>
            <TabsTrigger value="url">URL</TabsTrigger>
            <TabsTrigger value="text">Text</TabsTrigger>
            <TabsTrigger value="image">Image</TabsTrigger>
            <TabsTrigger value="youtube">YouTube</TabsTrigger>
          </TabsList>
          <TabsContent value="url">
            <div className="mt-4">
              <Input
                placeholder="https://example.com/recipe"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>
          </TabsContent>
          <TabsContent value="text">
            <div className="mt-4">
              <p>Text input coming soon...</p>
            </div>
          </TabsContent>
          <TabsContent value="image">
            <div className="mt-4">
              <p>Image input coming soon...</p>
            </div>
          </TabsContent>
          <TabsContent value="youtube">
            <div className="mt-4">
              <p>YouTube input coming soon...</p>
            </div>
          </TabsContent>
        </Tabs>
        <Button className="w-full mt-6 bg-green-500 hover:bg-green-600 text-white">
          Transform
        </Button>
      </CardContent>
    </Card>
  );
}
