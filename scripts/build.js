#!/usr/bin/env node
/*
Regenerates the minified bundles from the single source of truth
(login.dev.js) so they can't silently drift apart again.

Usage:
  node scripts/build.js         # write the bundles
  node scripts/build.js --check # exit 1 if the bundles are out of date (for CI)
*/
const fs = require("fs");
const path = require("path");
const { minify } = require("terser");

const ROOT = path.join(__dirname, "..");
const SRC = path.join(ROOT, "login.dev.js");
const TARGETS = [
    path.join(ROOT, "v1", "login.js"),
    path.join(ROOT, "v1", "insign", "client.js"),
];

const HEADER = `/*
Sign in with Intastellar
Author: Intastellar Solutions
Version: 1.5.0
https://www.intastellarsolutions.com

This script allows you to add a sign in with Intastellar button to your website.
Copyright (c) 2024 Intastellar Solutions, International
*/
`;

async function build() {
    const source = fs.readFileSync(SRC, "utf8");
    // Strip the header comment before minifying; a canonical copy is
    // re-added below so every shipped bundle carries the same license
    // header verbatim.
    const body = source.replace(/^\/\*[\s\S]*?\*\/\s*/, "");

    const result = await minify(body, {
        compress: true,
        mangle: true,
        format: { comments: false },
    });

    if (result.error) {
        throw result.error;
    }

    const output = HEADER + result.code;
    const check = process.argv.includes("--check");
    let drift = false;

    for (const target of TARGETS) {
        const existing = fs.existsSync(target) ? fs.readFileSync(target, "utf8") : null;
        if (check) {
            if (existing !== output) {
                drift = true;
                console.error(`Out of date: ${path.relative(ROOT, target)} does not match login.dev.js. Run \`npm run build\`.`);
            }
            continue;
        }
        fs.writeFileSync(target, output);
        console.log(`Wrote ${path.relative(ROOT, target)}`);
    }

    if (check && drift) {
        process.exitCode = 1;
    }
}

build().catch((err) => {
    console.error(err);
    process.exitCode = 1;
});
