"use client";

import Image from 'next/image';
import Link from 'next/link';
import {useState, useEffect} from 'react';
import {readItems} from '@directus/sdk';
import client from '../../../lib/directus';

export default function Posts({tagline, headline, limit = 6, headline_color, background_color, categoryName}) {

    const [posts, setPosts] = useState(null);
    console.log('Posts props:', {background_color});
    useEffect(() => {
        async function fetchPosts() {
            const filter = {published_at: {_nnull: true}};
            if (categoryName) {
                filter.category = {Name: {_eq: categoryName}};
            }

            const data = await client.request(
                readItems('posts', {
                    limit,
                    fields: ['id', 'title', 'slug', {'author': ["first_name", "last_name"]}, 'published_at', 'image.title', 'image.id', 'description',
                        "background_color", "text_color", "category.Name", "category.slug"],
                    filter: filter,
                })
            );
            setPosts(data);
        }

        fetchPosts();
    }, [limit, categoryName]);

    return (
        <section className="posts-section" style={{"--posts_background_color": background_color}}>
            <p>{tagline}</p>
            <h1 style={{"--headline_color": headline_color}}>{headline}</h1>
            <div className="posts-container">
                {posts ? (
                    <div className="posts-grid">
                        {posts.map((post) => {
                            console.log(post);
                            return <Post key={post.id} {...post} />;
                        })}
                    </div>
                ) : (
                    <div>Loading...</div>
                )}

            </div>
            <style jsx>{`
                .posts-section {
                    padding: 40px;
                    background-color: var(--posts_background_color, #FFFFFF);
                }

                .posts-container {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 3rem;
                }

                .posts-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 1rem;
                    width: 100%;
                    max-width: 1400px; /* 👈 caps how wide the grid can get */
                    margin: 0 auto; /* 👈 centers it horizontally */
                }

                h1 {
                    font-size: 48px;
                    font-weight: bold;
                    margin-bottom: 20px;
                    color: var(--headline_color, white);
                    margin-left: 20px;
                }

                p {
                    margin-left: 20px;
                    margin-top: 20px;
                }
            `}</style>
        </section>
    );
}

function Post({
                  id,
                  title,
                  author,
                  slug,
                  description,
                  image,
                  content,
                  published_at,
                  background_color,
                  text_color,
                  category
              }) {
    return (
        <div className={'card'} style={{'--background_color': background_color}}>
            <Image
                src={`http://localhost:8055/assets/${image.id}?access_token=${process.env.NEXT_PUBLIC_DIRECTUS_TOKEN}`}
                alt={image.title}
                width={400}
                height={300}
                className="gallery-image"
            />
            <h2 style={{'--text_color': text_color}}>{title}</h2>
            <Link href={`/category/${category.slug}`}>
                <p className={"category"}>{category?.Name}</p>
            </Link>
            <p className="author">by {author.first_name} {author.last_name}</p>
            {content ? (
                <>
                    <p>Published on {new Date(published_at).toDateString()}</p>
                    <hr/>
                    <div dangerouslySetInnerHTML={{__html: content}}/>
                </>
            ) : (
                <div className={"body"}>
                    <p className={"description"}>{description}</p>
                    <Link href={`/posts/${slug}`}>
                        <div className="link">Leggi di più...</div>
                    </Link>
                </div>
            )}

            <style jsx>{`
                .card {
                    display: flex;
                    flex-direction: column;
                    background-color: var(--background_color, white);
                    border-radius: 8px;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                    overflow: hidden;
                    transition: transform 0.3s ease;
                    max-width: 400px;
                    margin: 1rem;
                    position: relative;
                }

                .card .body {
                    display: flex;
                    flex-direction: column;
                    flex: 1;
                }

                .card .description {
                    flex: 1;
                    display: -webkit-box;
                    -webkit-line-clamp: 3;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }

                .card:hover {
                    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
                }

                .card :global(img) {
                    width: 100%;
                    height: 200px;
                    object-fit: cover;
                    display: block;
                }

                .card h2 {
                    color: var(--text_color, black);
                    margin: 1rem;
                    font-size: 1.5rem;
                }

                .card p {
                    margin: 0 1rem 0.75rem;
                    color: #666;
                    line-height: 1.4;
                }

                .card .category {
                    font-size: 24px;
                }

                .card .description {
                    display: -webkit-box;
                    -webkit-line-clamp: 3;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }

                .link {
                    margin: 0 1rem 1rem;
                    color: #0000EE;
                }
            `}</style>
        </div>
    );
}
