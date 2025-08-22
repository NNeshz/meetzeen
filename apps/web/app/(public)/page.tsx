import { Hero } from "@/modules/landing/hero";
import { Scroll } from "@/modules/landing/scroll";

export default function Page() {
  return (
    <div className="h-screen w-full">
      <Hero />
      <Scroll />
    </div>
  );
}
