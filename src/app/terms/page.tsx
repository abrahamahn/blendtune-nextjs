// src\app\terms\page.tsx
"use client";
import React, { useEffect, useState } from "react";

// Terms page component
const Terms: React.FC = () => {
  const [htmlContent, setHtmlContent] = useState<string>("");

  useEffect(() => {
    fetch("/html/terms.html")
      .then((response) => response.text())
      .then((data) => {
        setHtmlContent(data);
      });
  }, []);

  return (
    <div className="w-full h-full overflow-scroll z-auto bg-opacity-80 bg-neutral-200 dark:bg-gray-900 rounded-xl flex justify-center items-center">
      <div className="w-4/5 h-full pt-20 text-black dark:text-white">
        {/* Render fetched terms content */}
        <div className="w-full" dangerouslySetInnerHTML={{ __html: htmlContent }}></div>
      </div>
    </div>
  );
};

export default Terms;