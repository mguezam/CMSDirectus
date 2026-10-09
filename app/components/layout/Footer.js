"use client";

import Link from 'next/link';

// Piè di pagina: disegna le voci del menu "Footer Navigation" e una riga di
// copyright.
//
// navigation: tutti i menu letti da Directus (lo stesso elenco dato all'header)
export default function Footer({ navigation }) {
    // Si cerca tra i menu quello con titolo "Footer Navigation"
    const footerNavigation = navigation?.filter((nav) => nav.title === 'Footer Navigation')[0];

    // Se il menu non esiste o non ha voci, il footer non viene mostrato affatto
    if (!footerNavigation || !footerNavigation.items?.length) {
        return null;
    }

    return (
        <footer className="site-footer">
            <div className="container">
                <div className="footer-content">
                    {footerNavigation.items.map((item) => (
                        <FooterNavigationItem key={item.id} item={item} />
                    ))}
                </div>

                <div className="footer-bottom">
                    {/* Il testo "Your Site" e' scritto direttamente nel codice (non
                        viene da Directus): per cambiarlo va modificato qui. L'anno e'
                        calcolato in automatico. */}
                    <p>&copy; {new Date().getFullYear()} Your Site. All rights reserved.</p>
                </div>
            </div>

            <style jsx>{`
        .site-footer {
          background-color: #2d3748;
          color: #e2e8f0;
          padding: 60px 0 30px;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .footer-content {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          margin-bottom: 40px;
          gap: 20px;
        }

        .footer-bottom {
          text-align: center;
          padding-top: 20px;
          border-top: 1px solid #4a5568;
          font-size: 14px;
          color: #a0aec0;
        }

        /* Su schermi stretti le voci si dispongono in colonna */
        @media (max-width: 768px) {
          .footer-content {
            flex-direction: column;
          }
        }
      `}</style>
        </footer>
    );
}

// Disegna una voce del footer. Un gruppo non viene mostrato come titolo: si
// disegnano direttamente i suoi figli, uno dopo l'altro. Non e' ricorsivo per
// davvero: scende di un solo livello.
function FooterNavigationItem({ item }) {
    if (item.type === 'group') {
        return (
            item.children?.map((child) => (
                // target/rel: se la voce e' impostata per aprirsi in una nuova
                // scheda, noopener noreferrer protegge la pagina originale.
                // Attenzione: qui si usa child.label, mentre per le voci normali
                // piu' sotto si usa item.title. Se il testo di un figlio non
                // compare, controllare quale dei due campi esiste davvero.
                <Link
                    href={resolveItemUrl(child)} key={child.id}
                    target={child.target === '_blank' ? '_blank' : undefined}
                    rel={child.target === '_blank' ? 'noopener noreferrer' : undefined}
                >
                    {child.label}
                </Link>
            ))
        );
    }

    // Se non e' un gruppo, la voce e' un singolo link
    return (
        <Link
            href={resolveItemUrl(item)}
            target={item.target === '_blank' ? '_blank' : undefined}
            rel={item.target === '_blank' ? 'noopener noreferrer' : undefined}
        >
            {item.title}
        </Link>
    );
}

// Calcola la destinazione di una voce in base al suo tipo: pagina, post o URL
// libero. Per le pagine il permalink contiene gia' la "/" iniziale. Se manca
// il dato necessario si restituisce "#" (un link che non porta da nessuna parte).
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