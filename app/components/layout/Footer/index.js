"use client";
import "./style.css";

// Piè di pagina a sezioni: ogni sezione ha un titolo, una linea sotto il titolo e
// un testo (es. "Informazioni", linea, "Via Angelo Colombo..."), piu' una riga di
// copyright. Le sezioni si gestiscono in Directus, nel campo "footer_sections"
// della voce di menu "Footer Navigation".
//
// navigation: tutti i menu letti da Directus (lo stesso elenco dato all'header)
export default function Footer({ navigation }) {
    // Si cerca tra i menu quello con titolo "Footer Navigation"
    const footerNavigation = navigation?.filter((nav) => nav.title === 'Footer Navigation')[0];

    // Il repeater di Directus arriva come elenco di { title, content }. Se il campo
    // e' vuoto arriva null, quindi "?? []" lo trasforma in un elenco vuoto.
    const sections = footerNavigation?.footer_sections ?? [];

    // Nessuna sezione: il footer non viene mostrato affatto
    if (sections.length === 0) {
        return null;
    }

    return (
        <footer className="site-footer">
            <div className="container">
                <div className="footer-content">
                    {sections.map((section, idx) => (
                        // Le voci di un repeater non hanno un id, quindi come "key"
                        // (che React richiede in ogni elenco) si usa la posizione
                        <div key={idx} className="footer-section">
                            {/* La linea sotto il titolo e' il bordo inferiore del titolo */}
                            <h3 className="footer-title">{section.title}</h3>
                            {/* Il paragrafo si mostra solo se la sezione ha un testo */}
                            {section.content && <p className="footer-text">{section.content}</p>}
                        </div>
                    ))}
                </div>

                <div className="footer-bottom">
                    {/* Il testo "Your Site" e' scritto direttamente nel codice (non
                        viene da Directus): per cambiarlo va modificato qui. L'anno e'
                        calcolato in automatico. */}
                    <p>&copy; {new Date().getFullYear()} AdigePo. All rights reserved.</p>
                </div>
            </div>

            
        </footer>
    );
}