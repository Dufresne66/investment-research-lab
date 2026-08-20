import { defineConfig } from "astro/config";

const [owner, repository] = (process.env.GITHUB_REPOSITORY ?? "/").split("/");
const isUserPage = repository === `${owner}.github.io`;
const githubSite = owner ? `https://${owner}.github.io` : undefined;
const githubBase = repository && !isUserPage ? `/${repository}` : "/";

export default defineConfig({
  output: "static",
  site: process.env.PUBLIC_SITE_URL || githubSite,
  base: process.env.PUBLIC_BASE_PATH || githubBase,
  trailingSlash: "always",
});
