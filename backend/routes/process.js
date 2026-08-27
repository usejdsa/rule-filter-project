const express = require("express");
const router = express.Router();
const db = require("../db/connection");

function isBoundary(char) {
  return !char || !/[a-zA-Z0-9]/.test(char);
}

function findMatches(text, rule) {
  const matches = [];
  const lowerText = text.toLowerCase();
  const keyword = (rule.keyword || "").toLowerCase();
  if (!keyword) return matches;

  let searchFrom = 0;
  while (true) {
    const index = lowerText.indexOf(keyword, searchFrom);
    if (index === -1) break;

    const before = text[index - 1];
    const after = text[index + keyword.length];
    const startsAWord = isBoundary(before);
    const endsAWord = isBoundary(after);

    let isMatch = false;
    if (rule.match_type === "exact") {
      isMatch = startsAWord && endsAWord;

    } else if (rule.match_type === "startsWith") {
      isMatch = startsAWord;
    
    } else {
      isMatch = true;
    }
     if (isMatch) {
      matches.push({ start: index, end: index + keyword.length });
    }

    searchFrom = index + keyword.length;
  }

  return matches;
}


function renderMatch(matchedText, rule) {
  if (rule.action_type === "tooltip") {
    const label = rule.tag || "";
    return `<span class="tag-match" title="${label}">${matchedText}${
      label ? ` <sup>[${label}]</sup>` : ""
    }</span>`;
  }

  const color = rule.color || "#ffff00";
  return `<span class="highlight-match" style="background-color:${color}">${matchedText}</span>`;
}


router.post("/", (req, res) => {
  const { text } = req.body;

  if (typeof text !== "string" || !text.length) {
    return res.status(400).json({ error: "text is required" });
  }

  db.query("SELECT * FROM rules", (err, rules) => {
    if (err) return res.status(500).json({ error: err.message });

    let spans = [];
    rules.forEach((rule) => {
      findMatches(text, rule).forEach((span) => {
        spans.push({ ...span, rule });
      });
    });

    spans.sort((a, b) => a.start - b.start || (b.end - b.start) - (a.end - a.start));
    const accepted = [];
    let lastEnd = -1;
    spans.forEach((span) => {
      if (span.start >= lastEnd) {
        accepted.push(span);
        lastEnd = span.end;
      }
    });

    let html = "";
    let cursor = 0;
    accepted.forEach((span) => {
      html += text.slice(cursor, span.start);
      html += renderMatch(text.slice(span.start, span.end), span.rule);
      cursor = span.end;
    });
    html += text.slice(cursor);

    res.json({ processedHtml: html, matchedCount: accepted.length });
  });
});

module.exports = router;
