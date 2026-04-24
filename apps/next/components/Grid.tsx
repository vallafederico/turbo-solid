"use client";

import { useEffect, useState } from "react";

function getGridColumns(): number {
  const computed = getComputedStyle(document.documentElement);
  const columns = Number(computed.getPropertyValue("--columns"));

  return Number.isFinite(columns) && columns > 0 ? columns : 12;
}

export default function Grid() {
  const [columns, setColumns] = useState(() => Array.from({ length: 12 }));
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setColumns(Array.from({ length: getGridColumns() }));
    };

    const frame = requestAnimationFrame(() => {
      handleResize();

      const grid = localStorage.getItem("grid");
      if (grid) setVisible(grid === "true");
    });

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!event.shiftKey || event.key.toLowerCase() !== "g") return;

      setVisible((current) => {
        const next = !current;
        localStorage.setItem("grid", String(next));
        return next;
      });
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (!visible) return null;

  return (
    <div className="pointer-events-none fixed top-0 left-0 z-10 flex h-screen w-screen justify-between gap-(--gutter) px-gx">
      {columns.map((_, index) => (
        <div className="grow bg-red-500 opacity-10" key={index} />
      ))}
    </div>
  );
}
