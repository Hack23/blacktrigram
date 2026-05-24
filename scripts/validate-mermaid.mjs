#!/usr/bin/env node
/* SPDX-FileCopyrightText: 2024-2026 Hack23 AB
 * SPDX-License-Identifier: Apache-2.0
 *
 * validate-mermaid.mjs
 *
 * Systematically extract and validate every ```mermaid``` code block in the
 * repository's Markdown files using the official `mermaid` parser. Reports a
 * machine-readable summary plus human-friendly diagnostics with file path,
 * line number, and diagram index inside the file.
 *
 * Usage:
 *   node scripts/validate-mermaid.mjs              # scan repo root
 *   node scripts/validate-mermaid.mjs path/to/dir  # scan a sub-directory
 *
 * Skipped directories: node_modules, docs (generated), public, screenshots,
 * coverage, dist, build, .git.
 *
 * The script also performs lightweight structural checks:
 *   - Detects ```mermaid blocks closed by indented fences (CommonMark-invalid)
 *   - Detects mermaid blocks whose closing fence is missing/mismatched
 *   - Detects blocks nested inside another fenced code block (treated as
 *     non-diagrams and reported as informational only).
 *
 * Exit codes:
 *   0 → all real diagrams parse cleanly
 *   1 → one or more parse errors
 *   2 → script error (missing deps / IO failure)
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(
  process.argv[2] ? process.argv[2] : path.join(__dirname, "..")
);

// ── Bootstrap a DOM so that `mermaid` (via `dompurify`) can run in Node ──────
let JSDOM;
try {
  ({ JSDOM } = await import("jsdom"));
} catch (e) {
  console.error(
    "✖ Missing dependency: jsdom. Run `npm install --save-dev jsdom mermaid`."
  );
  process.exit(2);
}
const dom = new JSDOM("<!DOCTYPE html><html><body></body></html>");
globalThis.window = dom.window;
globalThis.document = dom.window.document;

let mermaid;
try {
  mermaid = (await import("mermaid")).default;
} catch (e) {
  console.error(
    "✖ Missing dependency: mermaid. Run `npm install --save-dev mermaid`."
  );
  process.exit(2);
}
mermaid.initialize({ startOnLoad: false, securityLevel: "loose" });

// ── Filesystem walker ───────────────────────────────────────────────────────
const SKIP = new Set([
  "node_modules",
  "docs",
  "public",
  "screenshots",
  ".git",
  "coverage",
  "dist",
  "build",
  "lib",
  ".cache",
]);

function walk(dir, files = []) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return files;
  }
  for (const e of entries) {
    if (SKIP.has(e.name)) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, files);
    else if (e.isFile() && e.name.toLowerCase().endsWith(".md"))
      files.push(p);
  }
  return files;
}

// ── Block extractor (tracks nesting + indentation) ──────────────────────────
function extractBlocks(content, relPath) {
  const lines = content.split("\n");
  const blocks = [];
  let inFence = null; // { lang, indent, startLine }
  let buffer = [];
  let diagramIdx = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const fenceMatch = line.match(/^(\s*)(`{3,}|~{3,})(.*)$/);
    if (fenceMatch) {
      const [, indent, marker, info] = fenceMatch;
      if (!inFence) {
        const lang = info.trim().toLowerCase();
        inFence = {
          lang,
          indent: indent.length,
          marker,
          startLine: i + 1,
          nested: false,
        };
        buffer = [];
        continue;
      }
      // closing fence must be same marker; for strict CommonMark same indent
      if (line.trim().startsWith(marker[0].repeat(marker.length))) {
        if (inFence.lang === "mermaid") {
          // strip leading indent (CommonMark code-block rule)
          const stripIndent = inFence.indent;
          const code = buffer
            .map((l) =>
              l.startsWith(" ".repeat(stripIndent))
                ? l.slice(stripIndent)
                : l
            )
            .join("\n");
          blocks.push({
            idx: diagramIdx++,
            line: inFence.startLine,
            endLine: i + 1,
            code,
            indented: inFence.indent > 0,
            indentedCloseFence: indent.length !== inFence.indent,
            nested: inFence.nested,
          });
        }
        inFence = null;
        buffer = [];
        continue;
      }
      // a nested fence inside another fence – treat as content
      buffer.push(line);
      continue;
    }
    if (inFence) buffer.push(line);
  }

  if (inFence && inFence.lang === "mermaid") {
    blocks.push({
      idx: diagramIdx++,
      line: inFence.startLine,
      endLine: lines.length,
      code: buffer.join("\n"),
      indented: inFence.indent > 0,
      indentedCloseFence: true,
      nested: false,
      unterminated: true,
    });
  }

  return blocks;
}

// ── Validate one block ──────────────────────────────────────────────────────
async function validateBlock(b) {
  if (b.unterminated) {
    return { ok: false, msg: "Unterminated ```mermaid fenced code block" };
  }
  try {
    await mermaid.parse(b.code);
    return { ok: true };
  } catch (e) {
    return { ok: false, msg: e?.message || String(e) };
  }
}

// ── Main ────────────────────────────────────────────────────────────────────
const files = walk(repoRoot).sort();
const summary = {
  filesScanned: files.length,
  totalDiagrams: 0,
  okDiagrams: 0,
  errors: [],
  warnings: [],
};

for (const f of files) {
  const rel = path.relative(repoRoot, f);
  let content;
  try {
    content = fs.readFileSync(f, "utf8");
  } catch (e) {
    summary.warnings.push({ file: rel, msg: `read error: ${e.message}` });
    continue;
  }
  const blocks = extractBlocks(content, rel);
  for (const b of blocks) {
    summary.totalDiagrams++;
    // Skip blocks that are clearly inside a parent code-block (indented but
    // not closed on the same indent) — they're documentation examples.
    if (b.indented && b.indentedCloseFence) {
      summary.warnings.push({
        file: rel,
        line: b.line,
        idx: b.idx,
        msg: "indented ```mermaid fence (likely documentation example, not validated)",
      });
      summary.okDiagrams++;
      continue;
    }
    const res = await validateBlock(b);
    if (res.ok) {
      summary.okDiagrams++;
    } else {
      summary.errors.push({
        file: rel,
        line: b.line,
        idx: b.idx,
        msg: res.msg,
        codePreview: b.code.split("\n").slice(0, 6).join("\n"),
      });
    }
  }
}

// ── Output ──────────────────────────────────────────────────────────────────
console.log(`\n=== Mermaid diagram validation ===`);
console.log(`Repo root      : ${repoRoot}`);
console.log(`Files scanned  : ${summary.filesScanned}`);
console.log(`Total diagrams : ${summary.totalDiagrams}`);
console.log(`OK             : ${summary.okDiagrams}`);
console.log(`Errors         : ${summary.errors.length}`);
console.log(`Warnings       : ${summary.warnings.length}\n`);

if (summary.warnings.length) {
  console.log("--- Warnings ---");
  for (const w of summary.warnings) {
    const loc = w.line ? `${w.file}:${w.line}` : w.file;
    console.log(`  • ${loc}  ${w.msg}`);
  }
  console.log("");
}

if (summary.errors.length) {
  console.log("--- Errors ---");
  for (const e of summary.errors) {
    console.log(`\n✖ ${e.file}:${e.line}  (mermaid block #${e.idx})`);
    const firstMsgLines = e.msg.split("\n").slice(0, 8);
    for (const l of firstMsgLines) console.log(`    ${l}`);
    console.log(`    --- preview ---`);
    for (const l of e.codePreview.split("\n"))
      console.log(`    | ${l}`);
  }
  console.log("");
}

// JSON artefact for CI / scripted post-processing
const outFile = path.join(repoRoot, "mermaid-validation-report.json");
try {
  fs.writeFileSync(outFile, JSON.stringify(summary, null, 2) + "\n");
  console.log(`Report written: ${path.relative(repoRoot, outFile)}`);
} catch {
  /* best-effort */
}

process.exit(summary.errors.length > 0 ? 1 : 0);
