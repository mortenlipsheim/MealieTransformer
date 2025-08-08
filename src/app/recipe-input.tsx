
"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { handleRecipeTransform } from "./actions";
import type { Recipe } from "@/lib/schema";
import { useTranslation } from "@/hooks/use-translation";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import Image from "next/image";
import { Camera, Upload } from "lucide-react";

export default function RecipeInput() {
  const [source, setSource] = useState("");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const [, setRecipe] = useLocalStorage<Recipe | null>("recipe", null);
  const { t } = useTranslation();
  const [targetLanguage] = useLocalStorage("targetLanguage", "en");
  const [measurementSystem] = useLocalStorage("measurementSystem", "metric");

  // Image states
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);


  useEffect(() => {
    const getCameraPermission = async () => {
      if (typeof window === 'undefined' || !navigator.mediaDevices) return;
      try {
        const stream = await navigator.mediaDevices.getUserMedia({video: true});
        setHasCameraPermission(true);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
      }
    };

    getCameraPermission();
  }, []);


  const onTransform = async (sourceText: string, isImage = false) => {
    setLoading(true);
    const { data, error } = await handleRecipeTransform({ 
        source: sourceText,
        targetLanguage,
        measurementSystem,
        isImage,
     });

    if (error) {
      toast({
        variant: "destructive",
        title: t("Error"),
        description: error,
      });
    } else if (data) {
        setRecipe(data);
        router.push("/review");
    }
    setLoading(false);
  };

  const handleUrlTransform = () => {
    if (source) {
      onTransform(source);
    } else {
      toast({
        variant: "destructive",
        title: t("Error"),
        description: t("Please enter a URL."),
      });
    }
  };
  
  const handleTextTransform = () => {
    if (text) {
      onTransform(text);
    } else {
      toast({
        variant: "destructive",
        title: t("Error"),
        description: t("Please enter recipe text."),
      });
    }
  };

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        const dataUrl = canvas.toDataURL('image/png');
        setImageSrc(dataUrl);
      }
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageSrc(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageTransform = () => {
    if (imageSrc) {
      onTransform(imageSrc, true);
    } else {
        toast({
            variant: "destructive",
            title: t("Error"),
            description: t("Please take a photo or upload an image."),
        });
    }
  };


  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="font-headline text-3xl">{t('Recipe Input')}</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="url">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="url">{t('URL')}</TabsTrigger>
            <TabsTrigger value="text">{t('Text')}</TabsTrigger>
            <TabsTrigger value="image">{t('Image')}</TabsTrigger>
            <TabsTrigger value="youtube" disabled>{t('YouTube')}</TabsTrigger>
          </TabsList>
          <TabsContent value="url">
            <div className="mt-4 space-y-4">
              <Input
                placeholder={t("https://example.com/recipe")}
                value={source}
                onChange={(e) => setSource(e.target.value)}
              />
               <Button onClick={handleUrlTransform} disabled={loading} className="w-full">
                {loading ? t('Transforming...') : t('Transform')}
              </Button>
            </div>
          </TabsContent>
          <TabsContent value="text">
            <div className="mt-4 space-y-4">
              <Textarea
                placeholder={t("Paste your recipe text here...")}
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={10}
              />
              <Button onClick={handleTextTransform} disabled={loading} className="w-full">
                {loading ? t('Transforming...') : t('Transform')}
              </Button>
            </div>
          </TabsContent>
          <TabsContent value="image">
            <div className="mt-4 space-y-4">
                <div className="relative aspect-video w-full bg-slate-200 rounded-md overflow-hidden">
                    {imageSrc ? (
                         <Image src={imageSrc} alt="Recipe" layout="fill" objectFit="contain" />
                    ) : (
                        <>
                            <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
                            {hasCameraPermission === false && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                                    <Alert variant="destructive" className="w-3/4">
                                        <AlertTitle>{t('Camera Access Required')}</AlertTitle>
                                        <AlertDescription>
                                            {t('Please allow camera access to use this feature.')}
                                        </AlertDescription>
                                    </Alert>
                                </div>
                            )}
                        </>
                    )}
                    <canvas ref={canvasRef} className="hidden" />
                </div>
                 <div className="flex gap-2">
                    {imageSrc ? (
                         <Button onClick={() => setImageSrc(null)} variant="outline" className="w-full">{t("Retake Photo")}</Button>
                    ): (
                        <Button onClick={takePhoto} disabled={hasCameraPermission === false} className="w-full"> <Camera className="mr-2"/> {t('Take Photo')}</Button>
                    )}
                    <Button onClick={() => fileInputRef.current?.click()} variant="outline" className="w-full"><Upload className="mr-2"/>{t('Upload Image')}</Button>
                    <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageUpload} className="hidden" />
                 </div>
                 <Button onClick={handleImageTransform} disabled={loading || !imageSrc} className="w-full">
                    {loading ? t('Transforming...') : t('Transform')}
                </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
