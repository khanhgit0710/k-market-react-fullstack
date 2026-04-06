"use client";

import { useEffect, useState, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  /** Kích thước / layout placeholder (tránh nhảy layout quá lớn) */
  fallbackClassName?: string;
};

/**
 * Chỉ render children sau khi client đã mount. Giúp tránh hydration mismatch khi
 * extension trình duyệt (ví dụ Dark Reader) sửa SVG trên DOM trước khi React hydrate.
 */
export default function SafeClientVisual({
  children,
  fallbackClassName = "inline-flex h-5 w-5 shrink-0 items-center justify-center align-middle",
}: Props) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setReady(true);
  }, []);
  if (!ready) {
    return <span className={fallbackClassName} aria-hidden />;
  }
  return <>{children}</>;
}
