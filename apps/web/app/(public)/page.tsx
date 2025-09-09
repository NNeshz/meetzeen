import { Demo } from "@/modules/landing/demo";
import { Faq } from "@/modules/landing/faq";
import { Hero } from "@/modules/landing/hero";
import { Pricing } from "@/modules/landing/pricing";
import { Pros } from "@/modules/landing/pros";
import { Treats } from "@/modules/landing/treats";
import { Works } from "@/modules/landing/works";

export default function Page() {
  return (
    <div className="w-full">
      <Hero />
      <Demo />
      <Pros />
      <Works />
      <Treats />
      <Pricing />
      <Faq />
    </div>
  );
}
