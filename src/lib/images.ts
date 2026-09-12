import sharp from "sharp";

export async function optimizeImage(
  buffer: Buffer,
  opts?: { maxWidth?: number; quality?: number }
): Promise<Buffer> {
  const maxWidth = opts?.maxWidth ?? 1600;
  const quality = opts?.quality ?? 82;

  return sharp(buffer)
    .rotate()
    .resize({ width: maxWidth, withoutEnlargement: true })
    .webp({ quality })
    .toBuffer();
}