import { Hero } from "@/modules/landing/hero";
import { BadgeHero } from "@/modules/landing/badge-hero";
import { About } from "@/modules/landing/about";
import { HowTo } from "@/modules/landing/how-to";
import { Features } from "@/modules/landing/features";

export default function Page() {
  return (
    <>
      <Hero />
      <BadgeHero />
      <About />
      <HowTo />
      <Features />
    </>
  )
}