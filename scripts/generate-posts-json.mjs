import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { parse } from "yaml";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");
const postsDir = path.join(projectRoot, "content", "posts");
const outputPath = path.join(projectRoot, "content", "posts.json");

export function parseFrontMatter(markdown) {
  const normalized = markdown.replace(/\r\n/g, "\n");
  const match = normalized.match(/^---\n([\s\S]*?)\n---(?:\n|$)/);
  if (!match) {
    return { data: {}, body: normalized.trim() };
  }

  return {
    data: parse(match[1]) || {},
    body: normalized.slice(match[0].length).trim(),
  };
}

function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function normalizePost(markdown, fileName) {
  const { data, body } = parseFrontMatter(markdown);
  const fallbackSlug = slugify(fileName.replace(/\.md$/i, ""));
  const tags = Array.isArray(data.tags) ? data.tags : [];

  return {
    title: data.title || fileName.replace(/\.md$/i, ""),
    slug: data.slug ? slugify(data.slug) : fallbackSlug,
    summary: data.summary || "",
    author: data.author || "Guy Haik",
    publishedAt: data.publishedAt || new Date(0).toISOString(),
    tags,
    draft: Boolean(data.draft),
    body,
    file: fileName,
  };
}

async function buildPostIndex() {
  const fileNames = await readdir(postsDir);
  const markdownFiles = fileNames.filter((fileName) => fileName.endsWith(".md")).sort();
  const posts = await Promise.all(
    markdownFiles.map(async (fileName) => {
      const filePath = path.join(postsDir, fileName);
      const markdown = await readFile(filePath, "utf8");
      return normalizePost(markdown, fileName);
    }),
  );

  return posts.sort((left, right) => new Date(right.publishedAt) - new Date(left.publishedAt));
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const posts = await buildPostIndex();
  await writeFile(outputPath, `${JSON.stringify(posts, null, 2)}\n`, "utf8");
  console.log(`Wrote ${posts.length} posts to ${path.relative(projectRoot, outputPath)}.`);
}
