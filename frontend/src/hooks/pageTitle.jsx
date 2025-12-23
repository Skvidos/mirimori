import { useEffect } from "react";

function PageTitle({ title, children }) {
  useEffect(() => {
    document.title = title;
  }, [title]);

  return children;
}

export default PageTitle;
