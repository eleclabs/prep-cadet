// middleware.ts
export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/admin/:path*"], // ป้องกันทุกเส้นทางที่ขึ้นต้นด้วย /admin
};