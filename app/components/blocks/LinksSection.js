"use client";

import Link from 'next/link';

// Blocco "Links": mostra una riga di collegamenti orizzontali, uno accanto
// all'altro, con titolo opzionale sopra.
//
// title:            intestazione della sezione (opzionale)
// items:            array di oggetti { label, url } scritti dall'editor
// background_color: colore di sfondo della sezione (da Directus)
// text_color:       colore del titolo e delle etichette (da Directus)
export default function LinksSection({title, items = [], background_color, text_color}) {
    return (
        <section
            className="links-section"
            style={{
                // Due variabili CSS lette dallo <style jsx> qui sotto. Se il
                // valore da Directus manca, si usa il fallback definito nel CSS.
                "--links-background": background_color,
                "--links-text": text_color,
            }}
        >
            <div className="container">
                {title && <h2>{title}</h2>}

                <div className="links-row">
                    {/* key={idx} e' accettabile qui perche' la lista non viene
                        riordinata: gli elementi cambiano solo se l'editor
                        modifica il repeater in Directus. */}
                    {items.map((item, idx) => (
                        <Link key={idx} href={item.url} className="link-card">
                            {item.label}
                        </Link>
                    ))}
                </div>
            </div>

            <style jsx>{`
                .links-section {
                    padding: 60px 0;
                    background-color: var(--links-background, #ffffff);
                }

                .container {
                    max-width: 1400px;
                    margin: 0 auto;
                    padding: 0 40px;
                }

                h2 {
                    font-size: 28px;
                    font-weight: bold;
                    color: var(--links-text, #1a202c);
                    margin-bottom: 30px;
                }

                .link-card:hover {
                    border-color: #3182ce;
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
                    color: #3182ce;
                }

                /* Griglia a 4 colonne: le card occupano tutta la larghezza
                   disponibile, come la griglia dei post. */
                .links-row {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 1rem;
                    width: 100%;
                }

                /* :global() serve perche' <Link> di Next.js non e' un elemento
                   scritto direttamente qui: la classe .link-card non riceve
                   l'hash di styled-jsx sui link renderizzati, quindi le regole
                   normali non li raggiungerebbero. Il prefisso .links-row
                   mantiene comunque lo scoping al componente. */
                .links-row :global(.link-card) {
                    padding: 20px;
                    /* color-mix() crea uno sfondo traslucido che prende il
                       colore del testo: funziona sia su sfondi chiari che
                       scuri, senza dover scegliere un colore fisso. */
                    background-color: color-mix(in srgb, var(--links-text, #2d3748) 8%, transparent);
                    border: 1px solid color-mix(in srgb, var(--links-text, #2d3748) 20%, transparent);
                    border-radius: 8px;
                    text-decoration: none;
                    color: var(--links-text, #2d3748);
                    font-weight: 600;
                    text-align: center;
                    transition: background-color 0.2s, border-color 0.2s, transform 0.2s;
                }

                .links-row :global(.link-card:hover) {
                    background-color: color-mix(in srgb, var(--links-text, #2d3748) 15%, transparent);
                    border-color: color-mix(in srgb, var(--links-text, #2d3748) 40%, transparent);
                    transform: translateY(-2px);
                }

                /* 4 colonne su desktop, 2 su tablet, 1 su mobile */
                @media (max-width: 1024px) {
                    .links-row {
                        grid-template-columns: repeat(2, 1fr);
                    }
                }

                @media (max-width: 600px) {
                    .links-row {
                        grid-template-columns: 1fr;
                    }
                }`}</style>
        </section>
    );
}