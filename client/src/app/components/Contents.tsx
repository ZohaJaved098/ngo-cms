import React from "react";
type ContentProps = {
  shortened?: boolean;
  content: string;
};
const Contents: React.FC<ContentProps> = ({ shortened, content }) => {
  return (
    <p
      className={`text-gray-700 text-sm ${
        shortened && "line-clamp-2"
      } prose-content`}
      dangerouslySetInnerHTML={{ __html: content }}
    ></p>
  );
};

export default Contents;
