import { NextResponse } from 'next/server';
import client from '../../../lib/directus';
import { readItems } from '@directus/sdk';

// Which collections to search, and how to turn a result into
// a normalized { id, title, url, type } shape for the UI.
const SEARCH_TARGETS = [
    {
        collection: 'pages',
        fields: ['id', 'title', 'permalink'],
        // pages use permalink as their URL
        map: (item) => ({
            id: `page-${item.id}`,
            title: item.title ?? 'Untitled page',
            url: item.permalink ?? '/',
            type: 'Page',
        }),
    },
    {
        collection: 'posts',
        fields: ['id', 'title', 'slug'],
        map: (item) => ({
            id: `post-${item.id}`,
            title: item.title ?? 'Untitled post',
            url: `/posts/${item.slug}`,
            type: 'Post',
        }),
    },
    // Add more collections here as needed, e.g.:
    // {
    //     collection: 'documents',
    //     fields: ['id', 'title', 'slug'],
    //     map: (item) => ({
    //         id: `doc-${item.id}`,
    //         title: item.title,
    //         url: `/documents/${item.slug}`,
    //         type: 'Document',
    //     }),
    // },
];

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query || query.length < 3) {
        return NextResponse.json({ results: [] });
    }

    try {
        // Query every collection in parallel
        const settled = await Promise.allSettled(
            SEARCH_TARGETS.map((target) =>
                client
                    .request(
                        readItems(target.collection, {
                            search: query,
                            limit: 5, // per-collection cap; keeps things snappy
                            fields: target.fields,
                        })
                    )
                    .then((items) => items.map(target.map))
            )
        );

        // Flatten successful results; log failures so you notice misconfigs
        const results = [];
        settled.forEach((outcome, i) => {
            if (outcome.status === 'fulfilled') {
                results.push(...outcome.value);
            } else {
                console.error(
                    `[SEARCH] Failed to search "${SEARCH_TARGETS[i].collection}":`,
                    outcome.reason?.message ?? outcome.reason
                );
            }
        });

        return NextResponse.json({ results });
    } catch (err) {
        console.error('[SEARCH] Unexpected error:', err);
        return NextResponse.json(
            { error: String(err?.message ?? err), results: [] },
            { status: 500 }
        );
    }
}