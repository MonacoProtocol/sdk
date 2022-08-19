import { Button } from '@mui/material'
import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'

const Home: NextPage = () => {
  const marketAccount = "4R6w8Q52jjnXdJB26K9ML9zUSzthscP3EWhvNZ2WyiAS"
  return (
    <>
      <Head>
        <title>Nextjs - Protocol Example</title>
        <meta name="description" content="Example usage of the protocol" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>
          Example Nextjs usage of the protocol.
        </h1>

        <Link href={`/markets/${marketAccount}/my-bets`}>
          <Button>
            My bets
          </Button>
        </Link>

        <Link href={`/markets/${marketAccount}/place-bet`}>
          <Button>
            Place bet
          </Button>
        </Link>
      </main>
      </>
  )
}

export default Home
