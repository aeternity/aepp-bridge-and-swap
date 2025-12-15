const siteUrl = 'https://swap.superhero.com'.replace(/\/$/, '');

export default function Head() {
  return (
    <>
      <link rel="canonical" href={`${siteUrl}/`} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@graph': [
              {
                '@type': 'WebSite',
                name: 'Superhero Swap',
                url: siteUrl + '/',
                description:
                  'Superhero Swap is a Web3 DEX bridge on the æternity blockchain.',
                potentialAction: {
                  '@type': 'SearchAction',
                  target: `${siteUrl}/?q={search_term_string}`,
                  'query-input': 'required name=search_term_string',
                },
              },
              {
                '@type': 'Organization',
                name: 'Superhero',
                url: siteUrl + '/',
                logo: {
                  '@type': 'ImageObject',
                  url: `${siteUrl}/assets/superheroswaplogo.svg`,
                },
              },
            ],
          }),
        }}
      />
    </>
  );
}
