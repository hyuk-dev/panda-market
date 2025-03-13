import { ReactNode } from "react";
import Footer from "./Footer";
import Header from "./Header";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div>
      <Header />
      <div className="flex xl:w-[1200px] md:w-[100%] justify-center xl:m-auto md:px-4 px-2 min-h-[100vh]">{children}</div>
      <Footer />
    </div>
  );
}
