"use client"

import { useState, useRef, type ChangeEvent } from "react"
import { QRCode } from "react-qrcode-logo"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, Image, Smartphone, Globe } from "lucide-react"
import ColorPicker from "./color-picker"
import { Checkbox } from "@/components/ui/checkbox"

type QRCodeType = "url" | "text" | "email" | "phone" | "sms" | "wifi" | "vcard"

interface QRCodeSettings {
  value: string
  size: number
  quietZone: number
  bgColor: string
  fgColor: string
  logoImage: string | null
  logoWidth: number
  logoHeight: number
  logoOpacity: number
  eyeRadius: number
  eyeColor: string
  qrStyle: "squares" | "dots"
  enableCORS: boolean
}

interface PlatformBadgeProps {
  platform: string
}

function PlatformBadge({ platform }: PlatformBadgeProps) {
  let bgColor = "bg-gray-100"
  let textColor = "text-gray-800"
  let icon = <Globe className="h-3 w-3 mr-1" />

  if (platform === "android") {
    bgColor = "bg-green-100"
    textColor = "text-green-800"
    icon = <Smartphone className="h-3 w-3 mr-1" />
  } else if (platform === "ios") {
    bgColor = "bg-blue-100"
    textColor = "text-blue-800"
    icon = <Smartphone className="h-3 w-3 mr-1" />
  } else if (platform === "web") {
    bgColor = "bg-purple-100"
    textColor = "text-purple-800"
    icon = <Globe className="h-3 w-3 mr-1" />
  }

  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
      {icon}
      {platform.charAt(0).toUpperCase() + platform.slice(1)}
    </span>
  )
}

export default function QRCodeGenerator() {
  const [platforms, setPlatforms] = useState<string[]>(["web"])
  const [qrType, setQrType] = useState<QRCodeType>("url")
  const [qrSettings, setQrSettings] = useState<QRCodeSettings>({
    value: "https://example.com",
    size: 250,
    quietZone: 10,
    bgColor: "#FFFFFF",
    fgColor: "#000000",
    logoImage: null,
    logoWidth: 50,
    logoHeight: 50,
    logoOpacity: 1,
    eyeRadius: 0,
    eyeColor: "#000000",
    qrStyle: "squares",
    enableCORS: true,
  })

  const qrRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setQrSettings({ ...qrSettings, [name]: value })
  }

  const handleSelectChange = (name: string, value: string) => {
    setQrSettings({ ...qrSettings, [name]: value })
  }

  const handleSliderChange = (name: string, value: number[]) => {
    setQrSettings({ ...qrSettings, [name]: value[0] })
  }

  const handleColorChange = (name: string, color: string) => {
    setQrSettings({ ...qrSettings, [name]: color })
  }

  const handleLogoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setQrSettings({
          ...qrSettings,
          logoImage: event.target?.result as string,
        })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleQrTypeChange = (type: QRCodeType) => {
    setQrType(type)

    // Set default value based on type
    let defaultValue = ""
    switch (type) {
      case "url":
        defaultValue = "https://example.com"
        break
      case "email":
        defaultValue = "example@example.com"
        break
      case "phone":
        defaultValue = "+1234567890"
        break
      case "sms":
        defaultValue = "SMS:+1234567890:Hello there!"
        break
      case "wifi":
        defaultValue = "WIFI:S:NetworkName;T:WPA;P:Password;;"
        break
      case "vcard":
        defaultValue =
          "BEGIN:VCARD\nVERSION:3.0\nN:Doe;John;;;\nFN:John Doe\nTEL;TYPE=CELL:+1234567890\nEMAIL:john.doe@example.com\nEND:VCARD"
        break
      default:
        defaultValue = "Hello World!"
    }

    setQrSettings({ ...qrSettings, value: defaultValue })
  }

  const getQRValue = () => {
    const value = qrSettings.value

    // If multiple platforms are selected and it's a URL, we might need to use a URL shortener
    // or a landing page that redirects to the appropriate platform
    if (platforms.length > 1 && qrType === "url") {
      // For this example, we'll just use the URL as is, but in a real app
      // you might want to create a landing page that redirects based on platform
      return value
    }

    switch (qrType) {
      case "url":
        return value
      case "email":
        return `mailto:${value}`
      case "phone":
        return `tel:${value}`
      case "sms":
        return value
      case "wifi":
        return value
      case "vcard":
        return value
      default:
        return value
    }
  }

  const downloadQRCode = () => {
    if (!qrRef.current) return

    const canvas = qrRef.current.querySelector("canvas")
    if (!canvas) return

    const url = canvas.toDataURL("image/png")
    const link = document.createElement("a")
    const platformInfo = platforms.join("-")
    link.download = `qrcode-${platformInfo}-${new Date().getTime()}.png`
    link.href = url
    link.click()
  }

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Target Platforms</Label>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="web"
                    checked={platforms.includes("web")}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setPlatforms([...platforms, "web"])
                      } else {
                        setPlatforms(platforms.filter((p) => p !== "web"))
                      }
                    }}
                  />
                  <Label htmlFor="web" className="flex items-center cursor-pointer">
                    <Globe className="mr-2 h-4 w-4" />
                    Web
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="android"
                    checked={platforms.includes("android")}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setPlatforms([...platforms, "android"])
                      } else {
                        setPlatforms(platforms.filter((p) => p !== "android"))
                      }
                    }}
                  />
                  <Label htmlFor="android" className="flex items-center cursor-pointer">
                    <Smartphone className="mr-2 h-4 w-4" />
                    Android
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="ios"
                    checked={platforms.includes("ios")}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setPlatforms([...platforms, "ios"])
                      } else {
                        setPlatforms(platforms.filter((p) => p !== "ios"))
                      }
                    }}
                  />
                  <Label htmlFor="ios" className="flex items-center cursor-pointer">
                    <Smartphone className="mr-2 h-4 w-4" />
                    iOS
                  </Label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="qrType">QR Code Type</Label>
              <Select value={qrType} onValueChange={(value) => handleQrTypeChange(value as QRCodeType)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select QR type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="url">URL</SelectItem>
                  <SelectItem value="text">Text</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="phone">Phone</SelectItem>
                  <SelectItem value="sms">SMS</SelectItem>
                  <SelectItem value="wifi">WiFi</SelectItem>
                  <SelectItem value="vcard">vCard</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="value">Content</Label>
              <Input
                id="value"
                name="value"
                value={qrSettings.value}
                onChange={handleInputChange}
                placeholder="Enter URL or text"
              />
            </div>

            {platforms.includes("android") && (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-md text-amber-800 text-sm">
                <p className="font-medium">Android Tips:</p>
                <ul className="list-disc list-inside mt-1">
                  <li>
                    Use Play Store URL: <code>market://details?id=com.example.app</code>
                  </li>
                  <li>
                    Or deep link: <code>yourapp://path</code>
                  </li>
                </ul>
              </div>
            )}

            {platforms.includes("ios") && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-md text-blue-800 text-sm">
                <p className="font-medium">iOS Tips:</p>
                <ul className="list-disc list-inside mt-1">
                  <li>
                    Use App Store URL: <code>https://apps.apple.com/app/id123456789</code>
                  </li>
                  <li>
                    Or Universal Link: <code>https://your-domain.com/path</code>
                  </li>
                </ul>
              </div>
            )}
          </div>

          <div className="mt-6 space-y-4">
            <h3 className="text-lg font-medium">Appearance</h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fgColor">Foreground Color</Label>
                <ColorPicker color={qrSettings.fgColor} onChange={(color) => handleColorChange("fgColor", color)} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bgColor">Background Color</Label>
                <ColorPicker color={qrSettings.bgColor} onChange={(color) => handleColorChange("bgColor", color)} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="eyeColor">Eye Color</Label>
              <ColorPicker color={qrSettings.eyeColor} onChange={(color) => handleColorChange("eyeColor", color)} />
            </div>

            <div className="space-y-2">
              <Label>QR Style</Label>
              <Select value={qrSettings.qrStyle} onValueChange={(value) => handleSelectChange("qrStyle", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="squares">Squares</SelectItem>
                  <SelectItem value="dots">Dots</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Eye Radius ({qrSettings.eyeRadius})</Label>
              <Slider
                value={[qrSettings.eyeRadius]}
                min={0}
                max={50}
                step={1}
                onValueChange={(value) => handleSliderChange("eyeRadius", value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Size ({qrSettings.size}px)</Label>
              <Slider
                value={[qrSettings.size]}
                min={100}
                max={500}
                step={10}
                onValueChange={(value) => handleSliderChange("size", value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Quiet Zone ({qrSettings.quietZone}px)</Label>
              <Slider
                value={[qrSettings.quietZone]}
                min={0}
                max={50}
                step={5}
                onValueChange={(value) => handleSliderChange("quietZone", value)}
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Logo</Label>
                {qrSettings.logoImage && (
                  <Button variant="outline" size="sm" onClick={() => setQrSettings({ ...qrSettings, logoImage: null })}>
                    Remove
                  </Button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                  <Image className="mr-2 h-4 w-4" />
                  Upload Logo
                </Button>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
              </div>

              {qrSettings.logoImage && (
                <div className="space-y-2 mt-4">
                  <Label>Logo Size ({qrSettings.logoWidth}px)</Label>
                  <Slider
                    value={[qrSettings.logoWidth]}
                    min={20}
                    max={150}
                    step={5}
                    onValueChange={(value) => {
                      handleSliderChange("logoWidth", value)
                      handleSliderChange("logoHeight", value)
                    }}
                  />

                  <Label>Logo Opacity ({qrSettings.logoOpacity * 100}%)</Label>
                  <Slider
                    value={[qrSettings.logoOpacity]}
                    min={0.1}
                    max={1}
                    step={0.1}
                    onValueChange={(value) => handleSliderChange("logoOpacity", value)}
                  />
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col items-center justify-start gap-6">
        <Card className="w-full">
          <CardContent className="flex flex-col items-center justify-center pt-6">
            <h3 className="text-lg font-medium mb-4">QR Code Preview</h3>
            <div className="flex flex-wrap gap-2 mb-4 justify-center">
              {platforms.map((platform) => (
                <PlatformBadge key={platform} platform={platform} />
              ))}
            </div>
            <div ref={qrRef} className="bg-white p-4 rounded-lg">
              <QRCode
                value={getQRValue()}
                size={qrSettings.size}
                quietZone={qrSettings.quietZone}
                bgColor={qrSettings.bgColor}
                fgColor={qrSettings.fgColor}
                logoImage={qrSettings.logoImage || undefined}
                logoWidth={qrSettings.logoWidth}
                logoHeight={qrSettings.logoHeight}
                logoOpacity={qrSettings.logoOpacity}
                eyeRadius={qrSettings.eyeRadius}
                eyeColor={qrSettings.eyeColor}
                qrStyle={qrSettings.qrStyle}
                enableCORS={qrSettings.enableCORS}
              />
            </div>
            <Button className="mt-6" onClick={downloadQRCode}>
              <Download className="mr-2 h-4 w-4" />
              Download QR Code
            </Button>
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4">Tips for QR Codes</h3>
            <ul className="space-y-2 text-sm">
              <li>• Use high contrast colors for better scanning</li>
              <li>• Keep the quiet zone clear for reliable scanning</li>
              <li>• Test your QR code on multiple devices</li>
              <li>• Avoid very small QR codes in print materials</li>
              <li>• If using a logo, keep it small (under 25% of QR code size)</li>

              {platforms.includes("web") && <li>• For web links, consider using UTM parameters for tracking</li>}

              {platforms.includes("android") && (
                <li>• For Android apps, use Play Store links or deep links with fallbacks</li>
              )}

              {platforms.includes("ios") && <li>• For iOS apps, use App Store links or Universal Links</li>}

              {platforms.length > 1 && (
                <li className="text-green-700 font-medium">
                  • Multi-platform: Consider using a landing page that detects the user's device
                </li>
              )}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

