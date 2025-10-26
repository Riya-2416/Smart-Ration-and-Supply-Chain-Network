"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Shield, Smartphone, Clock, Users } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

export function Hero() {
  const { t } = useLanguage()

  return (
    <section className="relative py-20 lg:py-32 bg-animated">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto animate-fade-in">
          <div className="flex justify-center mb-6">
            <div className="flex items-center space-x-2 bg-primary/10 px-4 py-2 rounded-full hover-scale animate-glow">
              <Shield className="h-5 w-5 text-primary animate-pulse-slow" />
              <span className="text-sm font-medium text-primary">Government of India Initiative</span>
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-balance mb-6 gradient-text animate-slide-up">
            {t("heroTitle")}
          </h1>

          <p
            className="text-xl text-muted-foreground text-balance mb-8 max-w-2xl mx-auto animate-slide-up"
            style={{ animationDelay: "0.2s" }}
          >
            {t("heroSubtitle")}
          </p>

          <div
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-scale-in"
            style={{ animationDelay: "0.4s" }}
          >
            <Link href="/register">
              <Button size="lg" className="w-full sm:w-auto hover-lift hover-glow gradient-bg">
                {t("registerRationCard")}
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg" className="w-full sm:w-auto bg-transparent hover-lift">
                {t("loginToAccount")}
              </Button>
            </Link>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Card className="hover-lift animate-slide-up" style={{ animationDelay: "0.6s" }}>
              <CardContent className="p-6 text-center">
                <Users className="h-8 w-8 text-primary mx-auto mb-2 animate-float" />
                <div className="text-2xl font-bold">2.5M+</div>
                <div className="text-sm text-muted-foreground">{t("beneficiaries")}</div>
              </CardContent>
            </Card>
            <Card className="hover-lift animate-slide-up" style={{ animationDelay: "0.7s" }}>
              <CardContent className="p-6 text-center">
                <Shield className="h-8 w-8 text-primary mx-auto mb-2 animate-float" style={{ animationDelay: "1s" }} />
                <div className="text-2xl font-bold">99.9%</div>
                <div className="text-sm text-muted-foreground">{t("security")}</div>
              </CardContent>
            </Card>
            <Card className="hover-lift animate-slide-up" style={{ animationDelay: "0.8s" }}>
              <CardContent className="p-6 text-center">
                <Clock className="h-8 w-8 text-primary mx-auto mb-2 animate-float" style={{ animationDelay: "2s" }} />
                <div className="text-2xl font-bold">24/7</div>
                <div className="text-sm text-muted-foreground">{t("availability")}</div>
              </CardContent>
            </Card>
            <Card className="hover-lift animate-slide-up" style={{ animationDelay: "0.9s" }}>
              <CardContent className="p-6 text-center">
                <Smartphone
                  className="h-8 w-8 text-primary mx-auto mb-2 animate-float"
                  style={{ animationDelay: "3s" }}
                />
                <div className="text-2xl font-bold">{t("mobileFriendly")}</div>
                <div className="text-sm text-muted-foreground">Friendly</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
