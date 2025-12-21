import {
  Inter,
  Roboto,
  Poppins,
  Montserrat,
  Open_Sans,
  Lato,
  Playfair_Display,
} from "next/font/google";

export const inter = Inter({ subsets: ["latin"] });
export const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
});
export const poppins = Poppins({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
});
export const montserrat = Montserrat({ subsets: ["latin"] });
export const openSans = Open_Sans({ subsets: ["latin"] });
export const lato = Lato({
  weight: ["300", "400", "700"],
  subsets: ["latin"],
});
export const playfair = Playfair_Display({ subsets: ["latin"] });

export const fontMap = {
  inter,
  roboto,
  poppins,
  montserrat,
  "open-sans": openSans,
  lato,
  playfair,
};

