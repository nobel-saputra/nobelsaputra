// /app/login/page.tsx
"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) return setError(error.message);

    // kasih waktu untuk simpan cookie session
    setTimeout(() => router.replace("/dashboard"), 200);
  };

  return (
    <div className="min-h-screen flex items-center justify-center text-white">
      <form onSubmit={handleLogin} className="bg-gray-800 p-8 rounded-2xl w-80">
        <h1 className="text-2xl font-semibold mb-4 text-center">Login</h1>
        <input type="email" placeholder="Email" className="w-full mb-3 p-2 rounded bg-gray-700" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" className="w-full mb-3 p-2 rounded bg-gray-700" value={password} onChange={(e) => setPassword(e.target.value)} />
        {error && <p className="text-red-400 text-sm mb-3">{error}</p>}
        <button className="bg-green-600 hover:bg-green-700 w-full py-2 rounded">Login</button>
      </form>
    </div>
  );
}
