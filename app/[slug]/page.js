import {getPageByPermalink, getPageMetadata} from '@/lib/pages';
import PageShell from "@/lib/PageShell";

export async function generateMetadata({params}) {
    const {slug} = await params;
    return getPageMetadata(`/${slug}`);
}

export default async function Page({params}) {
    const {slug} = await params;
    const {page, navigationData, trail} = await getPageByPermalink(`/${slug}`);

    if (!page) return null;

    return <PageShell page={page} navigationData={navigationData} trail={trail} />;
}