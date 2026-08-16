"use client";

import { useState, type FormEvent } from "react";

type Status = "idle" | "sending" | "success" | "error";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const form = e.currentTarget;
    const payload = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("failed");
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="border border-sauge/40 bg-sauge/5 px-6 py-10 text-center">
        <p className="font-display text-xl">Message envoyé</p>
        <p className="mt-2 text-sm text-ink/60">Merci — nous revenons vers vous très vite.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="Nom" name="name" required />
        <Field label="E-mail" name="email" type="email" required />
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="Téléphone" name="phone" />
        <Field label="Sujet" name="subject" />
      </div>
      <label className="flex flex-col gap-2">
        <span className="text-[12px] uppercase tracking-[0.08em] text-ink/55">Message</span>
        <textarea
          name="message"
          required
          rows={5}
          className="border border-ink/20 bg-transparent px-4 py-3 text-sm outline-none focus:border-or-deep"
        />
      </label>

      {status === "error" && (
        <p className="text-sm text-argile">
          Une erreur est survenue. Réessayez, ou écrivez-nous directement sur WhatsApp.
        </p>
      )}

      <button type="submit" disabled={status === "sending"} className="btn btn-dark w-fit disabled:opacity-50">
        {status === "sending" ? "Envoi en cours…" : "Envoyer le message"}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-[12px] uppercase tracking-[0.08em] text-ink/55">{label}</span>
      <input
        type={type}
        name={name}
        required={required}
        className="border border-ink/20 bg-transparent px-4 py-3 text-sm outline-none focus:border-or-deep"
      />
    </label>
  );
}
