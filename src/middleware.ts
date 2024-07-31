import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized({ token, req }) {
      const publicRoutes = ["/login", "/register"];
      return publicRoutes.includes(req.nextUrl.pathname) || !!token;
    },
  },
});

export const config = {
  matcher: ["/:path*"],
};
