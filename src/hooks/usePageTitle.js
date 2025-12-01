import { useEffect } from "react";

export default function usePageTitle(title) {
  useEffect(() => {
    document.title = `Albumo Captura | ${title}`;
  }, [title]);
}
