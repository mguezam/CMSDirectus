"use client";

import Link from 'next/link';

// Briciole di pane ("Home > Sezione > Pagina"). Il percorso arriva gia' pronto
// da getPageByPermalink, quindi qui si limita a disegnarlo.
//
// trail:                elenco di voci { title, href }. href e' null per le voci
//                       senza destinazione (es. i gruppi del menu)
// breadcrumb_color:     colore del testo, impostato in Directus sulla pagina
// breadcrumb_font_size: dimensione del testo in pixel (solo il numero)
export default function Breadcrumb({trail = [], breadcrumb_color, breadcrumb_font_size}) {
    // Nessun percorso: non si disegna nulla. Il controllo copre anche null,
    // che il valore di default "= []" non coprirebbe.
    if (!trail || trail.length === 0) return null;

    // Colore e dimensione vengono passati al CSS come variabili custom
    // (--nome), assegnate qui con lo stile inline e lette piu' sotto con var().
    // Attenzione: se breadcrumb_font_size e' vuoto il risultato e' "undefinedpx"
    // (o "nullpx"), un valore non valido che impedisce di usare il 14px di riserva.
    return (
        <nav aria-label="Breadcrumb" className="breadcrumb"
             style={{"--breadcrumb_font_size": breadcrumb_font_size + "px", "--breadcrumb_color": breadcrumb_color}}>
            {/* "Home" e' sempre presente e sempre cliccabile: non fa parte di trail */}
            <Link href="/">Home</Link>

            {trail.map((crumb, idx) => {
                // L'ultima voce e' la pagina in cui ci si trova
                const isLast = idx === trail.length - 1;
                return (
                    <span key={idx} className="crumb">
                        {/* &gt; e' il simbolo ">" (in JSX e' meglio scriverlo cosi') */}
                        <span className="separator">&gt;</span>
                        {/* Una voce e' un link solo se ha una destinazione e non e'
                            l'ultima. Le altre sono testo semplice; aria-current dice
                            agli screen reader quale e' la pagina corrente. */}
                        {crumb.href && !isLast ? (
                            <Link href={crumb.href}>{crumb.title}</Link>
                        ) : (
                            <span aria-current={isLast ? 'page' : undefined}>{crumb.title}</span>
                        )}
                    </span>
                );
            })}

            <style jsx>{`
                .breadcrumb {
                    background-color: transparent;
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 20px 20px 0;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    /* Valore dalla variabile CSS; il secondo valore (14px) e' la riserva
                       se la variabile non e' definita */
                    font-size: var(--breadcrumb_font_size, 14px);
                    color: var(--breadcrumb_color, blue);
                }

                .crumb {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                /* :global() serve perche' il tag <a> lo crea il componente Link, non
                   questo file: una regola "scoped" normale non lo raggiungerebbe */
                .breadcrumb :global(a) {
                    color: inherit;
                    text-decoration: none;
                }

                .breadcrumb :global(a:hover) {
                    text-decoration: underline;
                }

                .separator {
                    opacity: 0.6;
                }
            `}</style>
        </nav>
    );
}