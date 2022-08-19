import { createBetOrder, getMarket, MarketAccount, getMarketOutcomeAccounts, MarketOutcomeAccounts } from "@monacoprotocol/client";
import { PublicKey } from "@solana/web3.js";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useProgram } from "../../../context/ProgramProvider";
import { Box, Button, Card, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, TextField } from "@mui/material";
import { BN } from "@project-serum/anchor";

const PlaceBet = () => {
    const program = useProgram();
    const { query } = useRouter();
    const [market, setMarket] = useState<MarketAccount>();
    const [marketOutcomes, setMarketOucomes] = useState<MarketOutcomeAccounts>();

    const marketAccount = new PublicKey(query.marketAccount as string)

    const getMarketData = async () => {
        try {
            const marketResponse = await getMarket(program, marketAccount);
            setMarket(marketResponse.data.account);
            const marketOutcomeAccountsResponse = await getMarketOutcomeAccounts(program, marketAccount, marketResponse.data.account.marketOutcomes);
            setMarketOucomes(marketOutcomeAccountsResponse.data);
        } catch (e) {
            console.error(e);
        }
    }

    const placeBet = async (...args: Parameters<typeof createBetOrder>) => {
        try {
            const createBetOrderResposne = await createBetOrder(...args);
            console.log('createBetOrderResposne', createBetOrderResposne);
        } catch (e) {
            console.error(e);
        }
    }

    useEffect(() => {
        getMarketData();
    }, []);

    return (
        <>
            {market?.marketOutcomes.map((marketOutcome, marketOutcomeIndex) =>
                (<Box key={marketOutcome} marginBottom="1rem">
                    <Card>
                    <Box padding="2rem">
                        <h2>{marketOutcome}</h2>
                        <Box
                            component="form"
                            autoComplete="off"
                            noValidate
                            flexDirection="column"
                            onSubmit={(e: any) => {
                                e.preventDefault();
                                const backing = true;
                                const odds = 0.1;
                                const stake = new BN(1);
                                console.log({marketAccount, marketOutcomeIndex, backing, odds, stake, program })
                                placeBet(program, marketAccount, marketOutcomeIndex, backing, odds, stake);
                            }}
                        >
                            <Box marginBottom="1rem">
                                <FormControl>
                                    <FormLabel id="bet-type">Backing</FormLabel>
                                    <RadioGroup
                                        aria-labelledby="bet-type-label"
                                        defaultValue="back"
                                        name="bet-type"
                                        onChange={(e) => {
                                            console.log(e.target.value);
                                        }}
                                    >
                                        <FormControlLabel value="back" control={<Radio />} label="Back" />
                                        <FormControlLabel value="lay" control={<Radio />} label="Lay" />
                                    </RadioGroup>
                                </FormControl>
                            </Box>
                            <Box marginBottom="1rem">
                                <TextField type="number" label="stake" />
                            </Box>
                            <Button type="submit">PlaceBet</Button>
                        </Box>
                    </Box>
                </Card>
                </Box>
                )
            )}
        </>
    );

}

export default PlaceBet;
