import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";

export const SlideTabs = () => {
  const location = useLocation();
  const [position, setPosition] = useState({
    left: 0,
    width: 0,
    opacity: 0,
  });
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const tabs = [
    { label: "Home", path: "/" },
    { label: "Features", path: "/features" },
    { label: "Demo", path: "/demo" },
    { label: "Integrations", path: "/integrations" },
    { label: "Chatbot", path: "/chatbot" },
    { label: "Contact", path: "/contact" },
  ];

  // Find the selected index based on the current URL
  const selectedIndex = tabs.findIndex(tab => tab.path === location.pathname);
  // Default to 0 if not found
  const selected = selectedIndex === -1 ? 0 : selectedIndex;
  
  const tabsRef = useRef<(HTMLLIElement | null)[]>([]);

  // This effect runs when the component mounts or when the selected tab changes.
  useEffect(() => {
    // Need a tiny timeout to ensure DOM layout is calculated
    const timer = setTimeout(() => {
      const selectedTab = tabsRef.current[selected];
      if (selectedTab) {
        const { width } = selectedTab.getBoundingClientRect();
        setPosition({
          left: selectedTab.offsetLeft,
          width,
          opacity: 1,
        });
        setHoveredIndex(selected);
      }
    }, 50);
    return () => clearTimeout(timer);
  }, [selected]);

  return (
    <ul
      onMouseLeave={() => {
        // When the mouse leaves the container, reset the cursor
        // to the position of the currently selected tab.
        setHoveredIndex(selected);
        const selectedTab = tabsRef.current[selected];
        if (selectedTab) {
            const { width } = selectedTab.getBoundingClientRect();
            setPosition({
                left: selectedTab.offsetLeft,
                width,
                opacity: 1,
            });
        }
      }}
      className="relative mx-auto flex w-fit rounded-full bg-background/50 backdrop-blur-md p-1 ring-1 ring-white/10"
    >
      {tabs.map((tab, i) => (
         <Tab
            key={tab.path}
            ref={(el) => (tabsRef.current[i] = el)}
            setPosition={setPosition}
            path={tab.path}
            isHovered={hoveredIndex === i}
            onHover={() => setHoveredIndex(i)}
          >
            {tab.label}
        </Tab>
      ))}

      <Cursor position={position} />
    </ul>
  );
};

// The Tab component is wrapped in forwardRef to accept a ref from its parent.
interface TabProps {
  children: React.ReactNode;
  setPosition: (pos: { left: number; width: number; opacity: number }) => void;
  path: string;
  isHovered: boolean;
  onHover: () => void;
}

const Tab = React.forwardRef<HTMLLIElement, TabProps>(({ children, setPosition, path, isHovered, onHover }, ref) => {
  return (
    <li
      ref={ref}
      onMouseEnter={(e) => {
        onHover();
        const el = e.currentTarget;
        const { width } = el.getBoundingClientRect();

        setPosition({
          left: el.offsetLeft,
          width,
          opacity: 1,
        });
      }}
      className="relative z-10 block"
    >
      <Link 
        to={path}
        className={`block cursor-pointer px-3 py-1.5 text-xs md:px-5 md:py-2 md:text-sm font-medium transition-colors duration-200 ${
          isHovered ? 'text-black dark:text-black' : 'text-foreground mix-blend-difference'
        }`}
      >
        {children}
      </Link>
    </li>
  );
});

Tab.displayName = "Tab";

const Cursor = ({ position }: { position: { left: number; width: number; opacity: number } }) => {
  return (
    <motion.li
      animate={{
        ...position,
      }}
      className="absolute z-0 h-8 md:h-[36px] top-1 rounded-full bg-white"
    />
  );
};
