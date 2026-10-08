import {getPageByPermalink, getPageMetadata} from '@/lib/pages';
import PageShell from "@/lib/PageShell";

export async function generateMetadata({params}) {
    const {slug} = await params;
    return getPageMetadata(`/${slug}`);
}

export default async function Page({params}) {
    const {slug} = await params;
    const {page, navigationData, trail} = await getPageByPermalink(`/${slug}`);

    console.log('slug:', slug);
    console.log('page found:', page?.title ?? 'NOT FOUND');
    console.log('trail:', trail);
    console.log('show_breadcrumb:', page?.show_breadcrumb);

    if (!page) return null;

    return <PageShell page={page} navigationData={navigationData} trail={trail} />;
}