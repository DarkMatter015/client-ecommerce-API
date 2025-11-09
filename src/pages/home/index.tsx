import React from "react";
import "./home.style.css";
import { HomeHero } from "@/components/HomeHero";
import { HomeProducts } from "@/components/HomeProducts";
import { HomeTestimonials } from "@/components/HomeTestimonials";
import { HomeAbout } from "@/components/HomeAbout";

export const HomePage: React.FC = () => {
  return (
    <main className="home-page">
      <HomeHero />
      <HomeProducts />
      <HomeTestimonials />
      <HomeAbout />
    </main>
  );
};
