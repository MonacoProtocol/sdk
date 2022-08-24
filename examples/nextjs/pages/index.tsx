import type { NextPage } from 'next'
import { Card, Link as MuiLink } from '@mui/material'
import Head from 'next/head'
import Link from 'next/link'
import { Page } from '../components/Page'

const Home: NextPage = () => {
  const marketAccount = "4R6w8Q52jjnXdJB26K9ML9zUSzthscP3EWhvNZ2WyiAS"
  return (
    <Page
      title="NextJS Monaco Protocol"
      description="A selection of common uses for the Monaco Protocol"
    >
      <Head>
        <title>Nextjs - Protocol Example</title>
        <meta name="description" content="Example usage of the protocol" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Card sx={{
        padding: '1rem',
      }}>
        <ul>
          <li>
            <Link href={`/markets/${marketAccount}/my-bets`}>
              <MuiLink>
                My bets
              </MuiLink>
            </Link>
          </li>
          <li>
            <Link href={`/markets/${marketAccount}/place-bet`}>
                <MuiLink>
                  Place bet
                </MuiLink>
              </Link>
          </li>
        </ul>
        </Card>
      </Page>
  )
}

export default Home
