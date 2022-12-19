import { useEffect, useState } from 'react'
import type { NextPage } from 'next'
import { Card, Link as MuiLink, Skeleton } from '@mui/material'
import Head from 'next/head'
import Link from 'next/link'
import { getMarketAccountsByStatus, MarketStatus } from '@monaco-protocol/client'
import { PublicKey } from "@solana/web3.js"
import { Page } from '../components/Page'
import { useProgram } from '../context/ProgramProvider'

const Home: NextPage = () => {
  const program = useProgram();
  const [marketAccount, setMarketAccount] = useState<PublicKey>();

  useEffect(() => {
    const getOpenMarketAccount = async () => {
      const res = await getMarketAccountsByStatus(program, MarketStatus.Open);

      // Only get an open market with a non-zero marketOutcomesCount
      res.data.markets.forEach(market => {
        if (market.account.marketOutcomesCount !== 0) {
          setMarketAccount(market.publicKey);
          return;
        }
      });
    }
    getOpenMarketAccount().catch(console.error);
  }, []);

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
        {marketAccount === undefined 
          ? (
            <>
            <Skeleton variant="text" sx={{ fontSize: '1rem', width: "30%" }} />
            <Skeleton variant="text" sx={{ fontSize: '1rem', width: "30%" }} />
            </>
          )
          :
          <ul>
            <li>
              <Link href={`/markets/${marketAccount.toBase58()}/my-bets`}>
                <MuiLink>
                  My bets
                </MuiLink>
              </Link>
            </li>
            <li>
              <Link href={`/markets/${marketAccount.toBase58()}/place-bet`}>
                  <MuiLink>
                    Place bet
                  </MuiLink>
                </Link>
            </li>
          </ul>
        }
      </Card>
    </Page>
  )
}

export default Home
