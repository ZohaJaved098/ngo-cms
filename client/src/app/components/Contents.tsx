import React from "react";
type ContentProps = {
  shortened?: boolean;
  content: string;
};
const Contents: React.FC<ContentProps> = ({ shortened, content }) => {
  return (
    <p
      className={` text-sm ${
        shortened ? "line-clamp-2 max-w-fit" : " text-gray-700 prose-content"
      }`}
      dangerouslySetInnerHTML={{ __html: content }}
    ></p>
  );
};

export default Contents;
