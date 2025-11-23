import React from "react";
import "./home.style.css";
import { HomeHero } from "@/components/Home/HomeHero";
import { HomeProducts } from "@/components/Home/HomeProducts";
import { HomeTestimonials } from "@/components/Home/HomeTestimonials";
import { HomeAbout } from "@/components/Home/HomeAbout";

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
