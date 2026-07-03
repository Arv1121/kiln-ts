import fs from "fs-extra";
import path from "node:path";
const TYPE_MAP = {
    string: { prisma: "String", zod: "z.string()", ts: "string" },
    text: { prisma: "String", zod: "z.string()", ts: "string" },
    int: { prisma: "Int", zod: "z.number().int()", ts: "number" },
    integer: { prisma: "Int", zod: "z.number().int()", ts: "number" },
    float: { prisma: "Float", zod: "z.number()", ts: "number" },
    boolean: { prisma: "Boolean", zod: "z.boolean()", ts: "boolean" },
    datetime: { prisma: "DateTime", zod: "z.coerce.date()", ts: "Date" },
};
function parseFields(rawFields) {
    return rawFields.map((raw) => {
        const [name, type] = raw.split(":");
        if (!name || !type) {
            throw new Error(`Invalid field definition "${raw}". Expected format: name:type`);
        }
        if (!TYPE_MAP[type]) {
            throw new Error(`Unknown type "${type}" in field "${raw}". Supported types: ${Object.keys(TYPE_MAP).join(", ")}`);
        }
        return { name, type };
    });
}
function capitalize(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
}
function toTableName(modelName) {
    // simple pluralization: User -> users, Post -> posts, Category -> categories
    const lower = modelName.toLowerCase();
    if (lower.endsWith("y"))
        return lower.slice(0, -1) + "ies";
    if (lower.endsWith("s"))
        return lower + "es";
    return lower + "s";
}
export async function generateModel(modelName, rawFields, cwd) {
    const fields = parseFields(rawFields);
    const className = capitalize(modelName);
    const tableName = toTableName(modelName);
    await writePrismaModel(className, tableName, fields, cwd);
    await writeModelFile(className, fields, cwd);
}
async function writePrismaModel(className, tableName, fields, cwd) {
    const schemaPath = path.join(cwd, "prisma", "schema.prisma");
    const schema = await fs.readFile(schemaPath, "utf-8");
    const fieldLines = fields
        .map((f) => `  ${f.name} ${TYPE_MAP[f.type].prisma}`)
        .join("\n");
    const block = [
        `model ${className} {`,
        `  id        Int      @id @default(autoincrement())`,
        fieldLines,
        `  createdAt DateTime @default(now())`,
        `  updatedAt DateTime @updatedAt`,
        ``,
        `  @@map("${tableName}")`,
        `}`,
        ``,
    ].join("\n");
    const marker = "// KILN:MODELS";
    if (!schema.includes(marker)) {
        throw new Error(`Could not find the "${marker}" marker in prisma/schema.prisma. Has it been edited?`);
    }
    const updated = schema.replace(marker, `${block}\n${marker}`);
    await fs.writeFile(schemaPath, updated);
    console.log(`  → added model ${className} to prisma/schema.prisma`);
}
async function writeModelFile(className, fields, cwd) {
    const fileName = `${className.toLowerCase()}.ts`;
    const filePath = path.join(cwd, "src", "models", fileName);
    const zodFields = fields.map((f) => `  ${f.name}: ${TYPE_MAP[f.type].zod},`).join("\n");
    const content = [
        `import { z } from "zod";`,
        `import { PrismaClient } from "@prisma/client";`,
        ``,
        `const prisma = new PrismaClient();`,
        ``,
        `/**`,
        ` * Validation schema for ${className}. Used by controllers to`,
        ` * validate request bodies before writing to the database.`,
        ` */`,
        `export const ${className}Schema = z.object({`,
        zodFields,
        `});`,
        ``,
        `export type ${className}Input = z.infer<typeof ${className}Schema>;`,
        ``,
        `/**`,
        ` * Typed accessor for the ${className} model, built on the Prisma`,
        ` * client. Controllers should import this rather than constructing`,
        ` * their own PrismaClient instances.`,
        ` */`,
        `export const ${className}Model = prisma.${className.toLowerCase()};`,
        ``,
    ].join("\n");
    await fs.ensureDir(path.dirname(filePath));
    await fs.writeFile(filePath, content);
    console.log(`  → created src/models/${fileName}`);
}
