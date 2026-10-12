"use client";

import {useState, useEffect} from 'react';
import Link from 'next/link';
import {Search} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Popover, PopoverAnchor, PopoverContent} from '@/components/ui/popover';

// Campo di ricerca nell'header: mentre si scrive chiama l'API interna
// /api/search e mostra i risultati in un menu a tendina.
//
// placeholder:             testo di suggerimento nel campo
// search_background_color: colore di sfondo del campo (da Directus)
// search_text_color:       colore di testo e icona (da Directus)
export default function HeaderSearch({placeholder, search_background_color, search_text_color}) {
    // Testo digitato
    const [query, setQuery] = useState('');
    // Risultati restituiti dall'API
    const [results, setResults] = useState([]);
    // Se il menu a tendina dei risultati e' aperto
    const [isOpen, setIsOpen] = useState(false);

    // Ricerca "debounced": non si chiama l'API a ogni tasto, ma solo quando
    // l'utente smette di scrivere per 300 ms.
    useEffect(() => {
        // A ogni modifica di query parte un timer...
        const handler = setTimeout(async () => {
            // ...e la ricerca si fa solo da 3 caratteri in su
            if (query.length > 2) {
                const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
                const data = await res.json();
                // Se la risposta non ha "results" si usa un elenco vuoto
                setResults(data.results ?? []);
                setIsOpen(true);
            } else {
                setResults([]);
                setIsOpen(false);
            }
        }, 300);

        // ...e la funzione restituita annulla il timer precedente prima del
        // successivo: se l'utente scrive ancora entro 300 ms, la vecchia ricerca
        // non parte mai. Questo e' il debounce.
        return () => clearTimeout(handler);
    }, [query]);

    return (
        <Popover open={isOpen && results.length > 0} onOpenChange={setIsOpen}>
            <PopoverAnchor asChild>
                <div
                    className="relative w-full sm:w-auto"
                    style={{
                        "--search_background_color": search_background_color ?? "#ffffff",
                        "--search_text_color": search_text_color ?? "#000000",
                    }}
                >
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--search_text_color)]"/>
                {/* Campo "controllato": il valore mostrato e' sempre quello dello stato
                    query. onFocus riapre il menu se c'e' gia' una ricerca valida. */}
                <Input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => query.length > 2 && setIsOpen(true)}
                    placeholder={placeholder}
                    className="h-10 w-full bg-[var(--search_background_color)] pl-9 text-[var(--search_text_color)] placeholder:text-[var(--search_text_color)] sm:w-[180px]"
                    aria-label="Search"
                    aria-autocomplete="list"
                    aria-expanded={isOpen && results.length > 0}
                />
                </div>
            </PopoverAnchor>

            <PopoverContent
                align="end"
                className="w-[340px] max-w-[90vw] p-1"
                onOpenAutoFocus={(event) => event.preventDefault()}
            >
                <ul className="max-h-80 list-none overflow-y-auto">
                    {results.map((item) => (
                        <li key={item.id}>
                            <Button asChild variant="ghost" className="h-auto w-full justify-start whitespace-normal px-3 py-2 text-left font-normal">
                                <Link href={item.url} onClick={() => {
                                    setIsOpen(false);
                                    setQuery('');
                                }}>
                                    {item.title}
                                </Link>
                            </Button>
                        </li>
                    ))}
                </ul>
            </PopoverContent>
        </Popover>
    );
}