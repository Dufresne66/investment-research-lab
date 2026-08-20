import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const researchSchema = z.object({
  title: z.string(),
  description: z.string(),
  status: z.enum(["active", "open", "planned", "archived"]),
  order: z.number(),
  label: z.string(),
  updated: z.string(),
});

const companyResearch = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/companies" }),
  schema: researchSchema,
});

const learning = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/learning" }),
  schema: researchSchema,
});

const journal = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/journal" }),
  schema: researchSchema,
});

const claims = defineCollection({
  loader: glob({ pattern: "**/*.{yaml,yml}", base: "./src/data/claims" }),
  schema: z.array(
    z.object({
      id: z.string(),
      statement: z.string(),
      status: z.enum(["OPEN", "SUPPORTED", "WEAKENED", "REJECTED", "ARCHIVED"]),
      confidence: z.number().min(0).max(100),
      owner: z.literal("HUMAN"),
      evidence_for: z.array(z.string()),
      evidence_against: z.array(z.string()),
      evidence_needed: z.array(z.string()),
      last_updated: z.string(),
    }),
  ),
});

export const collections = { companyResearch, learning, journal, claims };
