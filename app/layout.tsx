import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { LanguageProvider } from "@/lib/language-context"
import { Suspense } from "react"
import RationBackground from "@/components/background/ration-background"

export const metadata: Metadata = {
  title: "Smart Ration & Supply Chain Network",
  description: "Smart Ration & Supply Chain Network",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} relative overflow-x-hidden`}>
        <RationBackground />
        <Suspense fallback={<div>Loading...</div>}>
          <LanguageProvider>{children}</LanguageProvider>
          <Analytics />
        </Suspense>
      </body>
    </html>
  )
}
