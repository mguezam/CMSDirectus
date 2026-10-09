"use client";

import {useState, useEffect, useRef} from 'react';
import Link from 'next/link';

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
    // Riferimento al contenitore, usato per capire se un click e' avvenuto fuori
    const containerRef = useRef(null);

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

    // Chiude il menu quando si clicca fuori dal componente
    useEffect(() => {
        const onClickOutside = (e) => {
            // Se il click non e' avvenuto dentro il contenitore, chiude
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        // Un solo ascoltatore sull'intero documento, registrato al montaggio...
        document.addEventListener('mousedown', onClickOutside);
        // ...e rimosso allo smontaggio, per non lasciare ascoltatori orfani
        return () => document.removeEventListener('mousedown', onClickOutside);
    }, []);

    return (
        // I colori arrivano al CSS come variabili custom (assegnate qui, lette
        // con var() nello stile piu' sotto)
        <div className="search-container" ref={containerRef}
             style={{"--search_background_color": search_background_color}}>
            <div className="search-input-wrapper" style={{"--search_text_color": search_text_color}}>
                {/* Icona della lente: usa "currentColor", quindi prende il colore del
                    testo del contenitore */}
                <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"/>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                {/* Campo "controllato": il valore mostrato e' sempre quello dello stato
                    query. onFocus riapre il menu se c'e' gia' una ricerca valida. */}
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

            {/* Il menu appare solo se e' aperto e c'e' almeno un risultato */}
            {isOpen && results.length > 0 && (
                <ul className="search-results">
                    {results.map((item) => (
                        <li key={item.id}>
                            {/* Dopo il click si chiude il menu e si svuota il campo */}
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
                    /* Serve per posizionare il menu dei risultati rispetto a questo
                       contenitore */
                    position: relative;
                }

                .search-input-wrapper {
                    /* Colori dalle variabili assegnate sopra; il secondo valore e' la
                       riserva se mancano */
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

                /* Quando il campo e' attivo lo sfondo diventa bianco (il colore del
                   testo resta quello di Directus, quindi un testo chiaro diventa
                   illeggibile) */
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

                /* Menu a tendina dei risultati, sotto il campo e allineato a destra */
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
                    /* Titoli lunghi: una sola riga, tagliata con i puntini */
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                .search-results li a:hover {
                    background: #ebf8ff;
                    color: #2b6cb0;
                }

                /* Su schermi stretti il campo occupa tutta la larghezza */
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