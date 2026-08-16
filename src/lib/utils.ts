import slugifyLib from "slugify";

export function slugify(input: string) {
  return slugifyLib(input, { lower: true, strict: true, locale: "fr" });
}

export function formatPrice(price: number) {
  return new Intl.NumberFormat("fr-TN", {
    style: "currency",
    currency: "TND",
    minimumFractionDigits: 2,
  }).format(price);
}

export function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}
