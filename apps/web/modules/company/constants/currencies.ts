export interface CurrencyOption {
  value: string;
  label: string;
}

export const currencies: CurrencyOption[] = [
  // LATAM
  { value: "MXN", label: "Peso Mexicano (MXN)" },
  { value: "ARS", label: "Peso Argentino (ARS)" },
  { value: "BRL", label: "Real Brasileño (BRL)" },
  { value: "CLP", label: "Peso Chileno (CLP)" },
  { value: "COP", label: "Peso Colombiano (COP)" },
  { value: "PEN", label: "Sol Peruano (PEN)" },
  { value: "UYU", label: "Peso Uruguayo (UYU)" },
  { value: "VES", label: "Bolívar Venezolano (VES)" },
  { value: "BOB", label: "Boliviano (BOB)" },
  { value: "PYG", label: "Guaraní Paraguayo (PYG)" },
  { value: "GTQ", label: "Quetzal Guatemalteco (GTQ)" },
  { value: "HNL", label: "Lempira Hondureño (HNL)" },
  { value: "NIO", label: "Córdoba Nicaragüense (NIO)" },
  { value: "CRC", label: "Colón Costarricense (CRC)" },
  { value: "PAB", label: "Balboa Panameño (PAB)" },
  { value: "DOP", label: "Peso Dominicano (DOP)" },
  { value: "CUP", label: "Peso Cubano (CUP)" },
  // USD
  { value: "USD", label: "Dólar Estadounidense (USD)" },
  // Europa
  { value: "EUR", label: "Euro (EUR)" },
  { value: "GBP", label: "Libra Esterlina (GBP)" },
  { value: "CHF", label: "Franco Suizo (CHF)" },
  { value: "SEK", label: "Corona Sueca (SEK)" },
  { value: "NOK", label: "Corona Noruega (NOK)" },
  { value: "DKK", label: "Corona Danesa (DKK)" },
  { value: "PLN", label: "Złoty Polaco (PLN)" },
  { value: "CZK", label: "Corona Checa (CZK)" },
  { value: "HUF", label: "Forinto Húngaro (HUF)" },
  { value: "RON", label: "Leu Rumano (RON)" },
];
