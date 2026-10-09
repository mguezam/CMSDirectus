"use client";

import Link from 'next/link';
import HeaderSearch from './HeaderSearch';
import Image from "next/image";
import SocialLinks from './SocialLinks';

// Header del sito, su due righe: in alto logo, nome e (a destra) social e ricerca;
// sotto la barra con il menu principale. Colori e altezza sono impostabili in Directus.
//
// navigation: tutti i menu letti da Directus; qui si usa quello "Main Navigation"
export default function Header({navigation}) {
    // Si cerca tra i menu quello con titolo "Main Navigation"
    const headerNavigation = navigation.filter((nav) => nav.title === 'Main Navigation')[0];

    // Menu assente o senza voci: l'header non viene mostrato.
    // Il controllo deve restare PRIMA delle letture qui sotto, altrimenti un menu
    // mancante farebbe andare in errore la pagina.
    if (!headerNavigation || headerNavigation.items?.length === 0) {
        return null;
    }

    // Valori configurabili da Directus. Un campo non compilato arriva come null.
    const backgroundColor = headerNavigation.background_color; // sfondo della barra del menu
    const topBarColor = headerNavigation.top_bar_color;         // sfondo della barra in alto
    const height = headerNavigation.height;                     // altezza della barra in alto (px)
    const logo = headerNavigation.logo;                         // file immagine del logo
    const socialLinks = headerNavigation.social_links           // elenco { platform, url }
    const socialLinksLabel = headerNavigation.social_links_label; // scritta davanti alle icone
    const socialLinksColor = headerNavigation.social_links_color;  // colore di quella scritta

    return (
        <header className="site-header">
            {/* Riga superiore */}
            <div className="top-bar">
                <div className="container top-container">
                    <div className="logo">
                        {/* Il logo si mostra solo se e' stato impostato in Directus. Il token
                            nell'URL serve perche' Next.js scarica l'immagine da Directus senza
                            passare dal client: ?access_token=... la autorizza. Con
                            NEXT_PUBLIC_ il token e' visibile nel browser (va bene solo in
                            locale). width/height sono le dimensioni reali per cui Next
                            genera il file; la dimensione mostrata dipende dallo stile. */}
                        {logo && (
                            <Image
                                src={`http://localhost:8055/assets/${logo.id}?access_token=${process.env.NEXT_PUBLIC_DIRECTUS_TOKEN}`}
                                alt={logo.filename_download || 'Logo'}
                                width={70}
                                height={70}
                                style={{objectFit: 'contain', width: 'auto', height: 'auto'}}
                            />
                        )}
                        <Link href="/">
                            {/* Il nome del sito e' scritto direttamente nel codice, non viene
                                da Directus */}
                            <span className="logo-text">Consorzio di Bonifica Adige Po</span>
                        </Link>
                    </div>
                    {/* A destra: icone dei social sopra e campo di ricerca sotto */}
                    <div className="top-right">
                        <SocialLinks links={socialLinks} label={socialLinksLabel} color={socialLinksColor}/>
                        {/* La ricerca compare solo se attivata in Directus; "??" usa il
                            testo "Cerca..." quando il placeholder non e' impostato */}
                        {headerNavigation.search_enabled && (
                            <HeaderSearch placeholder={headerNavigation.search_placeholder ?? 'Cerca...'}
                                          search_background_color={headerNavigation.search_background_color} search_text_color={headerNavigation.search_text_color}/>
                        )}
                    </div>
                </div>
            </div>

            {/* Riga inferiore: il menu principale */}
            <nav className="nav-bar">
                <div className="container nav-container">
                    <div className="main-nav">
                        {headerNavigation.items.map((item) => (
                            <NavigationItem key={item.id} item={item}/>
                        ))}
                    </div>
                </div>
            </nav>

            {/* Stile "scoped": le regole valgono solo per gli elementi scritti in questo
                componente. Le espressioni ${...} inseriscono nel CSS i valori letti da
                Directus, con una riserva (dopo "??") se il campo e' vuoto. */}
            <style jsx>{`
                /* Header sempre visibile in alto anche scorrendo la pagina */
                .site-header {
                    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
                    position: sticky;
                    top: 0;
                    z-index: 100;
                }

                /* Colonna centrale: parte comune alle due righe. Usa flex per
                   centrare verticalmente il contenuto. */
                .container {
                    max-width: 1400px;
                    margin: 0 auto;
                    padding: 0 20px;
                    display: flex;
                    align-items: center;
                }

                /* L'altezza della riga in alto viene da Directus (default 80px) */
                .top-container {
                    height: ${height ?? 80}px;
                    justify-content: space-between;
                }

                .top-bar {
                    background-color: ${topBarColor ?? '#ffffff'};
                }

                .nav-bar {
                    background-color: ${backgroundColor ?? '#ffffff'};
                }

                .nav-container {
                    height: 48px;
                    justify-content: flex-start;
                }

                /* Social e ricerca impilati verticalmente e allineati a destra */
                .top-right {
                    display: flex;
                    flex-direction: column;
                    align-items: flex-end;
                    gap: 8px;
                }

                .logo {
                    display: flex;
                    font-size: 25px;
                    font-weight: 700;
                    align-items: center;
                    flex-shrink: 1;
                    min-width: 0;
                    gap: 20px;
                }

                .logo-text {
                    color: #3182ce;
                    text-decoration: none;
                }

                /* Schermi stretti: le due parti dell'header si dispongono in colonna e
                   l'altezza fissa viene sostituita da quella automatica */
                @media (max-width: 768px) {
                    .container {
                        flex-direction: column;
                        height: auto;
                        padding: 20px;
                    }

                    .logo {
                        margin-bottom: 20px;
                    }

                }
            `}</style>
            {/* Stile "global": queste regole valgono per tutta la pagina, e servono
                perche' gli elementi del menu sono scritti nelle funzioni qui sotto e
                nei componenti Link. I nomi delle classi (nav-..., main-nav) sono
                abbastanza specifici da non toccare altro. */}
            <style jsx global>{`
                .nav-dropdown {
                    /* Il pannello a tendina si posiziona rispetto a questo elemento */
                    position: relative;
                }

                /* Titolo del menu a tendina; --item-color e' impostata in linea da
                   DropdownItem, il grigio e' la riserva */
                .nav-dropdown-trigger {
                    color: var(--item-color, #4a5568);
                    font-size: 16px;
                    font-weight: 500;
                    cursor: pointer;
                    white-space: nowrap;
                }

                .nav-dropdown:hover .nav-dropdown-trigger {
                    color: #3182ce;
                }

                /* Pannello a tendina: nascosto finche' non si passa il mouse. Sta fuori dal
                   flusso (absolute) e sotto il titolo (top: 100%). */
                .nav-dropdown-panel {
                    display: none;
                    position: absolute;
                    top: 100%;
                    left: 0;
                    gap: 40px;
                    min-width: 400px;
                    padding: 20px;
                    background: #ffffff;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                    border-radius: 6px;
                }

                /* Al passaggio del mouse il pannello diventa visibile, con le colonne
                   una accanto all'altra (flex). Funziona solo con il mouse: su touch
                   non c'e' hover. */
                .nav-dropdown:hover .nav-dropdown-panel {
                    display: flex;
                }

                /* Ogni sottogruppo e' una colonna con titolo e link impilati */
                .nav-column {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                }

                .nav-column-title {
                    font-weight: 700;
                    color: #1a202c;
                    margin: 0 0 4px;
                }

                .nav-column a {
                    color: var(--item-color, #4a5568);
                    text-decoration: none;
                }

                .nav-column a:hover {
                    color: #3182ce;
                }

                .main-nav {
                    display: flex;
                    align-items: center;
                    list-style: none;
                    margin: 0;
                    padding: 0;
                    gap: 24px;
                }

                .main-nav a {
                    color: var(--item-color, #4a5568);
                    text-decoration: none;
                    font-size: 16px;
                    font-weight: 500;
                    transition: color 0.3s;
                    white-space: nowrap;
                }
                .main-nav a:hover {
                    color: #3182ce;
                }
            `}</style>
        </header>
    );
}

// Voce di primo livello: un gruppo diventa un menu a tendina, qualsiasi altra
// cosa e' un semplice link
function NavigationItem({item}) {
    if (item.type === 'group') {
        return <DropdownItem item={item}/>;
    }
    return <NavLink item={item}/>;
}

// Menu a tendina: i figli che sono a loro volta gruppi diventano colonne
// verticali del pannello. Disegna solo due livelli (gruppo e sottogruppi).
function DropdownItem({item}) {
    return (
        <div className="nav-dropdown">
            {/* --item-color e' una variabile CSS assegnata qui in linea con il colore
                scelto in Directus, e letta nel CSS globale con var() */}
            <span className="nav-dropdown-trigger" style={{'--item-color': item.element_color}}>{item.title}</span>
            <div className="nav-dropdown-panel">
                {item.children?.map((child) =>
                    child.type === 'group' ? (
                        // Sottogruppo: colonna con il titolo e i suoi link
                        <div key={child.id} className="nav-column">
                            <p className="nav-column-title">{child.title}</p>
                            {child.children?.map((link) => (
                                <NavLink key={link.id} item={link}/>
                            ))}
                        </div>
                    ) : (
                        // Link diretto dentro il gruppo: colonna con un solo link
                        <div key={child.id} className="nav-column">
                            <NavLink item={child}/>
                        </div>
                    )
                )}
            </div>
        </div>
    );
}

// Un singolo link del menu. Il div esterno serve solo a portare il colore della
// voce (--item-color) fino al tag <a>, che lo eredita.
function NavLink({item}) {
    return (
        <div style={{'--item-color': item.element_color}}>
            {/* Se la voce e' impostata per aprirsi in una nuova scheda, noopener
                noreferrer protegge la pagina originale */}
            <Link
                href={resolveItemUrl(item)}
                target={item.target === '_blank' ? '_blank' : undefined}
                rel={item.target === '_blank' ? 'noopener noreferrer' : undefined}
            >
                {item.title}
            </Link>
        </div>
    );
}

// Calcola la destinazione di una voce in base al suo tipo: pagina, post o URL
// libero. Per le pagine il permalink contiene gia' la "/" iniziale. Se manca il
// dato necessario si restituisce "#" (un link che non porta da nessuna parte).
function resolveItemUrl(item) {
    if (item.type === 'page' && item.page) {
        return `${item.page.permalink}`;
    }
    if (item.type === 'post' && item.post) {
        return `/posts/${item.post}`;
    }
    if (item.type === 'url' && item.url) {
        return item.url;
    }
    return '#';
}