import { getCloudflareContext } from "@opennextjs/cloudflare";

export async function uploadImage(file: File, folder = "marysens"): Promise<string> {
  const { env } = getCloudflareContext();
  const cloud = env.CLOUDINARY_CLOUD_NAME;
  const key = env.CLOUDINARY_API_KEY;
  const secret = env.CLOUDINARY_API_SECRET;
  if (!cloud || !key || !secret) throw new Error("Cloudinary non configuré");
  if (!file.type.startsWith("image/")) throw new Error("Le fichier doit être une image");
  if (file.size > 10 * 1024 * 1024) throw new Error("Image trop lourde (10 Mo maximum)");

  const timestamp = Math.floor(Date.now() / 1000).toString();
  const digest = await crypto.subtle.digest(
    "SHA-1",
    new TextEncoder().encode(`folder=${folder}&timestamp=${timestamp}${secret}`)
  );
  const signature = [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");

  const body = new FormData();
  body.append("file", file);
  body.append("api_key", key);
  body.append("timestamp", timestamp);
  body.append("folder", folder);
  body.append("signature", signature);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloud}/image/upload`, { method: "POST", body });
  const data = (await res.json()) as { secure_url?: string; error?: { message: string } };
  if (!res.ok || !data.secure_url) throw new Error(data.error?.message ?? "Échec de l'envoi de l'image");
  return data.secure_url;
}