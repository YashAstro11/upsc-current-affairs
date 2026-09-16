import { useLocalStorage } from "./useLocalStorage";

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useLocalStorage<string[]>("upsc_bookmarks", []);

  const toggleBookmark = (id: string) => {
    setBookmarks((prev) => {
      if (prev.includes(id)) {
        return prev.filter((bookmarkId) => bookmarkId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const isBookmarked = (id: string) => bookmarks.includes(id);

  return { bookmarks, toggleBookmark, isBookmarked };
}
