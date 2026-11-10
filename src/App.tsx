import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home, Search, Grid, Layers, Cloud, Settings, Sparkles, ShieldCheck,
  Wifi, Bluetooth, Tv, RefreshCw, Gamepad2, Youtube, Box, Terminal,
  Globe, ArrowUp, ArrowDown, MoveHorizontal, Volume2
} from 'lucide-react';
import { FIREBASE_DB_URL, INITIAL_TV_APPS, ENGINE_STACK, TvAppItem } from './engines/multiLangCore';

const WALLPAPERS = [
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1920&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1920&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=1920&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1920&auto=format&fit=crop"
];

export default function App() {
  // 0 = Solid Black Boot, 1 = Lock Screen, 2 = Win12 Lounge Dock, 3 = Main Home OS
  const [screen, setScreen] = useState<number>(0);
  const [wpIndex, setWpIndex] = useState<number>(0);
  const [timeStr, setTimeStr] = useState<string>("08:30");
  const [dateStr, setDateStr] = useState<string>("Tuesday, November 10");

  const [apps, setApps] = useState<TvAppItem[]>(INITIAL_TV_APPS);
  const [dockApps, setDockApps] = useState<TvAppItem[]>(INITIAL_TV_APPS.slice(0, 5));
  const [recentApps, setRecentApps] = useState<TvAppItem[]>([INITIAL_TV_APPS[0], INITIAL_TV_APPS[1]]);
  const [movingDockIdx, setMovingDockIdx] = useState<number | null>(null);

  const [activeTab, setActiveTab] = useState<'home' | 'search' | 'apps' | 'recents' | 'cloud' | 'settings'>('home');
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [cloudStatus, setCloudStatus] = useState<string>("Synced • Asia-Southeast1");
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // 1. 2.8-Second Solid Black Boot ("VISION OS" + blurry "cosmic.inc")
  useEffect(() => {
    const bootTimer = setTimeout(() => {
      setScreen(1);
    }, 2800);
    return () => clearTimeout(bootTimer);
  }, []);

  // Live Clock & Auto-Changing Wallpaper
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
      setDateStr(now.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' }));
    };
    updateClock();
    const clockInt = setInterval(updateClock, 5000);
    const wpInt = setInterval(() => {
      setWpIndex((prev) => (prev + 1) % WALLPAPERS.length);
    }, 18000);
    return () => {
      clearInterval(clockInt);
      clearInterval(wpInt);
    };
  }, []);

  // TV Remote D-Pad Keyboard Listener (Volume Safe Guard Built-in)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.includes("AudioVolume") || e.key.includes("Volume")) return; // Volume Safe Guard

      if (screen === 1) {
        setScreen(2);
        return;
      }
      if (screen === 2 && e.key === "ArrowDown") {
        setScreen(3);
        return;
      }
      if (e.key === "Escape" || e.key === "Backspace") {
        if (screen === 3 && activeTab !== 'search') setScreen(2);
        else if (screen === 2) setScreen(1);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [screen, activeTab]);

  // Firebase Cloud Sync
  const syncFirebase = async () => {
    try {
      setCloudStatus("Syncing Cosmic Cloud...");
      const res = await fetch(`${FIREBASE_DB_URL}/visionos.json`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.apps) {
          const cloudList: TvAppItem[] = Object.values(data.apps).map((a: any, i: number) => ({
            id: a.id || `cloud_${i}`,
            name: a.name || "Cloud App",
            category: "Cloud",
            iconName: "Sparkles",
            badge: a.format || ".WEBX",
            color: "from-cyan-500/40 to-purple-900/40"
          }));
          setApps([...INITIAL_TV_APPS, ...cloudList]);
        }
        setCloudStatus("Online • visionos-91949");
        showToast("☁️ Cosmic Firebase Synced!");
      }
    } catch {
      setCloudStatus("Offline Vault Active");
    }
  };

  const handleDockAppClick = (idx: number, app: TvAppItem) => {
    if (movingDockIdx !== null) {
      const updated = [...dockApps];
      const temp = updated[movingDockIdx];
      updated[movingDockIdx] = updated[idx];
      updated[idx] = temp;
      setDockApps(updated);
      setMovingDockIdx(null);
      showToast(`⇄ Moved ${temp.name} in Windows 12 Dock!`);
    } else {
      setRecentApps((prev) => [app, ...prev.filter((a) => a.id !== app.id)]);
      showToast(`🚀 Launching ${app.name} (${app.badge})...`);
    }
  };

  const renderIcon = (name: string) => {
    switch (name) {
      case "Youtube": return <Youtube className="w-8 h-8 text-red-400" />;
      case "Gamepad2": return <Gamepad2 className="w-8 h-8 text-cyan-300" />;
      case "Box": return <Box className="w-8 h-8 text-emerald-300" />;
      case "Terminal": return <Terminal className="w-8 h-8 text-amber-300" />;
      case "Globe": return <Globe className="w-8 h-8 text-purple-300" />;
      default: return <Cloud className="w-8 h-8 text-sky-300" />;
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black select-none">
      {/* Dynamic Auto-Changing 4K Wallpaper for Screen 1, 2, 3 */}
      {screen > 0 && (
        <motion.div
          key={wpIndex}
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.4 }}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${WALLPAPERS[wpIndex]})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/50" />
        </motion.div>
      )}

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ y: -60, opacity: 0 }}
            animate={{ y: 20, opacity: 1 }}
            exit={{ y: -60, opacity: 0 }}
            className="fixed top-2 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-full liquid-glass text-sm font-medium text-cyan-200"
          >
            {toastMsg}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {/* ===============================================================
            SCREEN 0: SOLID BLACK BOOT ("VISION OS" + blurry "cosmic.inc")
           =============================================================== */}
        {screen === 0 && (
          <motion.div
            key="boot"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black flex flex-col items-center justify-center z-50"
          >
            <motion.h1
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.9 }}
              className="text-6xl md:text-7xl font-black tracking-[0.28em] text-white"
            >
              VISION OS
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.55 }}
              transition={{ delay: 0.45, duration: 1 }}
              className="mt-4 text-sm tracking-[0.45em] lowercase text-white/70 blur-[0.5px] drop-shadow-[0_0_10px_rgba(255,255,255,0.45)]"
            >
              cosmic.inc
            </motion.p>
          </motion.div>
        )}

        {/* ===============================================================
            SCREEN 1: LOCK SCREEN (Only Giant Time + Bottom D-Pad Prompt)
           =============================================================== */}
        {screen === 1 && (
          <motion.div
            key="lock"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            onClick={() => setScreen(2)}
            className="relative z-10 w-full h-full flex flex-col justify-between items-center py-16 cursor-pointer"
          >
            <div className="text-center mt-8">
              <div className="text-8xl md:text-9xl font-extralight tracking-tight text-white drop-shadow-2xl">
                {timeStr}
              </div>
              <div className="text-lg text-white/80 mt-2 tracking-wide">{dateStr}</div>
            </div>

            <motion.button
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 2.2 }}
              onClick={() => setScreen(2)}
              className="liquid-glass px-8 py-4 rounded-full flex items-center gap-3 text-white/90 text-sm tracking-wider tv-focus-ring"
            >
              <Gamepad2 className="w-5 h-5 text-cyan-300" />
              <span>Press Any D-Pad Button to Enter Cosmic Lounge</span>
            </motion.button>
          </motion.div>
        )}

        {/* ===============================================================
            SCREEN 2: COSMIC LOUNGE (Top Time + Windows 12 Bottom Pill Dock)
           =============================================================== */}
        {screen === 2 && (
          <motion.div
            key="lounge"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -50 }}
            className="relative z-10 w-full h-full flex flex-col justify-between items-center py-12 px-10"
          >
            {/* Top Minimal Time */}
            <div className="text-center">
              <div className="text-6xl font-light text-white drop-shadow-lg">{timeStr}</div>
              <div className="text-xs uppercase tracking-[0.25em] text-cyan-300/80 mt-1">
                Cosmic Lounge • Wallpaper Auto-Cycling
              </div>
            </div>

            {/* Bottom Windows 12 Pill-Shaped Moveable App Box */}
            <div className="flex flex-col items-center gap-3 w-full max-w-4xl">
              <div className="text-xs text-white/75 flex items-center gap-2 bg-black/40 px-4 py-1.5 rounded-full border border-white/10">
                <MoveHorizontal className="w-3.5 h-3.5 text-cyan-300" />
                <span>
                  {movingDockIdx !== null
                    ? "Select another slot to swap app position!"
                    : "Click 'Move' on any app to rearrange • Press DOWN for Main OS"}
                </span>
              </div>

              <div className="liquid-glass px-8 py-5 rounded-[42px] flex items-center justify-center gap-5 flex-wrap">
                {dockApps.map((app, idx) => (
                  <div key={app.id} className="relative group flex flex-col items-center">
                    <button
                      onClick={() => handleDockAppClick(idx, app)}
                      className={`w-28 h-24 rounded-3xl bg-gradient-to-br ${app.color} border ${
                        movingDockIdx === idx ? "border-emerald-400 scale-110" : "border-white/25"
                      } flex flex-col items-center justify-center gap-2 transition-all tv-focus-ring`}
                    >
                      {renderIcon(app.iconName)}
                      <span className="text-xs font-medium text-white truncate max-w-[90px]">
                        {app.name}
                      </span>
                    </button>
                    <button
                      onClick={() => setMovingDockIdx(movingDockIdx === idx ? null : idx)}
                      className="mt-1.5 text-[10px] px-2.5 py-0.5 rounded-full bg-white/10 hover:bg-cyan-400/30 text-white/80"
                    >
                      {movingDockIdx === idx ? "Moving..." : "⇄ Move"}
                    </button>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setScreen(3)}
                className="mt-2 liquid-glass px-7 py-2.5 rounded-full flex items-center gap-2 text-xs font-semibold text-cyan-200 hover:bg-white/20 transition tv-focus-ring"
              >
                <ArrowDown className="w-4 h-4 animate-bounce" />
                <span>Press D-Pad DOWN for Main Home Screen</span>
              </button>
            </div>
          </motion.div>
        )}

        {/* ===============================================================
            SCREEN 3: MAIN HOME OS (Left Vertical Pill Bar + Google TV Hub)
           =============================================================== */}
        {screen === 3 && (
          <motion.div
            key="mainhome"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="relative z-10 w-full h-full flex items-center p-7 gap-7 bg-black/45 backdrop-blur-md"
          >
            {/* LEFT SIDE VERTICAL PILL-SHAPED GLASS NAVIGATION BAR */}
            <div className="liquid-glass w-20 h-[86vh] rounded-full flex flex-col items-center justify-between py-7 px-2">
              <button
                onClick={() => setScreen(2)}
                title="Back to Win12 Lounge"
                className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-cyan-400/30 tv-focus-ring"
              >
                <ArrowUp className="w-5 h-5 text-cyan-300" />
              </button>

              <div className="flex flex-col gap-4">
                {[
                  { id: 'home', icon: <Home className="w-5 h-5" />, label: "Home" },
                  { id: 'search', icon: <Search className="w-5 h-5" />, label: "Search" },
                  { id: 'apps', icon: <Grid className="w-5 h-5" />, label: "Apps" },
                  { id: 'recents', icon: <Layers className="w-5 h-5" />, label: "Recents" },
                  { id: 'cloud', icon: <Cloud className="w-5 h-5" />, label: "Cloud" }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as any)}
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all tv-focus-ring ${
                      activeTab === item.id
                        ? "bg-cyan-400 text-black shadow-[0_0_20px_#00e5ff]"
                        : "bg-white/10 text-white hover:bg-white/20"
                    }`}
                  >
                    {item.icon}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setActiveTab('settings')}
                className={`w-12 h-12 rounded-full flex items-center justify-center tv-focus-ring ${
                  activeTab === 'settings' ? "bg-cyan-400 text-black" : "bg-white/10 text-white"
                }`}
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>

            {/* RIGHT MAIN WORKSPACE */}
            <div className="flex-1 h-[86vh] flex flex-col justify-between overflow-hidden">
              {/* Top Status Bar (Time + 2 Main Pill Buttons: Refresh & Status/Settings) */}
              <div className="flex items-center justify-between px-2">
                <div>
                  <h2 className="text-2xl font-bold tracking-wide flex items-center gap-2">
                    <span>VisionOS Liquid Hub</span>
                    <span className="text-xs px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-300">
                      cosmic.inc
                    </span>
                  </h2>
                  <p className="text-xs text-white/60 mt-0.5">{cloudStatus}</p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      syncFirebase();
                      showToast("⚡ Rust & Python Core: Cache Purged & RAM Boosted!");
                    }}
                    className="liquid-glass px-4 py-2 rounded-full flex items-center gap-2 text-xs font-medium hover:bg-white/20 tv-focus-ring"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-cyan-300" />
                    <span>Refresh & Boost</span>
                  </button>

                  <button
                    onClick={() => setWpIndex((wpIndex + 1) % WALLPAPERS.length)}
                    className="liquid-glass px-4 py-2 rounded-full flex items-center gap-2 text-xs font-medium hover:bg-white/20 tv-focus-ring"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-purple-300" />
                    <span>Wallpaper</span>
                  </button>

                  <div className="liquid-glass px-5 py-2 rounded-full text-sm font-semibold text-white">
                    {timeStr}
                  </div>
                </div>
              </div>

              {/* Dynamic Tab Content */}
              <div className="flex-1 overflow-y-auto py-5 px-2">
                {activeTab === 'search' && (
                  <div className="mb-6">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Universal Search across Apps, .WEBX, .VAB & Cloud..."
                      className="w-full liquid-glass px-6 py-4 rounded-3xl text-white placeholder-white/50 focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                )}

                {(activeTab === 'home' || activeTab === 'apps' || activeTab === 'search') && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                    {apps
                      .filter((a) => a.name.toLowerCase().includes(searchQuery.toLowerCase()))
                      .map((app) => (
                        <button
                          key={app.id}
                          onClick={() => {
                            setRecentApps((prev) => [app, ...prev.filter((x) => x.id !== app.id)]);
                            showToast(`⚡ Opening ${app.name} (${app.badge})`);
                          }}
                          className={`liquid-glass h-36 rounded-3xl p-5 bg-gradient-to-br ${app.color} flex flex-col justify-between text-left transition-all tv-focus-ring`}
                        >
                          <div className="flex items-center justify-between w-full">
                            {renderIcon(app.iconName)}
                            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-black/40 border border-white/20 text-cyan-200">
                              {app.badge}
                            </span>
                          </div>
                          <div>
                            <div className="text-lg font-bold text-white">{app.name}</div>
                            <div className="text-xs text-white/70">{app.category}</div>
                          </div>
                        </button>
                      ))}
                  </div>
                )}

                {activeTab === 'recents' && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">Recent Multitasking Cards</h3>
                      <button
                        onClick={() => {
                          setRecentApps([]);
                          showToast("🧹 All Background Apps Cleared from RAM!");
                        }}
            
