"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Mail,
  Calendar,
  UserCheck,
  Shield,
  ChevronRight,
  Pencil,
  Check,
  X,
  Eye,
  EyeOff,
  KeyRound,
  RefreshCw,
} from "lucide-react";
import PencilLoader from "@/components/Loader/PencilLoader";

interface UserProfile {
  id: string;
  email: string;
  name: string;
  lastSignIn: string;
}

const AVATAR_COLORS = [
  "from-violet-500 to-indigo-600",
  "from-emerald-500 to-teal-600",
  "from-rose-500 to-pink-600",
  "from-amber-500 to-orange-600",
  "from-sky-500 to-blue-600",
  "from-fuchsia-500 to-purple-600",
];

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Name editing
  const [name, setName] = useState<string>("");
  const [isEditingName, setIsEditingName] = useState<boolean>(false);
  const [isSavingName, setIsSavingName] = useState<boolean>(false);
  const nameInputRef = useRef<HTMLInputElement>(null);

  // Password change
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [showNewPw, setShowNewPw] = useState<boolean>(false);
  const [showConfirmPw, setShowConfirmPw] = useState<boolean>(false);
  const [isChangingPw, setIsChangingPw] = useState<boolean>(false);
  const [pwError, setPwError] = useState<string>("");

  // Avatar color
  const [avatarColor, setAvatarColor] = useState<string>(AVATAR_COLORS[0]);

  // Status banners
  const [nameStatus, setNameStatus] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [pwStatus, setPwStatus] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // ── Fetch profile on mount ─────────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const res = await fetch("/api/v1/user/profile").then((r) => r.json());
        if (res.success && res.profile) {
          setProfile(res.profile);
          setName(res.profile.name);
        } else {
          setNameStatus({ type: "error", text: res.message || "Failed to load profile." });
        }
      } catch {
        setNameStatus({ type: "error", text: "Network error loading profile." });
      } finally {
        setIsLoading(false);
      }
    })();

    // Load saved avatar color preference
    const saved = localStorage.getItem("profile_avatar_color");
    if (saved && AVATAR_COLORS.includes(saved)) setAvatarColor(saved);
  }, []);

  // Focus name input when editing starts
  useEffect(() => {
    if (isEditingName) nameInputRef.current?.focus();
  }, [isEditingName]);

  // Auto-dismiss status banners after 4 s
  useEffect(() => {
    if (!nameStatus) return;
    const t = setTimeout(() => setNameStatus(null), 4000);
    return () => clearTimeout(t);
  }, [nameStatus]);

  useEffect(() => {
    if (!pwStatus) return;
    const t = setTimeout(() => setPwStatus(null), 4000);
    return () => clearTimeout(t);
  }, [pwStatus]);

  // ── Save name ──────────────────────────────────────────────────────────────
  const handleSaveName = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || name.trim() === profile?.name) {
      setIsEditingName(false);
      return;
    }
    setIsSavingName(true);
    setNameStatus(null);
    try {
      const res = await fetch("/api/v1/user/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      }).then((r) => r.json());

      if (res.success) {
        setProfile((prev) => (prev ? { ...prev, name: name.trim() } : null));
        setIsEditingName(false);
        setNameStatus({ type: "success", text: "Library card name updated successfully! ✍️" });
        window.dispatchEvent(new Event("refresh-sidebar"));
      } else {
        setNameStatus({ type: "error", text: res.message || "Failed to update name." });
      }
    } catch {
      setNameStatus({ type: "error", text: "Network error during name update." });
    } finally {
      setIsSavingName(false);
    }
  };

  // ── Change password ────────────────────────────────────────────────────────
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwError("");
    if (newPassword.length < 6) {
      setPwError("Password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwError("Passwords do not match.");
      return;
    }

    setIsChangingPw(true);
    setPwStatus(null);
    try {
      const res = await fetch("/api/v1/user/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: newPassword }),
      }).then((r) => r.json());

      if (res.success) {
        setPwStatus({ type: "success", text: "Keycode updated successfully! 🔒" });
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setPwStatus({ type: "error", text: res.message || "Failed to update password." });
      }
    } catch {
      setPwStatus({ type: "error", text: "Network error during password update." });
    } finally {
      setIsChangingPw(false);
    }
  };

  // ── Loading state ──────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <PencilLoader
        text="Loading library card..."
        subtitle="Fetching your scholar registry details..."
        className="flex-1 min-h-[60vh]"
      />
    );
  }

  const avatarChar = profile?.name ? profile.name[0].toUpperCase() : "U";

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 font-sans select-none text-slate-800">

      {/* ── Page Header ─────────────────────────────────────────────────── */}
      <div className="mb-8 border-b border-dashed border-slate-300 pb-4 flex items-start justify-between gap-4">
        <div>
          <h1 className="font-caveat text-4xl font-bold tracking-wide text-slate-900 m-0">
            Scholar Registry
          </h1>
          <p className="font-patrick text-sm text-slate-500 mt-1">
            Manage your catalog details, author card, and keycode security.
          </p>
        </div>
        <div className="text-[10px] font-semibold text-slate-400 bg-slate-100 border border-slate-200 px-2.5 py-1.5 rounded-lg shrink-0 font-mono">
          ID: {profile?.id.substring(0, 12)}…
        </div>
      </div>

      {/* ── Avatar + Name Card ──────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-6">
        {/* Left: Avatar */}
        <div className={`md:col-span-4 bg-gradient-to-br ${avatarColor} rounded-2xl p-6 text-white flex flex-col items-center justify-center text-center shadow-lg relative overflow-hidden group transition-all duration-500`}>
          <div className="absolute top-0 right-0 w-28 h-28 bg-white/10 rounded-full blur-2xl group-hover:scale-110 transition-transform duration-500 pointer-events-none" />
          <div className="absolute -bottom-8 -left-8 w-28 h-28 bg-white/10 rounded-full blur-xl pointer-events-none" />

          {/* Avatar circle */}
          <div className="w-20 h-20 rounded-full bg-white/20 border-4 border-white/30 flex items-center justify-center text-4xl font-bold font-caveat mb-3 shadow-inner group-hover:scale-105 transition-transform duration-300 relative z-10">
            {avatarChar}
          </div>
          <h2 className="font-patrick text-xl font-bold tracking-wide truncate max-w-full relative z-10">
            {profile?.name}
          </h2>
          <p className="text-[10px] uppercase font-bold text-white/70 tracking-widest mt-0.5 relative z-10">
            Registered Scholar
          </p>

          <div className="w-full border-t border-white/20 my-4 relative z-10" />

          {/* Email display */}
          <div className="text-[10px] text-white/80 flex items-center gap-1.5 font-sans relative z-10">
            <Mail size={10} />
            <span className="truncate max-w-[160px]">{profile?.email}</span>
          </div>

          {/* Avatar color picker */}
          <div className="mt-4 flex gap-1.5 flex-wrap justify-center relative z-10">
            {AVATAR_COLORS.map((color) => (
              <button
                key={color}
                onClick={() => {
                  setAvatarColor(color);
                  localStorage.setItem("profile_avatar_color", color);
                }}
                className={`w-5 h-5 rounded-full bg-gradient-to-br ${color} border-2 cursor-pointer transition-transform hover:scale-110 ${
                  avatarColor === color ? "border-white scale-110 shadow-md" : "border-white/30"
                }`}
                title="Change avatar color"
              />
            ))}
          </div>
        </div>

        {/* Right: Name form */}
        <div className="md:col-span-8 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col gap-5">

          {/* Name status */}
          {nameStatus && (
            <div className={`p-3 rounded-xl border text-xs font-patrick flex items-center gap-2 ${
              nameStatus.type === "success"
                ? "bg-emerald-50 border-emerald-300 text-emerald-800"
                : "bg-rose-50 border-rose-300 text-rose-800"
            }`}>
              {nameStatus.type === "success" ? <Check size={13} /> : <X size={13} />}
              <span>{nameStatus.text}</span>
            </div>
          )}

          {/* Library Card Name */}
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono block mb-1.5">
              Library Card Name
            </span>
            {isEditingName ? (
              <form onSubmit={handleSaveName} className="flex gap-2">
                <input
                  ref={nameInputRef}
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="grow px-3.5 py-2 bg-slate-50 border border-violet-400 rounded-lg text-sm text-slate-800 font-sans focus:outline-none focus:ring-2 focus:ring-violet-400/30 transition-all"
                  maxLength={30}
                  required
                />
                <button
                  type="submit"
                  disabled={isSavingName}
                  className="px-4 py-2 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white font-patrick text-xs font-bold rounded-lg cursor-pointer transition-colors shadow-sm flex items-center gap-1.5"
                >
                  {isSavingName ? <RefreshCw size={12} className="animate-spin" /> : <Check size={12} />}
                  {isSavingName ? "Saving…" : "Save"}
                </button>
                <button
                  type="button"
                  onClick={() => { setIsEditingName(false); setName(profile?.name || ""); }}
                  className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-600 font-patrick text-xs rounded-lg cursor-pointer transition-colors"
                >
                  <X size={12} />
                </button>
              </form>
            ) : (
              <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 group hover:border-violet-300 transition-colors">
                <span className="text-sm font-patrick font-bold text-slate-800">{profile?.name}</span>
                <button
                  type="button"
                  onClick={() => setIsEditingName(true)}
                  className="text-xs text-violet-600 hover:text-violet-800 font-semibold font-patrick flex items-center gap-1 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Pencil size={11} />
                  Edit
                </button>
              </div>
            )}
          </div>

          {/* Primary Email (locked) */}
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono block mb-1.5">
              Primary Email
            </span>
            <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-slate-500 cursor-not-allowed">
              <span className="text-xs font-sans">{profile?.email}</span>
              <Shield size={12} className="text-slate-400 shrink-0" />
            </div>
            <p className="text-[10px] text-slate-400 mt-1 font-sans">Email is locked. Contact support to change it.</p>
          </div>

          {/* Last Sign-In */}
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono block mb-1.5">
              Last Account Activity
            </span>
            <div className="flex items-center gap-2 text-xs text-slate-500 font-patrick bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5">
              <Calendar size={13} className="text-slate-400 shrink-0" />
              <span>
                Signed in on{" "}
                <strong className="text-slate-700">
                  {profile?.lastSignIn ? new Date(profile.lastSignIn).toLocaleString() : "Unknown"}
                </strong>
              </span>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-3 flex justify-between items-center text-[10px] text-slate-400 font-patrick mt-auto">
            <span className="flex items-center gap-1">
              <UserCheck size={11} className="text-emerald-500" />
              <span>Identity Verified</span>
            </span>
            <span className="italic">SyntaxNote Scholar Registry</span>
          </div>
        </div>
      </div>

      {/* ── Change Password Card ─────────────────────────────────────────── */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-5">
          <KeyRound size={16} className="text-violet-500 shrink-0" />
          <h2 className="font-patrick text-base font-bold text-slate-800 m-0">Change Keycode Password</h2>
        </div>

        {/* Password status */}
        {pwStatus && (
          <div className={`mb-4 p-3 rounded-xl border text-xs font-patrick flex items-center gap-2 ${
            pwStatus.type === "success"
              ? "bg-emerald-50 border-emerald-300 text-emerald-800"
              : "bg-rose-50 border-rose-300 text-rose-800"
          }`}>
            {pwStatus.type === "success" ? <Check size={13} /> : <X size={13} />}
            <span>{pwStatus.text}</span>
          </div>
        )}

        <form onSubmit={handleChangePassword} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* New Password */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono block">
              New Password
            </span>
            <div className="relative flex items-center">
              <input
                type={showNewPw ? "text" : "password"}
                placeholder="Min. 6 characters"
                value={newPassword}
                onChange={(e) => { setNewPassword(e.target.value); setPwError(""); }}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800 font-sans focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-400/20 pr-10 transition-all"
                minLength={6}
                required
              />
              <button
                type="button"
                onClick={() => setShowNewPw(!showNewPw)}
                className="absolute right-3 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                {showNewPw ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono block">
              Confirm Password
            </span>
            <div className="relative flex items-center">
              <input
                type={showConfirmPw ? "text" : "password"}
                placeholder="Re-enter password"
                value={confirmPassword}
                onChange={(e) => { setConfirmPassword(e.target.value); setPwError(""); }}
                className={`w-full px-3.5 py-2 bg-slate-50 border rounded-lg text-sm text-slate-800 font-sans focus:outline-none focus:ring-2 pr-10 transition-all ${
                  confirmPassword && confirmPassword !== newPassword
                    ? "border-rose-400 focus:border-rose-500 focus:ring-rose-400/20"
                    : confirmPassword && confirmPassword === newPassword
                    ? "border-emerald-400 focus:border-emerald-500 focus:ring-emerald-400/20"
                    : "border-slate-300 focus:border-violet-500 focus:ring-violet-400/20"
                }`}
                minLength={6}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPw(!showConfirmPw)}
                className="absolute right-3 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                {showConfirmPw ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
              {/* Match indicator */}
              {confirmPassword.length > 0 && (
                <span className={`absolute -right-6 ${confirmPassword === newPassword ? "text-emerald-500" : "text-rose-500"}`}>
                  {confirmPassword === newPassword ? <Check size={14} /> : <X size={14} />}
                </span>
              )}
            </div>
          </div>

          {/* Inline error */}
          {pwError && (
            <div className="sm:col-span-2 text-xs text-rose-600 font-patrick flex items-center gap-1.5">
              <X size={12} />
              {pwError}
            </div>
          )}

          {/* Submit */}
          <div className="sm:col-span-2">
            <button
              type="submit"
              disabled={isChangingPw || !newPassword || !confirmPassword}
              className="w-full py-2.5 bg-violet-600 hover:bg-violet-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-patrick text-sm font-bold rounded-lg cursor-pointer transition-colors shadow-sm flex items-center justify-center gap-2"
            >
              {isChangingPw
                ? <><RefreshCw size={14} className="animate-spin" /> Updating keycode…</>
                : <><KeyRound size={14} /> Update Keycode Password</>
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
