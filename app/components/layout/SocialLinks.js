import Image from "next/image";

// Riga con la scritta (es. "Seguici su") e le icone dei social, usata nella barra
// superiore dell'header.
//
// links: elenco di { platform, url } (il repeater "social_links" di Directus)
// label: testo davanti alle icone
// color: colore del testo, dal campo del menu in Directus
export default function SocialLinks({links, label, color}) {
    // Nessun link salvato: non si disegna nulla, ne' icone ne' scritta
    if (!links || links.length === 0) {
        return null;
    }

    return (
        <div className="social-links">
            {/* --color e' una variabile CSS assegnata qui e letta piu' sotto con
                var(--color, white). Se "color" e' undefined la proprieta' non viene
                scritta e vale il bianco di riserva. */}
            <span className={"socialLabel"} style={{'--color': color}}>{label}</span>
            {links.map((link, idx) => (
                // Il link si apre in una nuova scheda. rel="noopener noreferrer"
                // impedisce alla pagina aperta di accedere a questa.
                // aria-label da' un nome al link per gli screen reader, dato che
                // dentro c'e' solo un'immagine.
                <a
                    key={idx}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.platform}
                >
                    {/* L'icona si chiama come il valore di "platform" (es. facebook ->
                        public/icons/facebook.svg). alt="" perche' l'immagine e' solo
                        decorativa: il nome lo da' l'aria-label del link. */}
                    <Image src={`/icons/${link.platform}.svg`} alt="" width={22} height={22}/>
                </a>
            ))}

            <style jsx>{`
                .social-links {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }
                .socialLabel {
                    color: var(--color, white);
                }
                a {
                    display: inline-flex;
                }

                a:hover {
                    opacity: 0.7;
                }
            `}</style>
        </div>
    );
}