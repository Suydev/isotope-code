const c = "#3b82f6";

function i(t) {
    return t.startsWith("#") || t.startsWith("rgb") || t.startsWith("hsl") || t.startsWith("oklch") || t.startsWith("color(")
}

function d(t) {
    const r = t.match(/^(?:text|bg)-\[(.+)\](?:\/[0-9.]+)?$/);
    return r && i(r[1]) ? r[1] : t.match(/#(?:[A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})\b/) ?.[0] ?? null
}
const g = {
        "text-brand-500": "#3b82f6",
        "text-brand-400": "#60a5fa",
        "text-brand-600": "#2563eb",
        "text-zinc-500": "#71717a",
        "text-zinc-400": "#a1a1aa",
        "text-zinc-600": "#52525b",
        "text-amber-500": "#f59e0b",
        "text-amber-400": "#fbbf24",
        "text-amber-600": "#d97706",
        "text-orange-400": "#fb923c",
        "text-orange-500": "#f97316",
        "text-orange-600": "#ea580c",
        "text-emerald-500": "#10b981",
        "text-emerald-400": "#34d399",
        "text-emerald-600": "#059669",
        "text-green-400": "#4ade80",
        "text-green-500": "#22c55e",
        "text-green-600": "#16a34a",
        "text-cyan-500": "#06b6d4",
        "text-cyan-400": "#22d3ee",
        "text-cyan-600": "#0891b2",
        "text-rose-500": "#f43f5e",
        "text-rose-400": "#fb7185",
        "text-rose-600": "#e11d48",
        "text-indigo-500": "#6366f1",
        "text-indigo-400": "#818cf8",
        "text-indigo-600": "#4f46e5",
        "text-blue-500": "#3b82f6",
        "text-blue-400": "#60a5fa",
        "text-blue-600": "#2563eb",
        "text-red-500": "#ef4444",
        "text-red-400": "#f87171",
        "text-red-600": "#dc2626",
        "text-purple-500": "#a855f7",
        "text-purple-400": "#c084fc",
        "text-purple-600": "#9333ea",
        "text-gray-500": "#6b7280",
        "text-gray-400": "#9ca3af",
        "text-gray-600": "#4b5563",
        "text-lime-500": "#84cc16",
        "text-lime-400": "#a3e635",
        "text-lime-600": "#65a30d",
        "text-yellow-500": "#eab308",
        "text-yellow-400": "#facc15",
        "text-yellow-600": "#ca8a04",
        "text-teal-500": "#14b8a6",
        "text-teal-400": "#2dd4bf",
        "text-teal-600": "#0d9488",
        "text-sky-500": "#0ea5e9",
        "text-sky-400": "#38bdf8",
        "text-sky-600": "#0284c7",
        "text-violet-500": "#8b5cf6",
        "text-violet-400": "#a78bfa",
        "text-violet-600": "#7c3aed",
        "text-fuchsia-500": "#d946ef",
        "text-fuchsia-400": "#e879f9",
        "text-fuchsia-600": "#c026d3",
        "text-pink-500": "#ec4899",
        "text-pink-400": "#f472b6",
        "text-pink-600": "#db2777"
    },
    p = {
        "text-brand-500": "#60a5fa",
        "text-brand-400": "#93c5fd",
        "text-brand-600": "#3b82f6",
        "text-zinc-500": "#a1a1aa",
        "text-zinc-400": "#d4d4d8",
        "text-zinc-600": "#71717a",
        "text-amber-500": "#fbbf24",
        "text-amber-400": "#fcd34d",
        "text-amber-600": "#f59e0b",
        "text-orange-400": "#fdba74",
        "text-orange-500": "#fb923c",
        "text-orange-600": "#f97316",
        "text-emerald-500": "#34d399",
        "text-emerald-400": "#6ee7b7",
        "text-emerald-600": "#10b981",
        "text-green-400": "#86efac",
        "text-green-500": "#4ade80",
        "text-green-600": "#22c55e",
        "text-cyan-500": "#22d3ee",
        "text-cyan-400": "#67e8f9",
        "text-cyan-600": "#06b6d4",
        "text-rose-500": "#fb7185",
        "text-rose-400": "#fda4af",
        "text-rose-600": "#f43f5e",
        "text-indigo-500": "#818cf8",
        "text-indigo-400": "#a5b4fc",
        "text-indigo-600": "#6366f1",
        "text-blue-500": "#60a5fa",
        "text-blue-400": "#93c5fd",
        "text-blue-600": "#3b82f6",
        "text-red-500": "#f87171",
        "text-red-400": "#fca5a5",
        "text-red-600": "#ef4444",
        "text-purple-500": "#c084fc",
        "text-purple-400": "#d8b4fe",
        "text-purple-600": "#a855f7",
        "text-gray-500": "#9ca3af",
        "text-gray-400": "#d1d5db",
        "text-gray-600": "#6b7280",
        "text-lime-500": "#a3e635",
        "text-lime-400": "#bef264",
        "text-lime-600": "#84cc16",
        "text-yellow-500": "#facc15",
        "text-yellow-400": "#fde047",
        "text-yellow-600": "#eab308",
        "text-teal-500": "#2dd4bf",
        "text-teal-400": "#5eead4",
        "text-teal-600": "#14b8a6",
        "text-sky-500": "#38bdf8",
        "text-sky-400": "#7dd3fc",
        "text-sky-600": "#0ea5e9",
        "text-violet-500": "#a78bfa",
        "text-violet-400": "#c4b5fd",
        "text-violet-600": "#8b5cf6",
        "text-fuchsia-500": "#e879f9",
        "text-fuchsia-400": "#f0abfc",
        "text-fuchsia-600": "#d946ef",
        "text-pink-500": "#f472b6",
        "text-pink-400": "#f9a8d4",
        "text-pink-600": "#ec4899"
    };

function l(t, r = !1) {
    if (!t) return null;
    if (i(t)) return t;
    const e = d(t);
    if (e) return e;
    const a = r ? p : g;
    if (a[t]) return a[t];
    const n = t.replace(/^(text-|bg-)/, "");
    if (a[`text-${n}`]) return a[`text-${n}`];
    const x = n.replace(/-\d{3}$/, "-500");
    return a[`text-${x}`] ? a[`text-${x}`] : null
}

function $(t, r = !1) {
    return l(t, r) || c
}

function b(t, r) {
    const e = t.replace("#", "");
    if (/^[A-Fa-f0-9]{3}$/.test(e)) {
        const [a, n, x] = e.split("").map(f => parseInt(`${f}${f}`, 16));
        return `rgba(${a}, ${n}, ${x}, ${r})`
    }
    if (/^[A-Fa-f0-9]{6}$/.test(e)) {
        const a = parseInt(e.substring(0, 2), 16),
            n = parseInt(e.substring(2, 4), 16),
            x = parseInt(e.substring(4, 6), 16);
        return `rgba(${a}, ${n}, ${x}, ${r})`
    }
    return `color-mix(in srgb, ${t} ${Math.round(r*100)}%, transparent)`
}

function s(t, r = !1) {
    if (!t) return null;
    const e = t.match(/\/(\d{1,3})$/),
        a = t.replace(/\/\d{1,3}$/, ""),
        n = l(`text-${a}`, r) ?? (i(a) ? a : null);
    return n ? e ? b(n, Math.min(Number(e[1]), 100) / 100) : n : null
}

function m(t) {
    return `linear-gradient(135deg, ${t}, ${b(t,.8)})`
}

function y(t, r = "to right", e = !1) {
    if (!t) return `linear-gradient(${r}, ${c}, ${c})`;
    if (t.startsWith("linear-gradient(")) return t;
    const a = t.split(/\s+/),
        n = a.find(o => o.startsWith("from-")) ?.replace(/^from-/, ""),
        x = a.find(o => o.startsWith("to-")) ?.replace(/^to-/, ""),
        f = s(n, e) || c,
        u = s(x, e) || f;
    return `linear-gradient(${r}, ${f}, ${u})`
}

function h(t, r = 15) {
    const e = t.replace("#", ""),
        a = parseInt(e.substring(0, 2), 16),
        n = parseInt(e.substring(2, 4), 16),
        x = parseInt(e.substring(4, 6), 16);
    return `rgba(${a}, ${n}, ${x}, ${r/100})`
}

function k(t) {
    if (!t) return {
        type: "fallback",
        value: "BookOpen"
    };
    if (/[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u.test(t) || t.length <= 2 && !/^[a-zA-Z]+$/.test(t)) return {
        type: "emoji",
        value: t
    };
    const e = ["BookOpen", "Calculator", "FlaskConical", "Globe", "Palette", "Music", "Camera", "Code", "Cpu", "Database", "FileText", "GraduationCap", "History", "Languages", "Leaf", "Microscope", "Pencil", "Scale", "Sparkles", "Target", "TestTube", "Triangle", "Waves", "Zap", "Brain", "Compass", "Geometry", "Lightbulb", "Molecule", "Scroll", "Atom", "Dna", "Sigma"];
    if (e.includes(t)) return {
        type: "lucide",
        value: t
    };
    const a = e.find(n => n.toLowerCase() === t.toLowerCase());
    return a ? {
        type: "lucide",
        value: a
    } : {
        type: "fallback",
        value: "BookOpen"
    }
}
export {
    c as D, $ as a, m as b, h as c, y as d, k as g, l as t
};