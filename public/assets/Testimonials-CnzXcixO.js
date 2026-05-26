import {
    j as e
} from "./vendor-react-BfU3Zn2J.js";
import {
    ag as n,
    w as l,
    S as d,
    ah as c
} from "./vendor-icons-CqruUz7g.js";
const r = [{
        text: "Isotope helps me track test accuracy and preparation levels clearly. The streak feature is a huge motivator for daily consistency, and the AI overview constantly pushes me to stay on track. Perfectly designed for maintaining daily targets.",
        name: "Disha (DishTV)",
        rank: "NEET 2026",
        color: "from-orange-400 to-red-500",
        isShortened: !0
    }, {
        text: "It was 90% of my success. I used to get motivated due to the time I studied a day and it gave me fuel for the next day. It has like such a good ui.",
        name: "u/MovieImpressive8549",
        rank: "BITSAT 2025: 3XX marks",
        color: "from-teal-400 to-emerald-500"
    }, {
        text: "Goated tool for tracking productivity. The test charts and clear-cut stats are incredibly useful for any aspirant looking to improve their performance with real data.",
        name: "Sanidhya (ZenitsuAckerman)",
        rank: "JEE & BITSAT 2026",
        color: "from-emerald-400 to-green-500",
        isShortened: !0
    }, {
        text: "Finally a tool that makes study tracking crystal clear. The subject-wise analytics show exactly where you're messing up, and the focus timer is clutch for staying locked in. The progress graphs make prep feel real and push you to improve daily.",
        name: "Samarth (lemniscate)",
        rank: "JEE 2026",
        color: "from-brand-400 to-pink-500",
        isShortened: !0
    }, {
        text: "Found Isotope late during my prep. Tho it helped in managing and tracking the syllabus. Also the community was really great and fun.",
        name: "Anshul",
        rank: "NEET 2024: 655 marks",
        color: "from-yellow-400 to-orange-500"
    }, {
        text: "The great UI, and seeing the analytics at the end of the day with such good UI, aur padhne ka man karta tha. Thanks",
        name: "Ayush",
        rank: "JEE 2025: MNIT Allahabad",
        color: "from-brand-400 to-brand-500"
    }, {
        text: "I love isotope very much . Thanks for making it. ❤️🩷🧡💛💚💙🩵💜",
        name: "Shrey",
        rank: "JEE 2027",
        color: "from-violet-400 to-indigo-500"
    }, {
        text: "man thanks a LOTTT. U might never realize how much u helped me in my drop year. Best website for productivity that has ever existed, I have many others like ypt, regain etc. They all were shitty as hell",
        name: "u/DotRich4099",
        rank: "Aspirant",
        color: "from-blue-400 to-cyan-500"
    }, {
        text: "Love ur app's design bro",
        name: "u/Dizzy-Attitude-8174",
        rank: "Aspirant",
        color: "from-purple-400 to-pink-500"
    }, {
        text: "BRO HONESTLY THANKS FOR PROVIDING THE WEBSITE BIG W FOR U DUDE THANKS ❤️❤️",
        name: "u/Own-Catch-1268",
        rank: "Aspirant",
        color: "from-orange-400 to-red-500"
    }, {
        text: "thanks bhai loveyou. amazing site.",
        name: "u/IllustriousWeight862",
        rank: "Aspirant",
        color: "from-green-400 to-teal-500"
    }, {
        text: "isotopeai is freaking insane crazy good app. holy shit this shit is so peak bro",
        name: "u/Top_Search1980",
        rank: "Aspirant",
        color: "from-orange-500 to-amber-600"
    }],
    s = ({
        review: t
    }) => e.jsxs("div", {
        className: "w-[350px] md:w-[400px] p-8 rounded-3xl dark:bg-[#0c0c0e] bg-white border border-zinc-100 dark:border-white/5 flex-shrink-0 mx-4 relative group hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors",
        children: [e.jsx("div", {
            className: "absolute top-8 right-8 opacity-20 group-hover:opacity-40 transition-opacity",
            children: e.jsx(n, {
                className: "w-8 h-8 dark:text-white text-black"
            })
        }), e.jsx("div", {
            className: "flex gap-1 mb-6",
            children: [...Array(5)].map((a, i) => e.jsx(l, {
                className: "w-4 h-4 fill-yellow-500 text-yellow-500"
            }, i))
        }), e.jsxs("p", {
            className: "text-lg font-medium dark:text-zinc-300 text-zinc-700 leading-relaxed mb-6 relative z-10",
            children: ['"', t.text, '"']
        }), t.isShortened && e.jsxs("div", {
            className: "flex items-center gap-1.5 mb-8",
            children: [e.jsx(d, {
                className: "w-3.5 h-3.5 text-brand-500"
            }), e.jsx("span", {
                className: "text-[10px] font-bold uppercase tracking-wider text-brand-500/80",
                children: "Shortened with AI"
            })]
        }), e.jsxs("div", {
            className: "flex items-center gap-4",
            children: [e.jsx("div", {
                className: `w-12 h-12 rounded-full bg-gradient-to-br ${t.color} p-[2px]`,
                children: e.jsx("div", {
                    className: "w-full h-full rounded-full bg-white dark:bg-zinc-900 flex items-center justify-center font-bold text-lg",
                    children: t.name.charAt(0)
                })
            }), e.jsxs("div", {
                children: [e.jsxs("div", {
                    className: "font-bold dark:text-white text-black flex items-center gap-2",
                    children: [t.name, e.jsx(c, {
                        className: "w-4 h-4 text-brand-500 fill-brand-500/20"
                    })]
                }), e.jsx("div", {
                    className: "text-xs font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400",
                    children: t.rank
                })]
            })]
        })]
    }),
    o = ({
        children: t,
        direction: a = "left"
    }) => e.jsx("div", {
        className: "flex overflow-hidden py-4 relative z-10",
        children: e.jsxs("div", {
            className: `flex flex-shrink-0 will-change-transform ${a==="left"?"animate-marquee-left":"animate-marquee-right"} hover:[animation-play-state:paused]`,
            children: [t, t]
        })
    }),
    x = () => e.jsxs("section", {
        className: "py-32 dark:bg-black bg-white border-t dark:border-white/5 border-black/5 relative overflow-hidden",
        children: [e.jsx("div", {
            className: "absolute inset-0 bg-gradient-to-b from-transparent via-zinc-50/50 dark:via-zinc-900/10 to-transparent pointer-events-none"
        }), e.jsxs("div", {
            className: "container mx-auto px-6 text-center mb-20 relative z-10",
            children: [e.jsx("h2", {
                className: "text-4xl md:text-6xl font-display font-bold dark:text-white text-black mb-6",
                children: "Real Students. Real Talk."
            }), e.jsx("p", {
                className: "text-lg text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto",
                children: "Join 6,000+ logged in users who have replaced their fragmented tools with the Isotope ecosystem."
            })]
        }), e.jsxs("div", {
            className: "relative",
            children: [e.jsx("div", {
                className: "absolute left-0 top-0 bottom-0 w-20 md:w-40 bg-gradient-to-r from-white dark:from-black to-transparent z-20"
            }), e.jsx("div", {
                className: "absolute right-0 top-0 bottom-0 w-20 md:w-40 bg-gradient-to-l from-white dark:from-black to-transparent z-20"
            }), e.jsxs("div", {
                className: "space-y-8 hover:pause",
                children: [e.jsx(o, {
                    direction: "left",
                    children: r.map((t, a) => e.jsx(s, {
                        review: t
                    }, a))
                }), e.jsx(o, {
                    direction: "right",
                    children: r.slice().reverse().map((t, a) => e.jsx(s, {
                        review: t
                    }, a))
                })]
            })]
        })]
    });
export {
    x as
    default
};