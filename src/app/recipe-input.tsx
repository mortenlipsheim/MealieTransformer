
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
import { Camera, Upload, X } from "lucide-react";

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
  const [activeTab, setActiveTab] = useState("url");

  // Image states
  const [imageSources, setImageSources] = useState<string[]>([]);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);


  useEffect(() => {
    const getCameraPermission = async () => {
      // Ensure this runs only on the client and only for the image tab
      if (typeof window === 'undefined' || !navigator.mediaDevices || activeTab !== 'image') {
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({video: { facingMode: 'environment' }});
        setHasCameraPermission(true);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: t('Camera Access Denied'),
          description: t('Please enable camera permissions in your browser settings to use this feature.'),
        });
      }
    };

    getCameraPermission();

    // Cleanup function to stop video tracks when the component unmounts or tab changes
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    }
  }, [t, toast, activeTab]);


  const onTransform = async () => {
    setLoading(true);
    const { data, error } = await handleRecipeTransform({
        sourceImages: imageSources,
        targetLanguage,
        measurementSystem,
        isImage: true,
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

  const handleUrlTransform = async () => {
    if (source) {
      setLoading(true);
      const { data, error } = await handleRecipeTransform({
          source: source,
          targetLanguage,
          measurementSystem,
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

    } else {
      toast({
        variant: "destructive",
        title: t("Error"),
        description: t("Please enter a URL."),
      });
    }
  };

  const handleTextTransform = async () => {
    if (text) {
       setLoading(true);
       const { data, error } = await handleRecipeTransform({
           source: text,
           targetLanguage,
           measurementSystem,
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
      const videoWidth = video.videoWidth;
      const videoHeight = video.videoHeight;

      if (videoWidth === 0 || videoHeight === 0) {
        toast({
          variant: 'destructive',
          title: t('Error'),
          description: 'Could not capture photo. Video stream not available.',
        });
        return;
      }

      canvas.width = videoWidth;
      canvas.height = videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, videoWidth, videoHeight);
        const dataUrl = canvas.toDataURL('image/png');
        setImageSources(prev => [...prev, dataUrl]);
      }
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        setImageSources(prev => [...prev, dataUrl]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageTransform = () => {
    if (imageSources.length > 0) {
      onTransform();
    } else {
        toast({
            variant: "destructive",
            title: t("Error"),
            description: t("Please take a photo or upload an image."),
        });
    }
  };

  const removeImage = (index: number) => {
    setImageSources(prev => prev.filter((_, i) => i !== index));
  }


  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="font-headline text-3xl">{t('Recipe Input')}</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="url" onValueChange={setActiveTab}>
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
                    <video
                        ref={videoRef}
                        className="w-full h-full object-cover"
                        autoPlay
                        muted
                        playsInline
                    />
                    <canvas ref={canvasRef} className="hidden" />
                </div>

                {hasCameraPermission === false && (
                    <Alert variant="destructive">
                        <AlertTitle>{t('Camera Access Required')}</AlertTitle>
                        <AlertDescription>
                            {t('Please allow camera access to use this feature.')}
                        </AlertDescription>
                    </Alert>
                )}

                 <div className="flex gap-2">
                    <Button onClick={takePhoto} disabled={!hasCameraPermission} className="w-full"> <Camera className="mr-2"/> {t('Take Photo')}</Button>
                    <Button onClick={() => fileInputRef.current?.click()} variant="outline" className="w-full"><Upload className="mr-2"/>{t('Upload Image')}</Button>
                    <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageUpload} className="hidden" />
                 </div>

                {imageSources.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium">{t("Image Queue")} ({imageSources.length})</h4>
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {imageSources.map((src, index) => (
                        <div key={index} className="relative shrink-0 w-32 h-24 rounded-md overflow-hidden">
                           <Image src={src} alt={`Recipe page ${index + 1}`} layout="fill" objectFit="cover" />
                           <Button
                             variant="destructive"
                             size="icon"
                             className="absolute top-1 right-1 h-6 w-6 z-10"
                             onClick={() => removeImage(index)}
                           >
                              <X className="h-4 w-4"/>
                           </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}


                 <Button onClick={handleImageTransform} disabled={loading || imageSources.length === 0} className="w-full">
                    {loading ? t('Transforming...') : t('Transform')}
                </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
