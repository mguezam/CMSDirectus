import client from '@/lib/directus';
import {readItems} from '@directus/sdk';
import {findTrail} from '@/lib/navigation';

export async function getPageByPermalink(permalink) {
    const [pages, navigationData] = await Promise.all([
        client.request(readItems('pages', {
            filter: {permalink: {_eq: permalink}},
            fields: ["*", "blocks.*", "blocks.item.*.*.*"],
        })),
        client.request(readItems('navigation', {fields: ["*.*.*.*.*"]})),
    ]);

    const page = pages[0] ?? null;
    if (!page) return {page: null, navigationData, trail: []};

    const mainNav = navigationData.find((nav) => nav.title === 'Main Navigation');
    const trail =
        findTrail(mainNav?.items, permalink)?.map((item) => ({
            title: item.title,
            href: item.type === 'page' ? item.page?.permalink : null,
        })) ?? [{title: page.title}];

    return {page, navigationData, trail};
}

export async function getPageMetadata(permalink) {
    const seoData = await client.request(
        readItems('pages', {filter: {permalink: {_eq: permalink}}, fields: ["title", "seo"]})
    );

    const page = seoData?.[0];
    if (!page)
        return {title: 'Default Title', description: 'Default Description'};

    return {
        title: page.seo?.title || page.title || 'Default Title',
        description: page.seo?.description || 'Default Description',
    };
}