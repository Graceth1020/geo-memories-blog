import matter from "gray-matter";
import { Buffer } from "buffer";
// gray-matter relies on Buffer being globally available
if (typeof window !== "undefined" && !(window as any).Buffer) {
  (window as any).Buffer = Buffer;
}

export interface Post {
  slug: string;
  title: string;
  date: string;
  province: string;
  location?: string;
  cover?: string;
  excerpt?: string;
  content: string;
}

const modules = import.meta.glob("/src/posts/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
}) as Record<string, string>;

const slugFromPath = (path: string) =>
  path.split("/").pop()!.replace(/\.md$/, "");

export const allPosts: Post[] = Object.entries(modules)
  .map(([path, raw]) => {
    const { data, content } = matter(raw);
    return {
      slug: slugFromPath(path),
      title: data.title ?? slugFromPath(path),
      date: String(data.date ?? ""),
      province: data.province ?? "未知",
      location: data.location,
      cover: data.cover,
      excerpt: data.excerpt,
      content,
    };
  })
  .sort((a, b) => (a.date < b.date ? 1 : -1));

export const visitedProvinces = Array.from(
  new Set(allPosts.map((p) => p.province))
);

export const postsByProvince = (province: string) =>
  allPosts.filter((p) => p.province === province);

export const getPost = (slug: string) =>
  allPosts.find((p) => p.slug === slug);
