import Link from 'next/link';
import HeaderSearch from '../HeaderSearch';
import Image from "next/image";
import SocialLinks from '../SocialLinks';
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import "./style.css";

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
        <header className="site-header" style={{
            "--header-height": `${height ?? 80}px`,
            "--header-top-bar-color": topBarColor ?? '#ffffff',
            "--header-nav-bar-color": backgroundColor ?? '#ffffff',
        }}>
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
                    <NavigationMenu aria-label="Main navigation" viewport={false} className="w-full max-w-none justify-start">
                    <NavigationMenuList className="main-nav justify-start gap-6">
                        {headerNavigation.items.map((item) => (
                            <NavigationItem key={item.id} item={item}/>
                        ))}
                    </NavigationMenuList>
                    </NavigationMenu>
                </div>
            </nav>

        </header>
    );
}

// Voce di primo livello: un gruppo diventa un menu a tendina, qualsiasi altra
// cosa e' un semplice link
function NavigationItem({item}) {
    return (
        <NavigationMenuItem className="nav-item" style={{'--item-color': item.element_color}}>
            {item.type === 'group' ? <DropdownItem item={item}/> : <NavLink item={item} topLevel/>}
        </NavigationMenuItem>
    );
}

// Menu a tendina: i figli che sono a loro volta gruppi diventano colonne
// verticali del pannello. Disegna solo due livelli (gruppo e sottogruppi).
function DropdownItem({item}) {
    return (
        <>
            <NavigationMenuTrigger
                className="nav-dropdown-trigger text-base text-white hover:bg-transparent hover:text-[#3182ce]"
                style={{color: '#ffffff'}}
            >
                {item.title}
            </NavigationMenuTrigger>
            <NavigationMenuContent className="nav-dropdown-panel absolute left-0 top-full min-w-[400px] bg-white p-5 shadow-lg">
                <div className="nav-columns">
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
            </NavigationMenuContent>
        </>
    );
}

// Un singolo link del menu. Il div esterno serve solo a portare il colore della
// voce (--item-color) fino al tag <a>, che lo eredita.
function NavLink({item, topLevel = false}) {
    const link = (
        <Link
            href={resolveItemUrl(item)}
            target={item.target === '_blank' ? '_blank' : undefined}
            rel={item.target === '_blank' ? 'noopener noreferrer' : undefined}
            className={topLevel ? undefined : "text-[var(--item-color,#4a5568)] hover:text-[#3182ce]"}
            style={topLevel ? {color: '#ffffff'} : undefined}
        >
            {item.title}
        </Link>
    );

    return (
        <div style={{'--item-color': item.element_color}}>
            {/* Se la voce e' impostata per aprirsi in una nuova scheda, noopener
                noreferrer protegge la pagina originale */}
            {topLevel ? (
                <NavigationMenuLink
                    asChild
                    className="text-base font-medium text-white hover:bg-transparent hover:text-[#3182ce]"
                >
                    {link}
                </NavigationMenuLink>
            ) : link}
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