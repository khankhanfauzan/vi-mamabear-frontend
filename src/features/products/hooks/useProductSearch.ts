import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { searchService } from "@/features/products/services/searchService";
import { SearchSuggestion } from "@/features/products/types/search.types";

export function useProductSearch() {
  const searchParams = useSearchParams();
  const urlQuery = searchParams.get("q") || "";

  const [query, setQuery] = useState(urlQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(urlQuery);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // Load recent searches on mount
  useEffect(() => {
    const stored = localStorage.getItem("recentSearches");
    if (stored) {
      try {
        setRecentSearches(JSON.parse(stored));
      } catch {}
    }
  }, []);

  const saveRecentSearch = (term: string) => {
    const trimmed = term.trim();
    if (!trimmed) return;

    setRecentSearches((prev) => {
      // Add new term to the front, remove duplicates, and keep the latest 5
      const updated = [trimmed, ...prev.filter((t) => t !== trimmed)].slice(
        0,
        5,
      );
      localStorage.setItem("recentSearches", JSON.stringify(updated));
      return updated;
    });
  };

  const removeRecentSearch = (term: string) => {
    setRecentSearches((prev) => {
      const updated = prev.filter((t) => t !== term);
      localStorage.setItem("recentSearches", JSON.stringify(updated));
      return updated;
    });
  };

  // Sync local input state if URL changes externally (e.g. Back button)
  useEffect(() => {
    setQuery(urlQuery);
  }, [urlQuery]);

  // Debounce effect
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);
    return () => clearTimeout(handler);
  }, [query]);

  // Fetch suggestions effect
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!debouncedQuery.trim()) {
        setSuggestions([]);
        return;
      }
      setIsSearching(true);
      try {
        const res = await searchService.getSuggestions(debouncedQuery);
        if (res.success) {
          setSuggestions(res.data);
        }
      } catch (error) {
        console.error("Failed to fetch suggestions:", error);
      } finally {
        setIsSearching(false);
      }
    };
    fetchSuggestions();
  }, [debouncedQuery]);

  return {
    query,
    setQuery,
    suggestions,
    isSearching,
    showSuggestions,
    setShowSuggestions,
    recentSearches,
    saveRecentSearch,
    removeRecentSearch,
  };
}
