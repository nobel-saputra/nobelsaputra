"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { LogOut, Plus, X, Pencil, Trash2, Eye, Github } from "lucide-react";

interface Portfolio {
  id: string;
  title: string;
  description: string;
  image_url: string;
  live_url: string;
  github_url: string;
}

export default function DashboardPage() {
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [user, setUser] = useState<any>(null);
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [liveUrl, setLiveUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [oldImageUrl, setOldImageUrl] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    let mounted = true;

    const checkAuth = async () => {
      try {
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError || !session || !session.user) {
          console.warn("No valid session found, redirecting to login");
          if (mounted) {
            router.replace("/login");
          }
          return;
        }

        const {
          data: { user: currentUser },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !currentUser) {
          console.warn("User verification failed, redirecting to login");
          if (mounted) {
            router.replace("/login");
          }
          return;
        }

        if (mounted) {
          setUser(currentUser);
          setIsAuthenticated(true);
          await fetchPortfolios(currentUser.id);
          setLoading(false);
        }
      } catch (error) {
        console.error("Auth check error:", error);
        if (mounted) {
          router.replace("/login");
        }
      }
    };

    checkAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT" || !session || !session.user) {
        console.warn("Auth state changed: user logged out");
        router.replace("/login");
      } else if (event === "TOKEN_REFRESHED") {
        console.log("Token refreshed successfully");
      } else if (event === "SIGNED_IN" && session?.user) {
        setUser(session.user);
        setIsAuthenticated(true);
        fetchPortfolios(session.user.id);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  async function fetchPortfolios(userId: string) {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        router.replace("/login");
        return;
      }

      const { data, error } = await supabase.from("portfolios").select("*").eq("user_id", userId).order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching portfolios:", error);
        return;
      }

      if (data) setPortfolios(data);
    } catch (error) {
      console.error("Fetch portfolios error:", error);
    }
  }

  async function handleAddPortfolio(e: React.FormEvent) {
    e.preventDefault();

    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session || !user) {
      alert("Sesi Anda telah berakhir. Silakan login kembali.");
      router.replace("/login");
      return;
    }

    if (!imageFile) return alert("Pilih gambar terlebih dahulu!");

    try {
      const fileExt = imageFile.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from("portfolios").upload(fileName, imageFile);

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage.from("portfolios").getPublicUrl(fileName);

      const { error: insertError } = await supabase.from("portfolios").insert([
        {
          user_id: user.id,
          title,
          description,
          image_url: publicUrlData.publicUrl,
          live_url: liveUrl,
          github_url: githubUrl,
        },
      ]);

      if (insertError) throw insertError;

      resetForm();
      await fetchPortfolios(user.id);
      setIsFormOpen(false);
    } catch (error) {
      console.error("Error adding portfolio:", error);
      alert("Terjadi kesalahan saat menambah portfolio");
    }
  }

  async function handleDeletePortfolio(id: string, image_url: string) {
    if (!confirm("Yakin mau hapus?")) return;

    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session || !user) {
      alert("Sesi Anda telah berakhir. Silakan login kembali.");
      router.replace("/login");
      return;
    }

    try {
      const { error: deleteError } = await supabase.from("portfolios").delete().eq("id", id).eq("user_id", user.id);

      if (deleteError) throw deleteError;

      const filePath = image_url.split("/").pop();
      if (filePath) {
        await supabase.storage.from("portfolios").remove([filePath]);
      }

      setPortfolios((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error deleting portfolio:", error);
      alert("Terjadi kesalahan saat menghapus portfolio");
    }
  }

  function startEdit(item: Portfolio) {
    setIsEditing(true);
    setEditId(item.id);
    setTitle(item.title);
    setDescription(item.description);
    setLiveUrl(item.live_url);
    setGithubUrl(item.github_url);
    setOldImageUrl(item.image_url);
    setIsFormOpen(true);
  }

  async function handleUpdatePortfolio(e: React.FormEvent) {
    e.preventDefault();
    if (!editId) return;

    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session || !user) {
      alert("Sesi Anda telah berakhir. Silakan login kembali.");
      router.replace("/login");
      return;
    }

    try {
      let finalImageUrl = oldImageUrl;

      if (imageFile) {
        const oldFile = oldImageUrl?.split("/").pop();
        if (oldFile) {
          await supabase.storage.from("portfolios").remove([oldFile]);
        }

        const fileExt = imageFile.name.split(".").pop();
        const newFileName = `${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage.from("portfolios").upload(newFileName, imageFile);

        if (uploadError) throw uploadError;

        const { data: newUrl } = supabase.storage.from("portfolios").getPublicUrl(newFileName);

        finalImageUrl = newUrl.publicUrl;
      }

      const { error: updateError } = await supabase
        .from("portfolios")
        .update({
          title,
          description,
          live_url: liveUrl,
          github_url: githubUrl,
          image_url: finalImageUrl,
        })
        .eq("id", editId)
        .eq("user_id", user.id);

      if (updateError) throw updateError;

      resetForm();
      await fetchPortfolios(user.id);
      setIsFormOpen(false);
    } catch (error) {
      console.error("Error updating portfolio:", error);
      alert("Terjadi kesalahan saat mengupdate portfolio");
    }
  }

  function resetForm() {
    setIsEditing(false);
    setEditId(null);
    setTitle("");
    setDescription("");
    setImageFile(null);
    setLiveUrl("");
    setGithubUrl("");
    setOldImageUrl(null);
    setIsFormOpen(false);
  }

  async function handleLogout() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error logging out:", error);
    } else {
      router.replace("/login");
    }
  }

  if (loading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#212529] flex items-center justify-center">
        <div className="text-center">
          <div className="loader"></div>
          <p className="text-white mt-4 text-lg">Memverifikasi akses...</p>
        </div>
        <style jsx>{`
          .loader {
            width: 48px;
            height: 48px;
            border: 4px solid rgba(255, 255, 255, 0.1);
            border-top-color: #ffffff;
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            to {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen rounded-2xl bg-[#212529] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 fade-in">
          <div className="flex-1">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Dashboard Portfolio</h1>
            <p className="text-gray-400">Kelola dan pantau portfolio Anda</p>
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <button onClick={() => setIsFormOpen(!isFormOpen)} className="flex-1 sm:flex-none bg-white text-[#212529] px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg">
              <Plus className="w-5 h-5" />
              {isFormOpen ? "Tutup Form" : "Tambah Baru"}
            </button>
            <button onClick={handleLogout} className="flex-1 sm:flex-none bg-transparent text-white border-2 border-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-[#212529] transition-all duration-300 flex items-center justify-center gap-2 group">
              <LogOut className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
              Logout
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Portfolio</p>
                <p className="text-2xl font-bold text-[#212529] mt-1">{portfolios.length}</p>
              </div>
              <div className="w-12 h-12 bg-[#212529] rounded-lg flex items-center justify-center">
                <Eye className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Dengan Live Demo</p>
                <p className="text-2xl font-bold text-[#212529] mt-1">{portfolios.filter((p) => p.live_url).length}</p>
              </div>
              <div className="w-12 h-12 bg-[#212529] rounded-lg flex items-center justify-center">
                <Eye className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Dengan GitHub</p>
                <p className="text-2xl font-bold text-[#212529] mt-1">{portfolios.filter((p) => p.github_url).length}</p>
              </div>
              <div className="w-12 h-12 bg-[#212529] rounded-lg flex items-center justify-center">
                <Github className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Form Section */}
        {isFormOpen && (
          <div className="bg-white rounded-2xl p-6 mb-8 shadow-xl slide-up border border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-[#212529]">{isEditing ? "Edit Portfolio" : "Tambah Portfolio Baru"}</h2>
              <button onClick={resetForm} className="w-8 h-8 rounded-full bg-[#212529] text-white flex items-center justify-center hover:bg-gray-800 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={isEditing ? handleUpdatePortfolio : handleAddPortfolio} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div>
                    <label className="block text-[#212529] font-semibold mb-3">Judul Project</label>
                    <input type="text" placeholder="Masukkan nama project" className="w-full px-4 py-3 rounded-xl bg-gray-50 text-[#212529] border-2 border-gray-200 focus:border-[#212529] focus:bg-white transition-all outline-none placeholder-gray-500" value={title} onChange={(e) => setTitle(e.target.value)} required />
                  </div>

                  <div>
                    <label className="block text-[#212529] font-semibold mb-3">Deskripsi</label>
                    <textarea placeholder="Jelaskan detail project Anda" className="w-full px-4 py-3 rounded-xl bg-gray-50 text-[#212529] border-2 border-gray-200 focus:border-[#212529] focus:bg-white transition-all outline-none resize-none placeholder-gray-500" rows={4} value={description} onChange={(e) => setDescription(e.target.value)} required />
                  </div>

                  <div>
                    <label className="block text-[#212529] font-semibold mb-3">Gambar Project</label>
                    <input type="file" accept="image/*" className="w-full px-4 py-3 rounded-xl bg-gray-50 text-[#212529] border-2 border-gray-200 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#212529] file:text-white file:font-semibold hover:file:bg-gray-800 transition-all" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-[#212529] font-semibold mb-3">Live URL</label>
                    <input type="url" placeholder="https://example.com" className="w-full px-4 py-3 rounded-xl bg-gray-50 text-[#212529] border-2 border-gray-200 focus:border-[#212529] focus:bg-white transition-all outline-none placeholder-gray-500" value={liveUrl} onChange={(e) => setLiveUrl(e.target.value)} />
                  </div>

                  <div>
                    <label className="block text-[#212529] font-semibold mb-3">GitHub URL</label>
                    <input type="url" placeholder="https://github.com/username/repo" className="w-full px-4 py-3 rounded-xl bg-gray-50 text-[#212529] border-2 border-gray-200 focus:border-[#212529] focus:bg-white transition-all outline-none placeholder-gray-500" value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)} />
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200">
                    <h3 className="font-semibold text-[#212529] mb-2">Tips Portfolio yang Baik:</h3>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Gunakan gambar berkualitas tinggi</li>
                      <li>• Tulis deskripsi yang jelas dan menarik</li>
                      <li>• Sertakan link demo dan source code</li>
                      <li>• Update portfolio secara berkala</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button type="submit" className="flex-1 bg-[#212529] text-white px-6 py-4 rounded-xl font-semibold hover:bg-gray-800 transition-all duration-300 flex items-center justify-center gap-3 shadow-lg">
                  {isEditing ? (
                    <>
                      <Pencil className="w-5 h-5" />
                      Update Portfolio
                    </>
                  ) : (
                    <>
                      <Plus className="w-5 h-5" />
                      Tambah Portfolio
                    </>
                  )}
                </button>

                {isEditing && (
                  <button type="button" onClick={resetForm} className="bg-white text-[#212529] border-2 border-[#212529] px-6 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300 flex items-center gap-3">
                    <X className="w-5 h-5" />
                    Batal Edit
                  </button>
                )}
              </div>
            </form>
          </div>
        )}

        {/* Portfolio Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Portfolio Saya ({portfolios.length})</h2>

          {portfolios.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-[#212529] mb-2">Belum ada portfolio</h3>
              <p className="text-gray-600 mb-6">Mulai dengan menambahkan portfolio pertama Anda</p>
              <button onClick={() => setIsFormOpen(true)} className="bg-[#212529] text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-all duration-300 inline-flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Tambah Portfolio Pertama
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {portfolios.map((item, index) => (
                <div key={item.id} className="portfolio-card bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 group border border-gray-200" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="relative w-full h-48 overflow-hidden bg-gray-100">
                    <Image src={item.image_url} alt={item.title} fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300" />
                  </div>

                  <div className="p-5">
                    <h3 className="text-lg font-bold text-[#212529] mb-2 line-clamp-1 group-hover:text-gray-700 transition-colors">{item.title}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">{item.description}</p>

                    <div className="flex gap-3 mb-4">
                      {item.live_url && (
                        <a href={item.live_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-[#212529] hover:text-gray-700 font-medium text-sm transition-colors">
                          <Eye className="w-4 h-4" />
                          Live Demo
                        </a>
                      )}
                      {item.github_url && (
                        <a href={item.github_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-[#212529] hover:text-gray-700 font-medium text-sm transition-colors">
                          <Github className="w-4 h-4" />
                          GitHub
                        </a>
                      )}
                    </div>

                    <div className="flex gap-2 pt-4 border-t border-gray-100">
                      <button onClick={() => startEdit(item)} className="flex-1 bg-[#212529] text-white py-2.5 rounded-lg font-semibold hover:bg-gray-800 transition-all duration-300 flex items-center justify-center gap-2 text-sm">
                        <Pencil className="w-4 h-4" />
                        Edit
                      </button>
                      <button onClick={() => handleDeletePortfolio(item.id, item.image_url)} className="flex-1 bg-white text-[#212529] border-2 border-[#212529] py-2.5 rounded-lg font-semibold hover:bg-[#212529] hover:text-white transition-all duration-300 flex items-center justify-center gap-2 text-sm">
                        <Trash2 className="w-4 h-4" />
                        Hapus
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .fade-in {
          animation: fadeIn 0.6s ease-out;
        }

        .slide-up {
          animation: slideUp 0.6s ease-out;
        }

        .portfolio-card {
          animation: slideUp 0.6s ease-out forwards;
          opacity: 0;
          transform: translateY(20px);
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}
