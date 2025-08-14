// src/app/admin/layout.tsx

import { FC, ReactNode } from "react";
import Sidebar from "./components/Sidebar";

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout: FC<AdminLayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-100">{children}</div>
    </div>
  );
};

export default AdminLayout;
