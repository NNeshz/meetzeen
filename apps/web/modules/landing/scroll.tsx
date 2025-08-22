import { Marquee } from "@meetzeen/ui/components/magicui/marquee"
import { IconHeart, IconStar, IconRocket } from "@tabler/icons-react"

const phrases = [
  {
    icon: <IconHeart className="w-6 h-6 text-muted" />,
    text: "Made with love"
  },
  {
    icon: <IconStar className="w-6 h-6 text-muted" />,
    text: "Join our community"
  },
  {
    icon: <IconRocket className="w-6 h-6 text-muted" />,
    text: "Launch your ideas"
  }
]

export function Scroll() {
  return (
    <div className="relative flex max-w-3xl mx-auto flex-col items-center justify-center overflow-hidden">
      <Marquee pauseOnHover className="[--duration:20s]">
        {phrases.map((phrase, index) => (
          <div key={index} className="flex items-center gap-2 mx-4">
            {phrase.icon}
            <span className="text-muted text-xl">{phrase.text}</span>
          </div>
        ))}
      </Marquee>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-foreground"></div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-foreground"></div>
    </div>
  );
}