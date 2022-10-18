import {
    getMarket,
    MarketAccount,
    getMarketOutcomesByMarket,
    MarketOutcomeAccount,
    getMintInfo,
    findMarketPositionPda,
    createOrder,
    GetAccount,
} from "@monaco-protocol/client";
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
        forOrAgainst: "For" | "Against";
        odds: number;
        stake: number;
    }
}

const defaultFormValues = {
    forOrAgainst: "For" as "For",
    odds: 1.5,
    stake: 0,
};

const PlaceBet = () => {
    const program = useProgram();
    const { query } = useRouter();
    const wallet = useWallet();
    const [market, setMarket] = useState<GetAccount<MarketAccount>>();
    const [marketOutcomes, setMarketOucomes] = useState<GetAccount<MarketOutcomeAccount>[]>();
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
            setMarket(marketResponse.data);
            const marketOutcomeAccountsResponse = await getMarketOutcomesByMarket(program, marketAccount);
            setMarketOucomes(marketOutcomeAccountsResponse.data.marketOutcomeAccounts);
            const defaultFormState = marketOutcomeAccountsResponse.data.marketOutcomeAccounts.reduce((formState: FormData, { account: { title }}) => ({
                ...formState,
                [title]: defaultFormValues,
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
            const { forOrAgainst, odds, stake } = formData[marketOutcome];
            const marketTokenPk = new PublicKey(market.account.mintAccount);
            const mintInfo = await getMintInfo(program, marketTokenPk);
            const stakeInteger = new BN(stake * 10 ** mintInfo.data.decimals);
            const createOrderResponse = await createOrder(program, marketAccount, marketOutcomeIndex, forOrAgainst === "For", odds, new BN(stakeInteger));
            console.log(createOrderResponse);
        } catch (e) {
            console.error(e);
        }
    }

    useEffect(() => {
        getMarketData();
    }, []);

    const getMarketPosition = async (walletPk: PublicKey) => {
        try {
            const res = await findMarketPositionPda(program, marketAccount, walletPk)
        } catch (e) {
            console.error(e)
        }
    }
    useEffect(() => {
        if (!wallet.publicKey) {
            return
        }
        getMarketPosition(wallet.publicKey)
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

            {formData && marketOutcomes?.map(({ account: { title }}, marketOutcomeIndex) =>
                (
                    <Card
                        key={title}
                        elevation={3}
                        sx={{ padding: "2rem", marginBottom: {
                            xs: '1rem',
                            lg: '0',
                        } }}
                    >
                        <Typography variant="h5">{title}</Typography>
                        <Divider sx={{ margin: "0.2rem 0 1rem"}} light />
                        <Box
                            component="form"
                            autoComplete="off"
                            noValidate
                            flexDirection="column"
                            onSubmit={async (e: any) => {
                                e.preventDefault();
                                await placeBet(title, marketOutcomeIndex);
                            }}
                        >
                            <Box sx={{ marginBottom: '1rem' }}>
                                <FormControl>
                                    <FormLabel id="bet-type">For or against</FormLabel>
                                    <RadioGroup
                                        aria-labelledby="bet-type-label"
                                        defaultValue="back"
                                        name="bet-type"
                                        onChange={updateForm(title, 'forOrAgainst')}
                                        value={formData[title].forOrAgainst}
                                    >
                                        <FormControlLabel value="forOutcome" control={<Radio />} label="For" />
                                        <FormControlLabel value="againstOutcome" control={<Radio />} label="Against" />
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
                                        updateForm(title, 'odds')(e as React.ChangeEvent<{value: string }>);
                                    })}
                                    value={formData[title].odds}
                                >
                                    {marketOutcomes
                                        ? marketOutcomes[marketOutcomeIndex].account.priceLadder?.map(price => (
                                            <MenuItem key={price} value={price}>{price}</MenuItem>
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
                                    onChange={updateForm(title, 'stake')}
                                    value={formData[title].stake}
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
