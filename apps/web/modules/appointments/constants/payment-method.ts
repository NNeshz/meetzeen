export const PAYMENT_METHOD = {
  CASH: "cash",
  CARD: "card",
  BANK_TRANSFER: "bank_transfer",
  OTHER: "other",
} as const;

export type PaymentMethod =
  (typeof PAYMENT_METHOD)[keyof typeof PAYMENT_METHOD];

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  [PAYMENT_METHOD.CASH]: "Efectivo",
  [PAYMENT_METHOD.CARD]: "Tarjeta",
  [PAYMENT_METHOD.BANK_TRANSFER]: "Transferencia bancaria",
  [PAYMENT_METHOD.OTHER]: "Otro",
};

export const PAYMENT_METHOD_OPTIONS = [
  { value: PAYMENT_METHOD.CASH, label: PAYMENT_METHOD_LABELS[PAYMENT_METHOD.CASH] },
  { value: PAYMENT_METHOD.CARD, label: PAYMENT_METHOD_LABELS[PAYMENT_METHOD.CARD] },
  { value: PAYMENT_METHOD.BANK_TRANSFER, label: PAYMENT_METHOD_LABELS[PAYMENT_METHOD.BANK_TRANSFER] },
  { value: PAYMENT_METHOD.OTHER, label: PAYMENT_METHOD_LABELS[PAYMENT_METHOD.OTHER] },
] as const;

