import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

export type StaticImage = {
  fileName: string;
  url: string;
  caption: string;
};

export type StaticPost = {
  id: string;
  slug: string;
  folderName: string;
  title: string;
  excerpt: string;
  description: string;
  publishedAt: string;
  workType: string;
  model?: string;
  tags: string[];
  coverImageUrl?: string;
  images: StaticImage[];
};

type PostMeta = {
  title?: string;
  excerpt?: string;
  date?: string;
  workType?: string;
  model?: string;
  tags?: string[];
};

const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);
const BASE_URL = import.meta.env.BASE_URL ?? "/";

function withBase(relativePath: string) {
  const base = BASE_URL.endsWith("/") ? BASE_URL : `${BASE_URL}/`;
  const clean = relativePath.replace(/^\/+/, "");
  return `${base}${clean}`;
}

function slugify(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function titleFromFolder(folderName: string) {
  return folderName.replace(/[-_]/g, " ");
}

function parseDateFromFolder(folderName: string) {
  if (/^\d{4}-\d{2}-\d{2}$/.test(folderName)) {
    return `${folderName}T12:00:00.000Z`;
  }

  return new Date().toISOString();
}

function parseCaptions(raw: string) {
  const map = new Map<string, string>();
  const order: string[] = [];
  const lines = raw.split(/\r?\n/);

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const separatorIndex = trimmed.indexOf("|");
    if (separatorIndex <= 0) {
      continue;
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    const value = trimmed.slice(separatorIndex + 1).trim();
    if (key && value) {
      if (!map.has(key)) {
        order.push(key);
      }
      map.set(key, value);
    }
  }

  return { map, order };
}

function filenameToBriefDescription(fileName: string) {
  const baseName = path.parse(fileName).name;
  const cleaned = baseName.replace(/[_-]+/g, " ").trim();
  const compact = cleaned.replace(/\s+/g, " ");
  return `Imagen: ${compact}.`;
}

function normalizeTag(tag: string) {
  return tag
    .normalize("NFKD")
    .replace(/[^\w:\s-]/g, "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function normalizeTags(tags: string[] | undefined) {
  if (!Array.isArray(tags)) {
    return [];
  }

  return [...new Set(tags.map(normalizeTag).filter(Boolean))];
}

async function readIfExists(filePath: string) {
  try {
    return await readFile(filePath, "utf8");
  } catch {
    return null;
  }
}

async function loadMeta(folderPath: string): Promise<PostMeta> {
  const metaPath = path.join(folderPath, "meta.json");
  const raw = await readIfExists(metaPath);
  if (!raw) {
    return {};
  }

  try {
    return JSON.parse(raw) as PostMeta;
  } catch {
    return {};
  }
}

async function loadDescription(folderPath: string) {
  const md = await readIfExists(path.join(folderPath, "post.md"));
  if (md) {
    return md.trim();
  }

  const txt = await readIfExists(path.join(folderPath, "post.txt"));
  if (txt) {
    return txt.trim();
  }

  return "";
}

async function loadCaptionMap(folderPath: string) {
  const raw = await readIfExists(path.join(folderPath, "captions.txt"));
  if (!raw) {
    return { map: new Map<string, string>(), order: [] as string[] };
  }

  return parseCaptions(raw);
}

async function readPostFromFolder(folderName: string): Promise<StaticPost | null> {
  const folderPath = path.join(process.cwd(), "static", folderName);
  const entries = await readdir(folderPath, { withFileTypes: true });
  const imageFiles = entries
    .filter((entry) => entry.isFile() && IMAGE_EXTENSIONS.has(path.extname(entry.name).toLowerCase()))
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b));

  if (imageFiles.length === 0) {
    return null;
  }

  const meta = await loadMeta(folderPath);
  const description = await loadDescription(folderPath);
  const captions = await loadCaptionMap(folderPath);

  const orderedFromCaptions = captions.order.filter((fileName) => imageFiles.includes(fileName));
  const remainingFiles = imageFiles.filter((fileName) => !orderedFromCaptions.includes(fileName));
  const orderedImageFiles = [...orderedFromCaptions, ...remainingFiles];

  const images = orderedImageFiles.map((fileName) => ({
    fileName,
    url: withBase(`${folderName}/${fileName}`),
    caption: captions.map.get(fileName) ?? filenameToBriefDescription(fileName)
  }));

  const title = meta.title ?? titleFromFolder(folderName);
  const excerpt =
    meta.excerpt ??
    (description ? description.slice(0, 180) : `Registro con ${images.length} imagenes del taller.`);

  return {
    id: folderName,
    slug: slugify(folderName),
    folderName,
    title,
    excerpt,
    description,
    publishedAt: meta.date ?? parseDateFromFolder(folderName),
    workType: meta.workType ?? "Trabajo de taller",
    model: meta.model,
    tags: normalizeTags(meta.tags),
    coverImageUrl: images[0]?.url,
    images
  };
}

export async function getStaticPosts(): Promise<StaticPost[]> {
  const staticPath = path.join(process.cwd(), "static");
  const entries = await readdir(staticPath, { withFileTypes: true });

  const folders = entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name);
  const posts = (
    await Promise.all(folders.map((folderName) => readPostFromFolder(folderName)))
  ).filter(Boolean) as StaticPost[];

  return posts.sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export async function getStaticPostBySlug(slug: string): Promise<StaticPost | null> {
  const posts = await getStaticPosts();
  return posts.find((post) => post.slug === slug) ?? null;
}
