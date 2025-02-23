// src/app/privacy-policy/page.tsx
"use client";

import React, { useEffect, useState } from "react";

/**
 * PrivacyPolicy Component:
 * - Fetches and displays the privacy policy from a static HTML file.
 * - Uses `dangerouslySetInnerHTML` to render raw HTML content.
 */
const PrivacyPolicy: React.FC = () => {
  const [htmlContent, setHtmlContent] = useState<string>("");

  useEffect(() => {
    fetch("/html/privacy-policy.html")
      .then((response) => response.text())
      .then((data) => setHtmlContent(data));
  }, []);

  return (
    <div className="w-full h-full overflow-scroll z-auto bg-opacity-80 bg-neutral-200 dark:bg-gray-900 rounded-xl flex justify-center items-center">
      <div className="w-4/5 h-full pt-20 text-black dark:text-white">
        <div className="w-full" dangerouslySetInnerHTML={{ __html: htmlContent }}></div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
