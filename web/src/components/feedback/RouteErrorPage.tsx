import { Link, isRouteErrorResponse, useRouteError } from "react-router-dom";
import { Button } from "@/components/ui/Button";

export function RouteErrorPage() {
  const error = useRouteError();
  const title = isRouteErrorResponse(error) && error.status === 404
    ? "Không tìm thấy trang"
    : "Trang chưa thể hiển thị";

  return (
    <main className="flex min-h-dvh items-center justify-center bg-white px-4 text-center text-black">
      <div className="max-w-md">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-black/45">SHOP.CO</p>
        <h1 className="mt-4 text-3xl font-black">{title}</h1>
        <p className="mt-3 text-sm leading-6 text-black/60">
          Đã có lỗi ngoài ý muốn. Bạn có thể tải lại trang hoặc quay về trang chủ để tiếp tục mua sắm.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Button onClick={() => window.location.reload()}>Tải lại trang</Button>
          <Link className="inline-flex min-h-11 items-center justify-center rounded-full border border-black/15 px-5 text-sm font-medium transition hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2" to="/">
            Về trang chủ
          </Link>
        </div>
      </div>
    </main>
  );
}
