import { Outlet, useLocation } from "react-router-dom";
import TopMenu from "@/components/top-menu";
import Footer from "../footer";

export function Layout() {
  const location = useLocation();
  const isHome = location.pathname === '/' || location.pathname === '/home';

  return (
    <>
      <TopMenu />
      <main className={isHome ? 'home-main' : undefined}>
        <Outlet />
      </main>
      <Footer/>
    </>
  );
}