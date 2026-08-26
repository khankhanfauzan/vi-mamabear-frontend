"use client";

import { Input } from "@/components/ui/input";
import { Search, Clock, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { useProductSearch } from "@/features/products/hooks/useProductSearch";

export function SearchBar() {
  const {
    query,
    setQuery,
    suggestions,
    isSearching,
    showSuggestions,
    setShowSuggestions,
    recentSearches,
    saveRecentSearch,
    removeRecentSearch,
  } = useProductSearch();

  const router = useRouter();
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setShowSuggestions]);

  const handleSearchSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && query.trim()) {
      setShowSuggestions(false);
      saveRecentSearch(query);
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleSuggestionClick = (term: string) => {
    setShowSuggestions(false);
    saveRecentSearch(term);
  };

  return (
    <div className="flex-1 max-w-xl relative" ref={searchContainerRef}>
      <Search
        className="text-muted-foreground absolute left-3 md:left-4 top-1/2 -translate-y-1/2 z-10 w-4 h-4 md:w-5 md:h-5"
        strokeWidth="3"
      />
      <Input
        type="text"
        placeholder="Cari produk..."
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setShowSuggestions(true);
        }}
        onFocus={() => setShowSuggestions(true)}
        onKeyDown={handleSearchSubmit}
        className="w-full bg-white border-pink-100 pl-9 md:pl-14 focus-visible:ring-primary rounded-lg py-3 md:py-5 text-sm md:text-base h-9 md:h-12"
      />

      {/* Suggestions Dropdown */}
      {showSuggestions && (query.trim() || recentSearches?.length > 0) && (
        <div className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-lg border border-pink-100 overflow-hidden z-50">
          {query.trim() ? (
            isSearching ? (
              <div className="p-4 text-center text-[var(--color-gray)]">
                <span className="animate-pulse text-font-2">Mencari...</span>
              </div>
            ) : suggestions.length > 0 ? (
              <ul className="max-h-64 overflow-y-auto">
                {suggestions.map((suggestion, idx) => (
                  <li key={idx}>
                    <Link
                      href={`/search?q=${encodeURIComponent(suggestion.name)}`}
                      onClick={() => handleSuggestionClick(suggestion.name)}
                      className="block px-4 py-3 text-font-2 text-[var(--color-gray)] hover:bg-[var(--mama-pink)] hover:text-[var(--mama-brown)] transition-colors"
                    >
                      {suggestion.name}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-4 text-center text-font-2 text-[var(--color-light-gray)]">
                Tidak ada saran ditemukan.
              </div>
            )
          ) : (
            <div className="py-2">
              <div className="px-4 py-2 text-xs font-semibold text-[var(--color-light-gray)] uppercase tracking-wider">
                Pencarian Terakhir
              </div>
              <ul>
                {recentSearches.map((term: string, idx: number) => (
                  <li
                    key={idx}
                    className="flex items-start justify-between px-4 py-2 hover:bg-[var(--mama-pink)]/50 group transition-colors"
                  >
                    <Link
                      href={`/search?q=${encodeURIComponent(term)}`}
                      onClick={() => handleSuggestionClick(term)}
                      className="flex items-start gap-3 flex-1 min-w-0 text-font-2 text-[var(--color-gray)] group-hover:text-[var(--mama-brown)]"
                    >
                      <Clock className="w-4 h-4 text-muted-foreground shrink-0 my-auto" />
                      <span className="break-words whitespace-normal">
                        {term}
                      </span>
                    </Link>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        removeRecentSearch(term);
                      }}
                      className="p-1 shrink-0 ml-2 text-muted-foreground hover:text-red-500 transition-colors rounded-full"
                      aria-label="Hapus pencarian"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
