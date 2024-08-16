import { Home, List, LucideIcon, Settings } from 'lucide-react';
import React from 'react';

interface NavItem {
  name: string;
  path: string;
  icon: LucideIcon;
}

const navItems: NavItem[] = [
  { name: 'Home', path: '/', icon: Home },
  { name: 'Tasks', path: '/tasks', icon: List },
  { name: 'Settings', path: '/settings', icon: Settings },
];

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  return (
    <aside
      className={`fixed top-16 left-0 bg-gray-800 text-white w-64 h-[calc(100vh-64px)] flex flex-col transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } z-20`}
    >
      <nav className="flex-1 py-4">
        <ul>
          {navItems.map((item) => (
            <li key={item.path}>
              <a href={item.path} className="flex items-center px-4 py-2 hover:bg-gray-700">
                <item.icon className="mr-3" size={20} />
                {item.name}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
