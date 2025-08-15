import QRCodeGenerator from "@/components/qr-code-generator"

export default function Home() {
  return (
    <main className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">Custom QR Code Generator</h1>
      <QRCodeGenerator />
    </main>
  )
}

