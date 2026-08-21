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

const learningSourceSchema = z.object({
  source_id: z.string(),
  title: z.string(),
  publisher: z.string(),
  published: z.string(),
  url: z.url(),
  host: z.string().optional(),
  relationship: z.enum(["original", "repost", "mirror"]),
  retrieved: z.string(),
  verification_status: z.enum(["ORIGINAL_VERIFIED", "REPOST_VERIFIED", "ORIGINAL_AND_REPOST_VERIFIED"]),
});

const learningSchema = researchSchema.extend({
  content_type: z.enum(["method", "concept", "interview-study"]).default("method"),
  reading_time: z.number().int().positive().max(60).optional(),
  primary_source: learningSourceSchema.optional(),
  related_learning: z.array(z.string()).default([]),
}).superRefine((entry, context) => {
  if (entry.content_type === "interview-study" && !entry.primary_source) {
    context.addIssue({
      code: "custom",
      path: ["primary_source"],
      message: "Interview studies require a verified primary_source record.",
    });
  }
});

const companyResearch = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/companies" }),
  schema: researchSchema,
});

const learning = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/learning" }),
  schema: learningSchema,
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
      claim_type: z.enum(["FACT", "INFERENCE", "HYPOTHESIS"]),
      confidence: z.number().min(0).max(100).nullable(),
      owner: z.literal("HUMAN"),
      evidence_for: z.array(z.string()),
      evidence_against: z.array(z.string()),
      evidence_needed: z.array(z.string()),
      last_updated: z.string(),
    }),
  ),
});

const companies = defineCollection({
  loader: glob({ pattern: "*.json", base: "./src/data/companies" }),
  schema: z.object({
    slug: z.string(),
    name: z.string(),
    ticker: z.string(),
    exchange: z.string(),
    industry: z.string(),
    research_status: z.enum(["RESEARCHING", "PLANNED", "ARCHIVED"]),
    last_updated: z.string(),
    sort_order: z.number(),
    primary_claim_id: z.string().nullable(),
    core_question_en: z.string().nullable(),
    economic_model: z.any().nullable(),
    evidence: z.array(z.any()),
    risks: z.array(z.any()),
    sources: z.array(z.any()),
  }),
});

export const collections = { companyResearch, learning, journal, claims, companies };
