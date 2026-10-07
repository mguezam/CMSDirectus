"use client";

import {useState, useEffect, useRef} from 'react';
import Link from 'next/link';

export default function HeaderSearch({placeholder, search_background_color, search_text_color}) {
    console.log('HeaderSearch props:', {placeholder, search_background_color, search_text_color});

    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    // Debounced fetch
    useEffect(() => {
        const handler = setTimeout(async () => {
            if (query.length > 2) {
                const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
                const data = await res.json();
                setResults(data.results ?? []);
                setIsOpen(true);
            } else {
                setResults([]);
                setIsOpen(false);
            }
        }, 300);

        return () => clearTimeout(handler);
    }, [query]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const onClickOutside = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', onClickOutside);
        return () => document.removeEventListener('mousedown', onClickOutside);
    }, []);

    return (
        <div className="search-container" ref={containerRef} style={{"--search_background_color": search_background_color}}>
            <div className="search-input-wrapper" style={{"--search_text_color": search_text_color}}>
                <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"/>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => query.length > 2 && setIsOpen(true)}
                    placeholder={placeholder}
                    className="search-input"
                    aria-label="Search"
                />
            </div>

            {isOpen && results.length > 0 && (
                <ul className="search-results">
                    {results.map((item) => (
                        <li key={item.id}>
                            <Link href={item.url} onClick={() => {
                                setIsOpen(false);
                                setQuery('');
                            }}>
                                {item.title}
                            </Link>
                        </li>
                    ))}
                </ul>
            )}

            <style jsx>{`
                .search-container {
                    position: relative;
                }

                .search-input-wrapper {
                    color: var(--search_text_color, black);
                    background-color: var(--search_background_color, black);
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    border: 1px solid #e2e8f0;
                    border-radius: 8px;
                    padding: 8px 12px;
                    transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
                }

                .search-input-wrapper:focus-within {
                    background: #ffffff;
                    border-color: #3182ce;
                    box-shadow: 0 0 0 3px rgba(49, 130, 206, 0.15);
                }

                .search-icon {
                    color: inherit;
                    flex-shrink: 0;
                }

                .search-input {
                    border: none;
                    outline: none;
                    background: transparent;
                    font-size: 15px;
                    color: inherit;
                    width: 140px;
                    font-family: inherit;
                }

                .search-input::placeholder {
                    color: inherit;
                }

                .search-results {
                    position: absolute;
                    top: calc(100% + 8px);
                    right: 0;
                    width: 340px;
                    max-width: 90vw;
                    max-height: 320px;
                    overflow-y: auto;
                    list-style: none;
                    margin: 0;
                    padding: 6px;
                    background: #ffffff;
                    border: 1px solid #e2e8f0;
                    border-radius: 8px;
                    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
                    z-index: 200;
                }

                .search-results li a {
                    display: block;
                    padding: 10px 12px;
                    border-radius: 6px;
                    color: #1a202c;
                    text-decoration: none;
                    font-size: 15px;
                    line-height: 1.4;
                    transition: background 0.15s, color 0.15s;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                .search-results li a:hover {
                    background: #ebf8ff;
                    color: #2b6cb0;
                }

                @media (max-width: 768px) {
                    .search-container {
                        width: 100%;
                    }

                    .search-input {
                        width: 100%;
                    }
                }
            `}</style>
        </div>
    );
}