import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-orange-500 text-white font-bold">
      Đang kiểm tra...
      <AuthenticateWithRedirectCallback />
    </div>
  );
}