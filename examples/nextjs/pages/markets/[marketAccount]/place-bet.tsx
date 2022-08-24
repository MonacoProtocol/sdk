import { getMarket, MarketAccount, getMarketOutcomeAccounts, MarketOutcomeAccount, getMintInfo, findMarketPositionPda, createBetOrder } from "@monaco-protocol/client";
import { PublicKey } from "@solana/web3.js";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useProgram } from "../../../context/ProgramProvider";
import { Box, Button, Card, Divider, FormControl, FormControlLabel, FormLabel, InputLabel, MenuItem, Radio, RadioGroup, Select, TextField, Typography } from "@mui/material";
import { BN } from "@project-serum/anchor";
import { Page } from "../../../components/Page";
import { useWallet } from "@solana/wallet-adapter-react";

type FormData = {
    [marketOutcome: string]: {
        backing: string;
        odds: number;
        stake: number;
    }
}

const PlaceBet = () => {
    const program = useProgram();
    const { query } = useRouter();
    const wallet = useWallet();
    const [market, setMarket] = useState<MarketAccount>();
    const [marketOutcomes, setMarketOucomes] = useState<MarketOutcomeAccount[]>();
    const [formData, setFormData] = useState<FormData>();

    const updateForm = (marketOutcome: string, dataPoint: string) => (e: React.ChangeEvent<{value: string}>) => {
        setFormData(((state = {}) => ({
            ...state,
            [marketOutcome]: {
                ...state[marketOutcome],
                [dataPoint]: e.target.value
            }
        })));
    }

    const marketAccount = new PublicKey(query.marketAccount as string)

    const getMarketData = async () => {
        try {
            const marketResponse = await getMarket(program, marketAccount);
            marketResponse.data.account.mintAccount
            setMarket(marketResponse.data.account);
            const marketOutcomeAccountsResponse = await getMarketOutcomeAccounts(program, marketAccount, marketResponse.data.account.marketOutcomes);
            setMarketOucomes(marketOutcomeAccountsResponse.data.marketOutcomeAccounts);
            const defaultFormState = marketResponse.data.account.marketOutcomes.reduce((formState, marketOutcome) => ({
                ...formState,
                [marketOutcome]: {
                    backing: "back",
                    odds: 1.5,
                    stake: 0,
                },
            }), {})
            setFormData(defaultFormState)
        } catch (e) {
            console.error(e);
        }
    }

    const placeBet = async (marketOutcome: string, marketOutcomeIndex: number) => {
        try {
            if (!formData) {
                throw "Form is empty";
            }
            if (!market) {
                throw "Market is missing";
            }
            const { backing, odds, stake } = formData[marketOutcome];
            const marketTokenPk = new PublicKey(market.mintAccount);
            const mintInfo = await getMintInfo(program, marketTokenPk);
            const stakeInteger = new BN(stake * 10 ** mintInfo.data.decimals);
            const createBetOrderResposne = await createBetOrder(program, marketAccount, marketOutcomeIndex, backing === "back", odds, new BN(stakeInteger));
            console.log('createBetOrderResposne', createBetOrderResposne);
        } catch (e) {
            console.error(e);
        }
    }

    useEffect(() => {
        getMarketData();
    }, []);

    const t = async (walletPk: PublicKey) => {
        try {
            const res = await findMarketPositionPda(program, marketAccount, walletPk)
            console.log(res)
        } catch (e) {
            console.error(e)
        }
    }
    useEffect(() => {
        if (!wallet.publicKey) {
            return
        }
        t(wallet.publicKey)
    }, [wallet.publicKey]);

    return (
        <Page
            title="Place Bet Example"
            description="Example of how to get the required data to construct a bet order and how to exexute it."
        >
            <Card sx={{
                padding: '3rem 1rem',
                display: 'flex',
                justifyContent: 'space-around',
                flexDirection: {
                    xs: 'column',
                    lg: 'row',
                }
            }}>

            {formData && market?.marketOutcomes.map((marketOutcome, marketOutcomeIndex) =>
                (
                    <Card
                        key={marketOutcome}
                        elevation={3}
                        sx={{ padding: "2rem", marginBottom: {
                            xs: '1rem',
                            lg: '0',
                        } }}
                    >
                        <Typography variant="h5">{marketOutcome}</Typography>
                        <Divider sx={{ margin: "0.2rem 0 1rem"}} light />
                        <Box
                            component="form"
                            autoComplete="off"
                            noValidate
                            flexDirection="column"
                            onSubmit={async (e: any) => {
                                e.preventDefault();
                                const { backing, odds, stake } = formData[marketOutcome];
                                await placeBet(marketOutcome, marketOutcomeIndex);
                            }}
                        >
                            <Box sx={{ marginBottom: '1rem' }}>
                                <FormControl>
                                    <FormLabel id="bet-type">Backing</FormLabel>
                                    <RadioGroup
                                        aria-labelledby="bet-type-label"
                                        defaultValue="back"
                                        name="bet-type"
                                        onChange={updateForm(marketOutcome, 'backing')}
                                        value={formData[marketOutcome].backing}
                                    >
                                        <FormControlLabel value="back" control={<Radio />} label="Back" />
                                        <FormControlLabel value="lay" control={<Radio />} label="Lay" />
                                    </RadioGroup>
                                </FormControl>
                            </Box>
                            <Box sx={{ marginBottom: '1rem' }}>
                            <FormControl fullWidth>
                                <InputLabel id="odds-ladder">Odds</InputLabel>
                                <Select
                                    labelId="odds-ladder-label"
                                    id="odds-ladde-select"
                                    label="Odds"
                                    onChange={((e) => {
                                        updateForm(marketOutcome, 'odds')(e as React.ChangeEvent<{value: string }>);
                                    })}
                                    value={formData[marketOutcome].odds}
                                >
                                    {marketOutcomes
                                        ? marketOutcomes[marketOutcomeIndex].oddsLadder.map(odds => (
                                            <MenuItem key={odds} value={odds}>{odds}</MenuItem>
                                        ))
                                        : null
                                    }
                                </Select>
                                </FormControl>
                            </Box>
                            <Box>
                                <TextField
                                    type="number"
                                    label="stake"
                                    sx={{ marginBottom: "1rem"}}
                                    onChange={updateForm(marketOutcome, 'stake')}
                                    value={formData[marketOutcome].stake}
                                 />
                            </Box>
                            <Button type="submit" variant="contained" fullWidth>PlaceBet</Button>
                        </Box>
                    </Card>
                )
            )}
            </Card>
        </Page>
    );

}

export default PlaceBet;
