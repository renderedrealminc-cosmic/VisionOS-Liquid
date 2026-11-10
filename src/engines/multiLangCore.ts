export const FIREBASE_DB_URL = "https://visionos-91949-default-rtdb.asia-southeast1.firebasedatabase.app";

export interface TvAppItem {
  id: string;
  name: string;
  category: string;
  iconName: string;
  badge: string;
  color: string;
}

export const INITIAL_TV_APPS: TvAppItem[] = [
  { id: "yt", name: "YouTube 4K", category: "Media", iconName: "Youtube", badge: "NATIVE", color: "from-red-500/40 to-rose-900/40" },
  { id: "worm", name: "Ultimate Worms", category: "Game", iconName: "Gamepad2", badge: ".VAB RUST", color: "from-cyan-500/40 to-blue-900/40" },
  { id: "mc", name: "Realms Animator", category: "Studio", iconName: "Box", badge: "C++ GL", color: "from-emerald-500/40 to-teal-900/40" },
  { id: "py", name: "Python Debloater", category: "System", iconName: "Terminal", badge: ".PY CORE", color: "from-amber-500/40 to-orange-900/40" },
  { id: "webx", name: "Liquid Browser", category: "Web", iconName: "Globe", badge: ".WEBX", color: "from-purple-500/40 to-indigo-900/40" },
  { id: "cloud", name: "Cosmic Hub", category: "Cloud", iconName: "Cloud", badge: "FIREBASE", color: "from-sky-500/40 to-cyan-900/40" }
];

export const ENGINE_STACK = [
  { lang: "Rust", role: "Zero-Lag Memory & .VAB Runner", status: "ACTIVE" },
  { lang: "C++", role: "60FPS Liquid Shader Pipeline", status: "ACTIVE" },
  { lang: "Python", role: "Google TV Ad & Bloat Cleaner", status: "ACTIVE" },
  { lang: "Kotlin/Java", role: "TV D-Pad & Native Intent Bridge", status: "ACTIVE" },
  { lang: "Ruby", role: "Dynamic Theme & Palette Script", status: "ACTIVE" }
];
