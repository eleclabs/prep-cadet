// components/Providers.tsx
'use client'; // สำคัญมาก: ต้องประกาศว่าเป็น Client Component

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function Providers({ children }: Props) {
  return <SessionProvider>{children}</SessionProvider>;
}