# CMS Directus + Next.js

CMS basato su **Directus** e **Next.js (App Router)** per la gestione e la visualizzazione di contenuti dinamici.
Le pagine sono costruite tramite un page builder a blocchi, in cui ogni blocco è un componente React alimentato dai dati di Directus.

## Struttura del progetto

Il progetto è composto da due cartelle sorelle:

* `backend/`: contiene l'istanza Directus, la configurazione Docker, lo schema e il database.
* `directus-next-cms/`: contiene il frontend Next.js, responsabile del recupero dei contenuti e della loro visualizzazione.

## Requisiti

* **Node.js** 20 o superiore
* **pnpm**
* **Docker** con Docker Compose
* Istanza Directus raggiungibile su `http://localhost:8055`

## Avvio in locale

### 1. Avviare Directus

Dalla cartella `backend/`, avviare i servizi Docker:

```bash
docker compose up -d
```

Directus sarà disponibile su `http://localhost:8055`.

### 2. Configurare le variabili d'ambiente

Nella cartella `directus-next-cms/`, creare il file `.env.local` con le seguenti variabili:

```dotenv
NEXT_PUBLIC_DIRECTUS_URL=http://localhost:8055
NEXT_PUBLIC_DIRECTUS_TOKEN=il_tuo_token_qui
```

Il token si genera dall'interfaccia di Directus, nella sezione **Impostazioni → Access Policies → Token**.

La policy associata al token deve consentire la lettura delle seguenti collezioni:

* `pages`
* `posts`
* `navigation`
* `category`
* Tutte le collezioni `block_*` utilizzate dal page builder

### 3. Installare le dipendenze e avviare il frontend

Dalla cartella `directus-next-cms/`, eseguire:

```bash
pnpm install
pnpm dev
```

Il frontend sarà disponibile su `http://localhost:3000`.

## Schema Directus

Il file `directus/schema.yaml` contiene lo snapshot completo dello schema Directus, comprese collezioni, campi e relazioni.

Lo snapshot **non contiene i contenuti delle collezioni né i permessi di accesso**.

### Applicare lo schema

Dalla cartella `backend/`, applicare lo snapshot all'istanza Directus:

```bash
npx directus schema apply ./directus/schema.yaml
```

### Esportare lo schema aggiornato

Dopo aver modificato lo schema da Directus, esportare un nuovo snapshot. Dalla cartella `backend/`, eseguire:

```bash
docker compose exec directus npx directus schema snapshot /directus/schema.yaml
docker compose cp directus:/directus/schema.yaml ./directus/schema.yaml
```

Il file aggiornato può essere versionato insieme al codice per mantenere lo schema condiviso tra gli ambienti di sviluppo.

## Come funziona il page builder

In Directus, ogni pagina contiene una lista ordinata di blocchi. Ogni blocco rappresenta una sezione della pagina ed è associato a una collezione specifica.

Il frontend recupera i dati della pagina e passa la lista dei blocchi a `<BlockRenderer />`, che seleziona il componente React corretto tramite una mappa:

```js
const BLOCKS = {
  block_hero: HeroSection,
  block_richtext: RichTextSection,
  block_gallery: GallerySection,
  block_posts: Posts,
  block_pricing: PricingSection,
  block_form: FormSection,
  block_textgrid: TextGridSection,
  block_links: LinksSection,
};
```

### Aggiungere un nuovo blocco

Per aggiungere un blocco al page builder sono necessari tre passaggi:

1. Creare la collezione corrispondente in Directus, definendo i campi necessari.
2. Creare il componente React in `app/components/blocks/`.
3. Aggiungere una riga alla mappa `BLOCKS` in `BlockRenderer.js`, associando il nome della collezione al componente.

Una volta registrato, il nuovo blocco può essere utilizzato nelle pagine da Directus. Non è necessario modificare le pagine del frontend.

## Struttura delle cartelle

```text
app/
  page.js                    home
  [slug]/page.js             pagine dinamiche
  category/[slug]/page.js    pagine di categoria
  posts/[slug]/page.js       singolo articolo
  components/
    layout/                  Header, Footer, Breadcrumb, ...
    blocks/                  blocchi del page builder
    BlockRenderer.js         smista i blocchi ai componenti
  api/                       route API (ricerca, ...)
lib/
  directus.js                client SDK Directus
  pages.js                   fetch pagina, navigazione, metadati
  navigation.js              utility per l'albero dei menu
directus/
  schema.yaml                snapshot dello schema Directus
```

## Personalizzazione dei colori

Molti blocchi espongono campi colore configurabili direttamente da Directus, ad esempio per lo sfondo, il testo e i titoli.

I valori configurati vengono passati al componente React tramite props e impostati come variabili CSS inline. Gli stili del componente possono quindi utilizzare `var(--nome-variabile, fallback)` per applicare il valore configurato o un colore predefinito.

Esempio con un blocco Link:

```jsx
<section
  style={{
    "--link-bg": backgroundColor || "#ffffff",
    "--link-text": textColor || "#000000",
  }}
>
  <style jsx>{`
    .link-block {
      background-color: var(--link-bg, #ffffff);
      color: var(--link-text, #000000);
    }
  `}</style>

  <div className="link-block">
    Contenuto del blocco Link
  </div>
</section>
```

I nomi delle variabili CSS devono corrispondere a quelli utilizzati negli stili del componente. I valori di fallback garantiscono una visualizzazione corretta quando un colore non è configurato in Directus.

## Note finali

* **Contenuti:** le pagine e i relativi contenuti risiedono nell'istanza Directus locale e non sono inclusi nello snapshot dello schema né versionati insieme al codice.
* **Permessi:** i permessi del token non sono inclusi in `schema.yaml` e devono essere configurati manualmente nell'interfaccia di Directus.
* **Immagini di sfondo:** in sviluppo locale, il caricamento delle immagini di sfondo dei blocchi avviene da Directus passando il token nell'URL tramite `?access_token=...`. Questo approccio è adatto esclusivamente allo sviluppo locale; in produzione è necessario adottare una strategia di accesso alle immagini adeguata all'ambiente e ai relativi requisiti di sicurezza.
