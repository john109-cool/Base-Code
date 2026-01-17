"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import QRCode from "react-qr-code";
import { toPng } from "html-to-image";
import {
  Download,
  QrCode,
  Palette,
  Scaling,
} from "lucide-react";

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
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";

const formSchema = z.object({
  url: z.string().url({ message: "Please enter a valid URL." }),
});

type FormValues = z.infer<typeof formSchema>;

export function QrGenerator() {
  const [qrValue, setQrValue] = React.useState("");
  const [qrOptions, setQrOptions] = React.useState({
    size: 256,
    fgColor: "#0000FF",
    bgColor: "#FFFFFF",
  });
  const qrCodeRef = React.useRef<HTMLDivElement>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: "",
    },
  });

  const onSubmit = (data: FormValues) => {
    setQrValue(data.url);
  };

  const handleDownload = React.useCallback(() => {
    if (qrCodeRef.current === null) {
      return;
    }

    toPng(qrCodeRef.current, { cacheBust: true })
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.download = "base-code.png";
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <Card className="w-full max-w-4xl shadow-2xl shadow-primary/10">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold tracking-tight">
          Base Code
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
                  <div ref={qrCodeRef} className="relative">
                    <QRCode
                      value={qrValue}
                      size={qrOptions.size}
                      fgColor={qrOptions.fgColor}
                      bgColor={qrOptions.bgColor}
                      level="H"
                    />
                    <div
                      style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        background: qrOptions.bgColor,
                        padding: '4px',
                      }}
                    >
                      <div
                        style={{
                          color: qrOptions.fgColor,
                          fontSize: qrOptions.size * 0.02,
                          fontFamily: 'Inter, sans-serif',
                          fontWeight: 'bold',
                          textAlign: 'center',
                        }}
                      >
                        BaseCode
                      </div>
                    </div>
                  </div>
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
                  <Button onClick={handleDownload} disabled={!qrValue}>
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
