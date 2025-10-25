#!/usr/bin/env node

import { spawn } from "child_process";

// Run nuxt build and filter out CSS @property warnings
const build = spawn("npx", ["nuxt", "build"], {
    stdio: ["inherit", "pipe", "pipe"],
    shell: true,
});

let skipWarnings = false;
let emptyLineCount = 0;

function processLine(line) {
    // Start skipping when we see the warning header
    if (line.includes("Found") && line.includes("warnings while optimizing generated CSS")) {
        skipWarnings = true;
        emptyLineCount = 0;
        return;
    }

    // If we're in skip mode
    if (skipWarnings) {
        // Count empty lines - warnings usually end after several empty lines or when real output appears
        if (!line.trim()) {
            emptyLineCount++;
            if (emptyLineCount >= 3) {
                // After multiple empty lines, assume warnings are done
                skipWarnings = false;
                emptyLineCount = 0;
            }
            return;
        }

        // Check if we've reached the end of warnings (actual build output)
        if (
            line.includes("✓") ||
            line.includes("modules transformed") ||
            line.includes("Building server") ||
            line.includes("WARN") ||
            line.includes(".output/") ||
            line.includes("Client built") ||
            line.includes("Server built")
        ) {
            skipWarnings = false;
            emptyLineCount = 0;
            console.log(line);
            return;
        }

        // Skip warning content (Issue #, │, ┆, etc.)
        return;
    }

    // Normal output
    console.log(line);
}

build.stdout.on("data", (data) => {
    const lines = data.toString().split("\n");
    lines.forEach((line) => processLine(line));
});

build.stderr.on("data", (data) => {
    const str = data.toString();
    // Filter out lines containing "@property" warnings
    if (!str.includes("Unknown at rule: @property")) {
        process.stderr.write(str);
    }
});

build.on("close", (code) => {
    process.exit(code);
});
