import { mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { join } from "node:path";

const TITLE = "Chief of Refreshing the Dashboard Until It Agrees";
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

type TitleFacts = {
  title: string;
  characters: number;
  bytes: number;
  words: number;
};

function titleFacts(text: string): TitleFacts {
  const trimmed = text.trim();
  const words = trimmed.length === 0 ? 0 : trimmed.split(/\s+/).length;
  return {
    title: text,
    characters: [...text].length,
    bytes: Buffer.byteLength(text, "utf8"),
    words,
  };
}

function fail(message: string): never {
  process.stderr.write(message + "\n");
  process.exit(1);
}

const facts = titleFacts(TITLE);

if (facts.title !== facts.title.trim()) {
  fail("title must not have leading or trailing whitespace");
}

if (facts.title.trim().length === 0) {
  fail("title is empty after trimming whitespace");
}

if (facts.title.includes("\n") || facts.title.includes("\r")) {
  fail("title must be a single line with no newline inside");
}

if (facts.characters < 1 || facts.characters > 60) {
  fail(`title has ${facts.characters} characters, must be 1..60`);
}

if (facts.bytes < 1 || facts.bytes > 60) {
  fail(`title has ${facts.bytes} bytes, must be 1..60`);
}

mkdirSync(OUTPUT_DIR, { recursive: true });
const entryPath = join(OUTPUT_DIR, "entry.txt");
const content = facts.title + "\n";

writeFileSync(entryPath, content, "utf8");

const readBack = readFileSync(entryPath);
const expected = Buffer.from(content, "utf8");

if (!readBack.equals(expected)) {
  fail("read-back bytes do not match written bytes");
}

process.stdout.write(
  `path: ${entryPath}\n` +
    `title: ${facts.title}\n` +
    `characters: ${facts.characters}\n` +
    `bytes: ${facts.bytes}\n` +
    `words: ${facts.words}\n`
);
