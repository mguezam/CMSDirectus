import {createDirectus, rest, staticToken} from '@directus/sdk';

const BACKEND_URL = "http://localhost:8055/"
const client = createDirectus(process.env.NEXT_PUBLIC_DIRECTUS_URL)
    .with(staticToken(process.env.NEXT_PUBLIC_DIRECTUS_TOKEN))
    .with(rest())

export default client;
