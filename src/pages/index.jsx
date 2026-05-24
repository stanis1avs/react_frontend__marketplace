import CatalogWidget from '@/Components/CatalogWidget'
import TopSalesWidget from '@/Components/TopSalesWidget'
import RecommendationsWidget from '@/Components/RecommendationsWidget'
import Head from 'next/head'

export async function getStaticProps () {
  try {
    const response = await fetch(process.env.NEXT_PUBLIC_CATEGORIES_CATALOG);
    if (!response.ok) {
      throw new Error('Failed to fetch');
    }
    const items = await response.json();

    return {
      props: { items }
    };
  } catch {
    return {
      props: { items: [] },
    };
  }
}

export default function Main({items}) {
  return (
    <>
      <Head>
        <meta name="verify-admitad" content="7392481a26" />
      </Head>
      <TopSalesWidget/>
      <RecommendationsWidget/>
      <CatalogWidget items={items}/>
    </>
  )
}
