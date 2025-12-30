"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { QRCodeSVG } from "qrcode.react";
import {
  Download,
  Loader,
  QrCode,
  Sparkles,
  Palette,
  Scaling,
} from "lucide-react";

import { suggestColorsAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "./ui/separator";

const formSchema = z.object({
  url: z.string().url({ message: "Please enter a valid URL." }),
});

type FormValues = z.infer<typeof formSchema>;

const logoSvg = `<svg width="24" height="24" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="28" height="28" rx="6" fill="#3b82f6"/>
<path d="M6 8H12V10H8V13H11C12.1046 13 13 13.8954 13 15V18C13 19.1046 12.1046 20 11 20H6V8ZM8 15V18H11V15H8Z" fill="hsl(var(--primary-foreground))"/>
<path d="M15 8H21C22.1046 8 23 8.89543 23 10V12C23 13.1046 22.1046 14 21 14H18.5V16H21L23 20H20.5L18.5 16.5L15 20V8ZM17 10V12H21V10H17Z" fill="hsl(var(--primary-foreground))"/>
</svg>`;

const logoDataUri = `data:image/svg+xml;base64,${
  typeof window !== "undefined" ? window.btoa(logoSvg) : ""
}`;

export function QrGenerator() {
  const [qrValue, setQrValue] = React.useState("");
  const [qrOptions, setQrOptions] = React.useState({
    size: 256,
    fgColor: "#000000",
    bgColor: "#ffffff",
  });
  const [isSuggesting, setIsSuggesting] = React.useState(false);
  const qrCodeRef = React.useRef<SVGSVGElement>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: "",
    },
  });

  const onSubmit = (data: FormValues) => {
    setQrValue(data.url);
  };

  const handleSuggestColors = async () => {
    setIsSuggesting(true);
    const result = await suggestColorsAction();
    if ("error" in result) {
      toast({
        variant: "destructive",
        title: "Error",
        description: result.error,
      });
    } else {
      setQrOptions((prev) => ({
        ...prev,
        fgColor: result.primaryColor,
        bgColor: result.backgroundColor,
      }));
      toast({
        title: "Colors Suggested!",
        description: "New AI-powered colors have been applied.",
      });
    }
    setIsSuggesting(false);
  };

  const handleDownload = () => {
    if (qrCodeRef.current) {
      const svg = qrCodeRef.current;
      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      
      const img = new Image();
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        const pngUrl = canvas
          .toDataURL("image/png")
          .replace("image/png", "image/octet-stream");
        const downloadLink = document.createElement("a");
        downloadLink.href = pngUrl;
        downloadLink.download = "br-code.png";
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      };
      img.src = "data:image/svg+xml;base64," + btoa(svgData);
    }
  };

  return (
    <Card className="w-full max-w-4xl shadow-2xl shadow-primary/10">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold tracking-tight">
          BR code
        </CardTitle>
        <CardDescription className="text-lg">
          Instantly convert any URL into a beautiful, custom QR code.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col items-center gap-4 sm:flex-row"
          >
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Input placeholder="https://example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full sm:w-auto">
              Generate QR Code
            </Button>
          </form>
        </Form>

        {qrValue && (
          <div className="mt-8 animate-fade-in-scale-up">
            <Separator />
            <div className="mt-8 grid gap-8 md:grid-cols-2">
              <div className="flex flex-col items-center justify-center rounded-lg border bg-card-foreground/5 p-6">
                <div
                  className="rounded-lg bg-white p-4 shadow-md"
                  style={{ backgroundColor: qrOptions.bgColor }}
                >
                  <QRCodeSVG
                    ref={qrCodeRef}
                    value={qrValue}
                    size={qrOptions.size}
                    fgColor={qrOptions.fgColor}
                    bgColor={qrOptions.bgColor}
                    level="H"
                    imageSettings={{
                      src: logoDataUri,
                      excavate: true,
                      width: qrOptions.size * 0.2,
                      height: qrOptions.size * 0.2,
                    }}
                  />
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <h3 className="mb-4 text-lg font-semibold">Customize</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="size"
                        className="flex items-center gap-2"
                      >
                        <Scaling className="h-4 w-4" /> Size: {qrOptions.size}px
                      </Label>
                      <Slider
                        id="size"
                        min={64}
                        max={1024}
                        step={8}
                        value={[qrOptions.size]}
                        onValueChange={(value) =>
                          setQrOptions((prev) => ({ ...prev, size: value[0] }))
                        }
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label
                          htmlFor="fgColor"
                          className="flex items-center gap-2"
                        >
                          <Palette className="h-4 w-4" /> Color
                        </Label>
                        <Input
                          id="fgColor"
                          type="color"
                          value={qrOptions.fgColor}
                          onChange={(e) =>
                            setQrOptions((prev) => ({
                              ...prev,
                              fgColor: e.target.value,
                            }))
                          }
                          className="p-1"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="bgColor"
                          className="flex items-center gap-2"
                        >
                          <Palette className="h-4 w-4" /> Background
                        </Label>
                        <Input
                          id="bgColor"
                          type="color"
                          value={qrOptions.bgColor}
                          onChange={(e) =>
                            setQrOptions((prev) => ({
                              ...prev,
                              bgColor: e.target.value,
                            }))
                          }
                          className="p-1"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Button
                    onClick={handleSuggestColors}
                    variant="outline"
                    disabled={isSuggesting}
                  >
                    {isSuggesting ? (
                      <Loader className="animate-spin" />
                    ) : (
                      <Sparkles />
                    )}
                    Suggest Colors with AI
                  </Button>
                  <Button onClick={handleDownload}>
                    <Download />
                    Download PNG
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {!qrValue && (
          <div className="mt-8 flex h-96 flex-col items-center justify-center rounded-lg border-2 border-dashed">
            <QrCode className="h-16 w-16 text-muted-foreground" />
            <p className="mt-4 text-muted-foreground">
              Your QR code will appear here
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
