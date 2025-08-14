// src/app/admin/components/Sidebar.tsx

import { FC } from "react";

const Sidebar: FC = () => {
  return (
    <div className="w-64 h-full bg-gray-800 text-white">
      
      <nav className="mt-4">
        <ul className="space-y-4">
          <li>
            <a
              href="#"
              className="block py-2 px-4 rounded-md hover:bg-gray-700"
            >
              Dashboard
            </a>
          </li>
          <li>
            <a
              href="#"
              className="block py-2 px-4 rounded-md hover:bg-gray-700"
            >
              Users
            </a>
          </li>
          <li>
            <a
              href="#"
              className="block py-2 px-4 rounded-md hover:bg-gray-700"
            >
              Settings
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
