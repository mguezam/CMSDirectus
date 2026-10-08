// Returns the list of nav items leading to the page with this permalink, or null
export function findTrail(items, permalink, trail = []) {
    for (const item of items ?? []) {
        const next = [...trail, item];

        if (item.type === 'page' && item.page?.permalink === permalink) {
            return next;
        }

        const found = findTrail(item.children, permalink, next);
        if (found) return found;
    }
    return null;
}