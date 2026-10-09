import HeroSection from '@/app/components/blocks/HeroSection';
import RichTextSection from '@/app/components/blocks/RichTextSection';
import GallerySection from '@/app/components/blocks/GallerySection';
import PricingSection from '@/app/components/blocks/PricingSection';
import FormSection from "@/app/components/blocks/FormSection";
import TextGridSection from '@/app/components/blocks/TextGridSection';
import Posts from '@/app/components/blocks/Posts';

// Tabella di corrispondenza: nome della collezione del blocco in Directus ->
// componente che lo disegna. Le chiavi devono essere identiche ai nomi delle
// collezioni in Directus. I valori sono le funzioni dei componenti (senza
// parentesi: qui non vengono eseguite, solo memorizzate).
// Per aggiungere un nuovo tipo di blocco: creare il componente, importarlo qui
// e aggiungere una riga a questa tabella.
const BLOCKS = {
    block_hero: HeroSection,
    block_richtext: RichTextSection,
    block_gallery: GallerySection,
    block_pricing: PricingSection,
    block_form: FormSection,
    block_textgrid: TextGridSection,
    block_posts: Posts,
};

// Disegna tutti i blocchi di una pagina, nell'ordine impostato in Directus.
//
// blocks:       l'elenco dei blocchi della pagina (page.blocks). Il valore di
//               default [] evita errori se manca (ma non se e' null)
// categoryName: nome della categoria, usato solo dal blocco dei post
export default function BlockRenderer({blocks = [], categoryName}) {
    return (
        // <> ... </> e' un fragment: raggruppa gli elementi senza aggiungere un
        // <div> inutile nell'HTML
        <>
            {blocks.map((block) => {
                // block.collection e' il tipo del blocco (es. 'block_hero'):
                // si cerca il componente corrispondente nella tabella
                // (la variabile deve avere l'iniziale maiuscola per poter essere
                // usata come tag JSX)
                const Component = BLOCKS[block.collection];
                // Tipo di blocco sconosciuto: non si disegna nulla invece di
                // far andare in errore la pagina
                if (!Component) return null;

                // categoryName non e' un campo del blocco in Directus (viene dalla
                // rotta), quindi non arriva con block.item. Va passato a mano, e
                // solo al blocco dei post: gli altri non lo usano.
                const extraProps = block.collection === 'block_posts' ? {categoryName} : {};

                // key serve a React per distinguere gli elementi di una lista.
                // {...block.item} trasforma ogni campo del contenuto del blocco in
                // una prop (i nomi dei campi in Directus devono coincidere con
                // quelli che il componente si aspetta). {...extraProps} viene
                // dopo, quindi in caso di nomi uguali vince.
                return <Component key={block.id} {...(block.item ?? {})} {...extraProps} />;
            })}
        </>
    );
}