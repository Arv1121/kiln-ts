import { z } from "zod";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Validation schema for Post. Used by controllers to
 * validate request bodies before writing to the database.
 */
export const PostSchema = z.object({
  title: z.string(),
  body: z.string(),
  published: z.boolean(),
});

export type PostInput = z.infer<typeof PostSchema>;

/**
 * Typed accessor for the Post model, built on the Prisma
 * client. Controllers should import this rather than constructing
 * their own PrismaClient instances.
 */
export const PostModel = prisma.post;
