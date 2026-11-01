import assert from "node:assert/strict";
import { test } from "node:test";
import { normalizePost, parseFrontMatter } from "./generate-posts-json.mjs";

test("preserves TinaCMS multiline summaries, metadata, and article body", () => {
  const post = normalizePost(`---
title: Is a Life Coach Worth It?
slug: life-coaching-worth-it
summary: |-
  How much should you pay for life coaching?

  Value vs Price - the price is not always the benefit.
author: Guy David Haik
publishedAt: 2026-09-05T00:00:00.000Z
tags:
  - coaching
  - cat-personal-development
draft: false
---

Article body.
`, "is-a-life-coach-worth-it.md");
  assert.equal(post.summary, "How much should you pay for life coaching?\n\nValue vs Price - the price is not always the benefit.");
  assert.equal(post.slug, "life-coaching-worth-it");
  assert.equal(post.author, "Guy David Haik");
  assert.equal(post.publishedAt, "2026-09-05T00:00:00.000Z");
  assert.deepEqual(post.tags, ["coaching", "cat-personal-development"]);
  assert.equal(post.draft, false);
  assert.equal(post.body, "Article body.");
});

test("supports folded, quoted, and plain YAML summaries", () => {
  for (const [yaml, expected] of [
    [">-\n  First line\n  continues here.", "First line continues here."],
    ['"A summary with \\"quotes\\" and a colon: yes."', 'A summary with "quotes" and a colon: yes.'],
    ["'It''s a summary.'", "It's a summary."],
    ["A simple summary.", "A simple summary."],
  ]) {
    assert.equal(parseFrontMatter(`---\nsummary: ${yaml}\n---\nBody`).data.summary, expected);
  }
});

test("handles Windows newlines and markdown without front matter", () => {
  assert.equal(parseFrontMatter("---\r\nsummary: |-\r\n  A summary.\r\n---\r\nBody").data.summary, "A summary.");
  assert.deepEqual(parseFrontMatter("Just an article.\n"), { data: {}, body: "Just an article." });
});
