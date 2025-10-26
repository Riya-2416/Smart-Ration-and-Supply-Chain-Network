"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Shield } from "lucide-react"
import { LanguageSelector } from "@/components/language-selector"
import { useLanguage } from "@/lib/language-context"

const scrollToFeatures = () => {
  const featuresSection = document.getElementById("features")
  if (featuresSection) {
    featuresSection.scrollIntoView({ behavior: "smooth", block: "start" })
  }
}

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const { t } = useLanguage()

  const navigation = [
    { name: t("home"), href: "/" },
    { name: t("services"), href: "/services" },
    { name: t("trackRation"), href: "/track" },
    { name: t("support"), href: "/support" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 animate-slide-down">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 hover-scale group">
            <Shield className="h-8 w-8 text-primary animate-pulse-slow group-hover:animate-glow transition-all duration-300" />
            <div className="flex flex-col">
              <span className="text-lg font-bold text-foreground group-hover:gradient-text transition-all duration-300">
                Smart Ration
              </span>
              <span className="text-xs text-muted-foreground">Supply Chain Network</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item, index) => (
              <button
                key={item.name}
                onClick={item.name === t("services") ? scrollToFeatures : undefined}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-all duration-300 hover-lift relative group animate-fade-in cursor-pointer"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {item.name === t("services") ? (
                  <span>{item.name}</span>
                ) : (
                  <Link href={item.href}>{item.name}</Link>
                )}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
              </button>
            ))}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-4 animate-fade-in" style={{ animationDelay: "0.5s" }}>
            <div className="hover-scale">
              <LanguageSelector />
            </div>
            <Link href="/login">
              <Button
                variant="outline"
                size="sm"
                className="hidden sm:inline-flex bg-transparent hover-lift hover:border-primary transition-all duration-300"
              >
                {t("login")}
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm" className="hidden sm:inline-flex hover-lift hover-glow gradient-bg">
                {t("register")}
              </Button>
            </Link>

            {/* Mobile menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden hover-scale">
                  <Menu className="h-5 w-5 transition-transform duration-300 hover:rotate-90" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px] animate-slide-down">
                <nav className="flex flex-col space-y-4">
                  {navigation.map((item, index) => {
                    const isServices = item.name === t("services")
                    return (
                      <button
                        key={item.name}
                        onClick={() => {
                          if (isServices) {
                            scrollToFeatures()
                          }
                          setIsOpen(false)
                        }}
                        className="text-left text-sm font-medium text-muted-foreground hover:text-foreground transition-all duration-300 hover-lift animate-slide-up"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        {isServices ? item.name : <Link href={item.href}>{item.name}</Link>}
                      </button>
                    )
                  })}
                  <div className="pt-4 space-y-2 animate-fade-in" style={{ animationDelay: "0.4s" }}>
                    <Link href="/login" onClick={() => setIsOpen(false)}>
                      <Button variant="outline" className="w-full bg-transparent hover-lift">
                        {t("login")}
                      </Button>
                    </Link>
                    <Link href="/register" onClick={() => setIsOpen(false)}>
                      <Button className="w-full hover-lift gradient-bg">{t("register")}</Button>
                    </Link>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
