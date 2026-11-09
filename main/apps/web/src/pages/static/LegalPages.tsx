// main/apps/web/src/pages/static/LegalPages.tsx
import React, { useState, useEffect } from 'react';
import { StaticLayout } from './StaticLayout';

const StaticHtmlDocument: React.FC<{ url: string }> = ({ url }) => {
  const [htmlContent, setHtmlContent] = useState<string>('');

  useEffect(() => {
    fetch(url)
      .then((response) => response.text())
      .then((data) => setHtmlContent(data));
  }, [url]);

  return (
    <div className="static-prose">
      <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
    </div>
  );
};

export const TermsPage: React.FC = () => (
  <StaticLayout>
    <StaticHtmlDocument url="/html/terms.html" />
  </StaticLayout>
);

export const PrivacyPolicyPage: React.FC = () => (
  <StaticLayout>
    <StaticHtmlDocument url="/html/privacy-policy.html" />
  </StaticLayout>
);
