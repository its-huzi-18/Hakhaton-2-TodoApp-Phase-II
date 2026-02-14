"use client";


import Hero from "./components/Hero";
import Features from "./components/features/page";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
    

      <main className="flex-grow">
        <Hero />
        <Features />
      </main>

      <Footer />
    </div>
  );
}
