import { defineConfig } from "astro/config";

const repository = process.env.GITHUB_REPOSITORY;
const [owner, repo] = repository?.split("/") ?? [];
const site = owner ? `https://${owner}.github.io` : "https://delalama.github.io";
const base = repo ? `/${repo}/` : "/dr_sax/";

export default defineConfig({
  publicDir: "./static",
  site,
  base
});
