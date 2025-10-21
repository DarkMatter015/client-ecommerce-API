import { Outlet } from "react-router-dom";

export function LayoutLoginRegister() {
  return (
    <>
      <main>
        <Outlet />
      </main>
    </>
  );
}