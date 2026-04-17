import fm from "front-matter";
import { marked } from "marked";

export function parseMarkdown(md: string) {
  const parsed = fm(md);

  const frontmatter = parsed.attributes;
  const html = marked.parse(parsed.body);

  return { frontmatter, html };
}
