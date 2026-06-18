"use client"
import React, { useState, useEffect } from "react";
import { User, Lock, X, Link } from "lucide-react";
import { useRouter } from "next/navigation";
import { signUp } from "../../api/v1/auth/signUp/route";

interface SignUpProps {
  onAuthSuccess?: (email: string) => void;
  onClose?: () => void;
  onToggleView?: () => void;
}

export default function SignUp({
  onAuthSuccess,
}: SignUpProps) {
  // 1. Using name, email and password for supabase compatibility
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  // 2. Added loading state to prevent double clicks
  const [isLoading, setIsLoading] = useState(false);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!fullName.trim()) {
      newErrors.fullName = "⚠️ This field is emptier than my desk coffee cup.";
    }

    if (!email.trim()) {
      newErrors.email = "⚠️ This field is emptier than my desk coffee cup.";
    }

    if (!password) {
      newErrors.password =
        "⚠️ Please enter a password. Empty spaces don't lock notebooks.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    setErrors({}); // Clear previous errors

    // 3. Create FormData to pass to the Server Action
    const formData = new FormData();
    formData.append("name", fullName);
    formData.append("email", email);
    formData.append("password", password);

    // 4. Call the Server Action
    const result = await signUp(formData);

    // 5. Handle potential validation or database errors
    if (result?.success === false) {
      if (result.error) {
        // Validation errors from Zod matching your schema structure
        setErrors({
          fullName: result.error.name?.[0] || "",
          email: result.error.email?.[0] || "",
          password: result.error.password?.[0] || "",
        });
      } else if (result.message) {
        // Error from Supabase (e.g. wrong password, user not found)
        setErrors({ general: result.message });
      }
      setIsLoading(false);
      return;
    }

    // Note: If success is true, the server action handles the redirect() to "/"!
    // Success will be intercepted by the Server Action's redirect("/")
    if (onAuthSuccess) {
      onAuthSuccess(email);
    }
  };;;;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white-950/70 backdrop-blur-md select-none font-patrick">
      <div className="relative w-full max-w-md p-6 mx-4">
        {/* Washi Decals on the Corners */}
        <div className="absolute top-2 left-6 w-16 h-5 bg-yellow-200/40 border-x border-dashed border-yellow-400/30 transform -rotate-12 pointer-events-none z-10" />
        <div className="absolute top-2 right-6 w-16 h-5 bg-yellow-200/40 border-x border-dashed border-yellow-400/30 transform rotate-12 pointer-events-none z-10" />

        {/* Outer Index Card Wrapper */}
        <div className="relative bg-[#fbfbf8] border-2 border-neutral-300 rounded shadow-2xl p-8 pt-10 text-slate-800 border-dashed">
          {/* Top red header ruled line of index card */}
          <div className="absolute top-8 left-0 right-0 h-[1.5px] bg-red-400/50" />

          {/* Close button */}
          <button
            onClick={() => {
              window.location.href = "/";
            }}
            className="absolute top-2 right-2 p-1 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>

          {/* Eye-Covering Pencil Mascot (animated SVG) */}
          <div className="flex flex-col items-center mb-6">
            <div className="relative w-20 h-20">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                {/* Pencil Yellow Body */}
                <path
                  d="M35 15 L65 15 L65 70 L35 70 Z"
                  fill="#fbbf24"
                  stroke="#475569"
                  strokeWidth="2.5"
                />
                {/* Pencil Tip (Wood) */}
                <path
                  d="M35 70 L50 90 L65 70 Z"
                  fill="#fef3c7"
                  stroke="#475569"
                  strokeWidth="2.5"
                />
                {/* Lead Tip */}
                <path d="M45 83 L50 90 L55 83 Z" fill="#475569" />
                {/* Pink Eraser */}
                <path
                  d="M35 15 C35 5, 65 5, 65 15 Z"
                  fill="#f43f5e"
                  stroke="#475569"
                  strokeWidth="2.5"
                />

                {!isPasswordFocused ? (
                  <>
                    <circle cx="43" cy="40" r="3.5" fill="#1e293b" />
                    <circle cx="57" cy="40" r="3.5" fill="#1e293b" />
                    <path
                      d="M45 52 Q50 56 55 52"
                      fill="none"
                      stroke="#1e293b"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </>
                ) : (
                  <>
                    <path
                      d="M40 40 Q43 43 46 40"
                      fill="none"
                      stroke="#1e293b"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M54 40 Q57 43 60 40"
                      fill="none"
                      stroke="#1e293b"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <circle cx="50" cy="52" r="2.5" fill="#1e293b" />
                  </>
                )}

                <path
                  d={
                    isPasswordFocused
                      ? "M20 45 C30 45, 38 40, 42 38"
                      : "M20 45 Q30 50 35 48"
                  }
                  fill="none"
                  stroke="#475569"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <path
                  d={
                    isPasswordFocused
                      ? "M80 45 C70 45, 62 40, 58 38"
                      : "M80 45 Q70 50 65 48"
                  }
                  fill="none"
                  stroke="#475569"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />

                {isPasswordFocused && (
                  <>
                    <circle
                      cx="42"
                      cy="38"
                      r="5"
                      fill="#fbbf24"
                      stroke="#475569"
                      strokeWidth="1.5"
                    />
                    <circle
                      cx="58"
                      cy="38"
                      r="5"
                      fill="#fbbf24"
                      stroke="#475569"
                      strokeWidth="1.5"
                    />
                  </>
                )}
              </svg>
            </div>

            <p className="font-caveat text-xl font-bold text-slate-650 mt-1">
              {isPasswordFocused
                ? "🙈 Shhh... I'm not looking at your password!"
                : "✏️ Welcome, scholar! Log your details below."}
            </p>
          </div>

          <h2 className="text-center font-caveat text-4xl font-bold text-violet-750 tracking-wide mb-1 drop-shadow-sm pb-5">
            Join the NoteBook
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {errors.general && (
              <div className="p-2 bg-red-50 border border-red-200 text-red-600 rounded text-xs font-bold text-center">
                ⚠️ {errors.general}
              </div>
            )}
            {/* Full Name Input */}
            <div>
              <label className="text-slate-500 font-bold text-xs uppercase tracking-wider mb-1 flex items-center gap-1">
                <User size={12} />
                <span>Cardholder Name</span>
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  if (errors.fullName)
                    setErrors((prev) => ({ ...prev, fullName: "" }));
                  if (errors.general)
                    setErrors((prev) => ({ ...prev, general: "" }));
                }}
                className="w-full px-3 py-1.5 bg-white/70 border border-slate-300 rounded font-patrick text-md text-slate-800 focus:outline-none focus:border-violet-500 transition-colors shadow-sm"
                placeholder="Type your fullName..."
                maxLength={20}
              />
              {errors.fullName && (
                <p className="text-[11px] text-red-500 mt-0.5">
                  {errors.fullName}
                </p>
              )}
            </div>

            {/* Email Input */}
            <div>
              <label className="text-slate-500 font-bold text-xs uppercase tracking-wider mb-1 flex items-center gap-1">
                <User size={12} />
                <span>Cardholder Email</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email)
                    setErrors((prev) => ({ ...prev, email: "" }));
                  if (errors.general)
                    setErrors((prev) => ({ ...prev, general: "" }));
                }}
                className="w-full px-3 py-1.5 bg-white/70 border border-slate-300 rounded font-patrick text-md text-slate-800 focus:outline-none focus:border-violet-500 transition-colors shadow-sm"
                placeholder="Type your email..."
                maxLength={20}
              />
              {errors.email && (
                <p className="text-[11px] text-red-500 mt-0.5">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password Input */}
            <div>
              <label className="text-slate-500 font-bold text-xs uppercase tracking-wider mb-1 flex items-center gap-1">
                <Lock size={12} />
                <span>Access Keycode</span>
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password)
                    setErrors((prev) => ({ ...prev, password: "" }));
                  if (errors.general)
                    setErrors((prev) => ({ ...prev, general: "" }));
                }}
                onFocus={() => setIsPasswordFocused(true)}
                onBlur={() => setIsPasswordFocused(false)}
                className="w-full px-3 py-1.5 bg-white/70 border border-slate-300 rounded font-patrick text-md text-slate-800 focus:outline-none focus:border-violet-500 transition-colors shadow-sm"
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="text-[11px] text-red-500 mt-0.5">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="text-center pt-2">
              <button
                type="submit"
                className="
                  relative px-8 py-2 bg-[#fee2e2]/95 hover:bg-[#fecaca] text-rose-800 border-x-4 border-dashed border-rose-400/50
                  font-patrick text-xl font-bold shadow-sm hover:shadow-md transition-all cursor-pointer -rotate-1 w-full
                  before:content-[''] before:absolute before:-left-1 before:top-0 before:bottom-0 before:w-1.5 before:bg-[linear-gradient(45deg,#f43f5e_25%,transparent_25%),linear-gradient(-45deg,#f43f5e_25%,transparent_25%)] before:bg-size-[6px_6px]
                "
              >
                {isLoading ? "Filing Slip... ⏳" : "Register Member Slip ✍️"}
              </button>
            </div>
          </form>

          {/* Toggle Link */}
          <div className="text-center mt-4 pt-3 border-t border-slate-200">
            <span className="text-xs text-slate-500">Already registered?</span>
            <button
              type="button"
              onClick={() => {
                window.location.href = "/sign-in";
              }}
              className="text-xs text-violet-600 hover:text-violet-850 font-bold hover:underline cursor-pointer ml-1"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
