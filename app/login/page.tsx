"use client";

import { useSignIn } from "@clerk/nextjs";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaFacebook } from 'react-icons/fa';
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";
import { toast } from "react-hot-toast";

export default function LoginPage() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // 1. Hàm xử lý Đăng nhập bằng Email/Password
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;
    setLoading(true);

    try {
      const result = await signIn.create({
        identifier: email,
        password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        toast.success("Chào mừng ông giáo đã trở lại!");
        router.push("/"); // Về trang chủ
      } else {
        console.log(result);
      }
    } catch (err: any) {
      toast.error("Sai tài khoản hoặc mật khẩu rồi ông giáo ơi!");
    } finally {
      setLoading(false);
    }
  };

  // 2. Hàm xử lý Đăng nhập bằng Google
  const signInWithGoogle = () => {
    if (!isLoaded) return;
    signIn.authenticateWithRedirect({
      strategy: "oauth_google",
      redirectUrl: "/sso-callback",
      redirectUrlComplete: "/",
    });
  };

  return (
    <div className="bg-[#ee4d2d] min-h-screen flex items-center justify-center py-12 px-4 font-sans">
      <div className="max-w-md w-full bg-white rounded-sm shadow-xl p-8">
        {/* Header Form */}
        <div className="flex items-center justify-between mb-8 text-gray-800">
          <h2 className="text-2xl font-medium">Đăng nhập</h2>
          <Link href="/" className="text-xl font-bold text-[#ee4d2d] hover:opacity-80 transition-all italic">
            K - Market
          </Link>
        </div>

        {/* Form Logic */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email/Số điện thoại/Tên đăng nhập"
            className="w-full border border-gray-300 p-3 rounded-sm outline-none focus:border-gray-500 text-sm text-gray-800"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mật khẩu"
            className="w-full border border-gray-300 p-3 rounded-sm outline-none focus:border-gray-500 text-sm text-gray-800"
            required
          />

          <button 
            type="submit" 
            disabled={loading}
            className={`w-full bg-[#ee4d2d] text-white py-3 rounded-sm uppercase font-medium transition-all shadow-md ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#d73211]'}`}
          >
            {loading ? "Đang xử lý..." : "Đăng nhập"}
          </button>
        </form>

        <div className="flex justify-between mt-4 text-[11px] text-blue-600 font-medium">
          <a href="#" className="hover:opacity-80">Quên mật khẩu</a>
          <a href="#" className="hover:opacity-80">Đăng nhập với SMS</a>
        </div>

        {/* Hoặc đăng nhập bằng */}
        <div className="mt-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-gray-200"></span></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-gray-400">Hoặc</span></div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <button className="flex items-center justify-center gap-2 border border-gray-300 p-2 rounded-sm hover:bg-gray-50 text-gray-700 text-sm font-medium">
              <FaFacebook className="text-xl text-blue-700" /> Facebook
            </button>
            <button 
              type="button"
              onClick={signInWithGoogle}
              className="flex items-center justify-center gap-2 border border-gray-300 p-2 rounded-sm hover:bg-gray-50 text-gray-700 text-sm font-medium"
            >
              <FcGoogle className="text-xl" /> Google
            </button>
          </div>
        </div>

        <p className="text-center mt-8 text-sm text-gray-500">
          Bạn mới biết đến K-Market?
          <Link href="/register" className="text-[#ee4d2d] font-bold ml-1 hover:underline">Đăng ký</Link>
        </p>
      </div>
    </div >
  );
}