import {notFound} from 'next/navigation';
import {getPostBySlug, getNavigation} from '@/lib/pages';
import Header from '@/app/components/layout/Header';
import Footer from '@/app/components/layout/Footer';
import PostArticle from '@/app/components/PostArticle';

// Rotta per il singolo post: /posts/avviso-di-ricerca-di-personale, ...
// La cartella "posts" e' un segmento fisso dell'URL, [slug] e' la parte variabile
// e corrisponde al campo "slug" del post in Directus.
// I post non passano da PageView/PageShell perche' non sono pagine di Directus
// (non hanno blocchi): vengono letti dalla collezione "posts".

// Metadati (<title> e description) presi dal post stesso
export async function generateMetadata({params}) {
    // In questa versione di Next.js params e' una Promise: va atteso con await
    const {slug} = await params;
    const post = await getPostBySlug(slug);

    // Post inesistente: valori generici (la pagina mostrera' il 404)
    if (!post) return {title: 'Default Title', description: 'Default Description'};

    return {
        title: post.title,
        description: post.description || 'Default Description',
    };
}

export default async function PostPage({params}) {
    const {slug} = await params;

    // Le due richieste sono indipendenti, quindi partono insieme
    const [post, navigationData] = await Promise.all([
        getPostBySlug(slug),
        getNavigation(),
    ]);

    // Nessun post pubblicato con questo slug: mostra il 404
    if (!post) notFound();

    return (
        <main style={{minHeight: '100vh'}}>
            <Header navigation={navigationData}/>
            <PostArticle post={post}/>
            <Footer navigation={navigationData}/>
        </main>
    );
}