import {getPageByPermalink, getPageMetadata} from '@/lib/pages';
import PageShell from "@/lib/PageShell";

export async function generateMetadata() {
    return getPageMetadata('/');
}

export default async function Home() {
    const {page, navigationData, trail} = await getPageByPermalink('/');
    if (!page) return null;

    return <PageShell page={page} navigationData={navigationData} trail={trail}/>;
}