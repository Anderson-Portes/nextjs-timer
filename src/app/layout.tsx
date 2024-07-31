"use client";

import { PropsWithChildren } from "react";
import "../assets/css/tailwind.css";
import { SessionProvider } from "next-auth/react";

const BaseLayout = ({ children }: PropsWithChildren) => {
  return (
    <html lang="en">
      <SessionProvider>
        <body>{children}</body>
      </SessionProvider>
    </html>
  );
};

export default BaseLayout;
