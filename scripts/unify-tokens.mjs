import fs from "fs";
import path from "path";

const root = path.resolve("src/app");

const replacements = [
  [/hover:bg-\[#d94725\]/g, "hover:opacity-90"],
  [/hover:bg-\[#d94727\]/g, "hover:opacity-90"],
  [/hover:text-\[#ed542f\]/g, "hover:text-molim-orange"],
  [/hover:border-\[#ed542f\]/g, "hover:border-molim-orange"],
  [/focus:border-\[#ed542f\]/g, "focus:border-molim-orange"],
  [/focus:ring-\[#ed542f\]\/10/g, "focus:ring-molim-orange/10"],
  [/bg-\[#ed542f\]\/10/g, "bg-molim-orange/10"],
  [/bg-\[#ed542f\]\/5/g, "bg-molim-orange/5"],
  [/border-\[#ed542f\]\/10/g, "border-molim-orange/10"],
  [/border-\[#ed542f\]\/20/g, "border-molim-orange/20"],
  [/border-\[#ed542f\]/g, "border-molim-orange"],
  [/bg-\[#ed542f\]/g, "bg-molim-orange"],
  [/text-\[#ed542f\]/g, "text-molim-orange"],
  [/border-\[#202124\]\/10/g, "border-molim"],
  [/text-\[#202124\]/g, "text-[var(--foreground)]"],
  [/text-\[#202020\]/g, "text-[var(--foreground)]"],
  [/bg-\[#f2f0eb\]/g, "bg-molim"],
  [/bg-\[#f8f6f2\]/g, "bg-molim"],
  [/bg-\[#f7f8fa\]/g, "bg-molim"],
  [/bg-\[#faf9f6\]/g, "bg-molim-soft"],
  [/bg-\[#f3f1ec\]/g, "bg-molim-soft"],
  [/placeholder:text-gray-400/g, "placeholder:text-molim-muted"],
  [/text-gray-950/g, "text-[var(--foreground)]"],
  [/text-gray-900/g, "text-[var(--foreground)]"],
  [/text-gray-800/g, "text-[var(--foreground)]"],
  [/text-gray-700/g, "text-[var(--foreground)]"],
  [/text-gray-600/g, "text-molim-muted"],
  [/text-gray-500/g, "text-molim-muted"],
  [/text-gray-400/g, "text-molim-muted"],
  [/border-gray-300/g, "border-molim"],
  [/border-gray-200/g, "border-molim"],
  [/border-b bg-gray-50/g, "border-b border-molim bg-molim-soft"],
  [/bg-gray-50/g, "bg-molim-soft"],
  [/bg-gray-100/g, "bg-molim-soft"],
  [/hover:bg-gray-200/g, "hover:bg-molim-soft"],
  [/hover:bg-gray-50/g, "hover:bg-molim-soft"],
  [/rounded-2xl bg-white/g, "molim-card"],
  [/rounded-xl bg-white/g, "molim-card"],
  [/rounded-2xl border border-orange-100 bg-orange-50/g, "molim-card border-molim-orange bg-molim-soft"],
  [/border-orange-200 bg-orange-50 text-orange-700/g, "border-molim-orange bg-molim-soft text-molim-orange"],
  [/rounded-full bg-orange-100/g, "bg-molim-orange/10"],
  [/bg-white\/95/g, "bg-molim-surface/95"],
  [/(?<![-\w])bg-white(?![-\w])/g, "bg-molim-surface"],
];

function walk(dir) {
  for (const entry of fs.readdirSync(root ? dir : dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "components" || entry.name === "lib" || entry.name === "api") continue;
      walk(full);
    } else if (entry.name === "page.tsx") {
      let text = fs.readFileSync(full, "utf8");
      const original = text;
      for (const [from, to] of replacements) {
        text = text.replace(from, to);
      }
      if (text !== original) {
        fs.writeFileSync(full, text);
        console.log("updated", path.relative(root, full));
      }
    }
  }
}

walk(root);
