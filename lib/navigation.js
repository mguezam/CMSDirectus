// Cerca nel menu (che e' un albero: ogni voce puo' avere dei figli) la pagina con
// questo permalink, e restituisce la catena di voci per arrivarci, ad esempio
// [Servizi, Appalti, Portale appalti]. Se non la trova restituisce null.
// Serve a costruire il breadcrumb.
//
// items:     l'elenco di voci in cui cercare (a ogni livello e' una lista diversa)
// permalink: il permalink della pagina cercata, ad esempio "/portale-appalti"
// trail:     il percorso gia' percorso fino a qui (parte vuoto)
export function findTrail(items, permalink, trail = []) {
    // "?? []" evita errori se items e' null/undefined (voce senza figli)
    for (const item of items ?? []) {
        // Percorso fino a questa voce compresa. Si crea un nuovo array a ogni
        // livello (senza modificare trail), cosi' i rami scartati non sporcano
        // quelli successivi.
        const next = [...trail, item];

        // Caso base: questa voce e' la pagina cercata, quindi il percorso e' completo
        if (item.type === 'page' && item.page?.permalink === permalink) {
            return next;
        }

        // Ricorsione: cerca nei figli di questa voce, portandosi dietro il percorso
        const found = findTrail(item.children, permalink, next);
        // Se un ramo ha trovato la pagina, si ritorna subito (e si interrompe il
        // ciclo): il risultato risale cosi' fino alla prima chiamata
        if (found) return found;
        // Se found e' null, la pagina non e' in questo ramo e si prova la voce successiva
    }
    // Nessuna voce di questo elenco (ne' i loro figli) contiene la pagina
    return null;
}