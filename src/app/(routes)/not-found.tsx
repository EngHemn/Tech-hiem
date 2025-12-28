"use client";
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Home,
  ShoppingBag,
  ArrowLeft,
  AlertCircle,
  Search,
} from "lucide-react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

export default function NotFound() {
  const t = useTranslations();

  const fadeInUp = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <div className="min-h-[calc(100vh-12rem)] flex items-center justify-center p-4 md:p-6">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="w-full max-w-2xl"
      >
        <Card className="border-2 shadow-lg">
          <CardHeader className="text-center space-y-4">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mx-auto w-28 h-28 rounded-full bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/30 dark:to-orange-800/30 flex items-center justify-center"
            >
              <AlertCircle className="w-14 h-14 text-orange-600 dark:text-orange-400" />
            </motion.div>
            <CardTitle className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-orange-500 to-orange-400">
              404
            </CardTitle>
            <CardDescription className="text-xl md:text-2xl font-semibold">
              Oops! Page Not Found
            </CardDescription>
            <p className="text-muted-foreground mt-2 text-base md:text-lg">
              The page you're looking for doesn't exist or has been moved to a
              different location.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                asChild
                size="lg"
                className="gap-2 bg-orange-600 hover:bg-orange-700"
              >
                <Link href="/">
                  <Home className="w-5 h-5" />
                  Go to Home
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="gap-2">
                <Link href="/products">
                  <ShoppingBag className="w-5 h-5" />
                  Browse Products
                </Link>
              </Button>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild variant="ghost" className="gap-2">
                <Link href="/blog">
                  <Search className="w-4 h-4" />
                  Visit Blog
                </Link>
              </Button>
              <Button asChild variant="ghost" className="gap-2">
                <Link href="/ContactUs">
                  <ArrowLeft className="w-4 h-4" />
                  Contact Us
                </Link>
              </Button>
            </div>
            <div className="text-center mt-6 pt-6 border-t">
              <p className="text-sm text-muted-foreground">
                If you believe this is an error, please contact our support
                team.
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
