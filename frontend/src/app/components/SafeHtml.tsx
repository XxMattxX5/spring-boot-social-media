import React from "react";
import DOMPurify from "dompurify";

type SafeHtmlProps = {
  html: string;
};

const SafeHtml = async ({ html }: SafeHtmlProps) => {
  let sanitizedHtml;

  if (typeof window === "undefined") {
    const { JSDOM } = await import("jsdom");
    const window = new JSDOM("").window;
    const purify = DOMPurify(window);
    sanitizedHtml = purify.sanitize(html);
  } else {
    sanitizedHtml = DOMPurify.sanitize(html);
  }

  return <div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />;
};

export default SafeHtml;
