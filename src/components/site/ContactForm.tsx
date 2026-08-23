"use client";

import { useState, type FormEvent } from "react";
import { Send } from "lucide-react";

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
      <div className="rounded-lg border border-or/40 bg-or/5 px-6 py-10 text-center">
        <p className="font-display text-xl text-white">Votre message a bien été envoyé.</p>
        <p className="mt-2 text-sm text-white/55">Nous revenons vers vous très vite.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <Field label="Nom" name="name" placeholder="Votre nom" required />
      <Field label="Email" name="email" type="email" placeholder="votre@email.com" required />
      <Field label="Sujet" name="subject" placeholder="Sujet de votre message" />
      <label className="flex flex-col gap-2">
        <span className="text-sm font-medium text-white">Message</span>
        <textarea
          name="message"
          required
          rows={5}
          placeholder="Votre message..."
          className="resize-none rounded-lg border border-white/35 bg-black px-4 py-2 text-sm text-white outline-none placeholder:text-white/35 focus:border-or"
        />
      </label>

      {status === "error" && (
        <p className="text-sm text-argile">
          Une erreur est survenue. Réessayez, ou écrivez-nous directement sur WhatsApp.
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="flex w-fit items-center gap-2 rounded-lg bg-or px-8 py-2 font-medium text-black disabled:opacity-50"
      >
        <Send className="size-4" />
        {status === "sending" ? "Envoi en cours…" : "Envoyer"}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
  required,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-sm font-medium text-white">{label}</span>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        required={required}
        className="rounded-lg border border-white/35 bg-black px-4 py-2 text-sm text-white outline-none placeholder:text-white/35 focus:border-or"
      />
    </label>
  );
}
