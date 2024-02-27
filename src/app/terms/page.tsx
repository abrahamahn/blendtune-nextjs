"use client";
import React, { useEffect, useState } from "react";

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
    <div className="flex justify-center items-center">
      <div className="w-4/5 p-10 mt-16 text-black dark:text-white rounded-lg">
        <div
          className="w-full overflow-scroll z-auto text-black dark:text-white"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        ></div>
      </div>
    </div>
  );
};

export default Terms;
