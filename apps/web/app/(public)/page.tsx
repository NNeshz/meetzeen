import { Demo } from "@/modules/landing/demo";
import { Hero } from "@/modules/landing/hero";
import { Scroll } from "@/modules/landing/scroll";
import { Pros } from "@/modules/landing/pros";
import { Pricing } from "@/modules/landing/pricing";

export default function Page() {
  return (
    <div className="h-screen w-full">
      <Hero />
      <Scroll />
      <Demo />
      <Pros />
      <Pricing />
    </div>
  );
}
