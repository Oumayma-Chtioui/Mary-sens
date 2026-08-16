import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center">
      <span className="eyebrow">404</span>
      <h1 className="font-display text-4xl">Cette page n&apos;existe pas</h1>
      <p className="max-w-sm text-sm text-ink/55">
        La page que vous cherchez a peut-être été déplacée ou n&apos;existe plus.
      </p>
      <Link href="/" className="btn btn-dark mt-2">Retour à l&apos;accueil</Link>
    </div>
  );
}
