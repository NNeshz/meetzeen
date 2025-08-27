import { Marquee } from "@meetzeen/ui/components/magicui/marquee"
import { IconHeart, IconStar, IconRocket, IconCalendar, IconUsers, IconUserDollar } from "@tabler/icons-react"

const phrases = [
  {
    icon: <IconHeart className="inline-block size-8 text-white" />,
    text: "Hecho con amor"
  },
  {
    icon: <IconStar className="inline-block size-8 text-white" />,
    text: "Ten un plus"
  },
  {
    icon: <IconRocket className="inline-block size-8 text-white" />,
    text: "Mejora tu negocio"
  },
  {
    icon: <IconCalendar className="inline-block size-8 text-white" />,
    text: "Ahorra tiempo"
  },
  {
    icon: <IconUserDollar className="inline-block size-8 text-white" />,
    text: "Gana más dinero"
  },
  {
    icon: <IconUsers className="inline-block size-8 text-white" />,
    text: "Conecta con más clientes"
  },
]

export function Scroll() {
  return (
    <div className="relative flex max-w-3xl mx-auto flex-col items-center justify-center overflow-hidden py-8">
      <Marquee pauseOnHover className="[--duration:60s]">
        {phrases.map((phrase, index) => (
          <div key={index} className="flex items-center gap-2 mx-4">
            {phrase.icon}
            <span className="text-white text-xl font-semibold font-geist">{phrase.text}</span>
          </div>
        ))}
      </Marquee>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-background to-transparent"></div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-background to-transparent"></div>
    </div>
  );
}