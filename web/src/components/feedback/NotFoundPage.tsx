import { Link } from "react-router-dom";

export function NotFoundPage() {
  return <main className="flex min-h-[60vh] items-center justify-center px-4 text-center"><div><p className="text-7xl font-black">404</p><h1 className="mt-3 text-2xl font-bold">Không tìm thấy trang</h1><p className="mt-2 text-black/60">Đường dẫn bạn yêu cầu không tồn tại hoặc đã được di chuyển.</p><Link to="/" className="mt-6 inline-flex min-h-11 items-center rounded-full bg-black px-6 text-sm text-white">Về trang chủ</Link></div></main>;
}
