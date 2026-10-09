import {getPageByPermalink, getPageMetadata} from '@/lib/pages';
import PageShell from "@/lib/PageShell";

export async function generateMetadata({params}) {
    const {slug} = await params;
    return getPageMetadata(`/category/${slug}`);
}

export default async function Page({params}) {
    const {slug} = await params;
    const {page, navigationData, trail} = await getPageByPermalink(`/category/${slug}`);

    if (!page) return null;

    return <PageShell page={page} navigationData={navigationData} trail={trail} categoryName={page.title}/>;
}