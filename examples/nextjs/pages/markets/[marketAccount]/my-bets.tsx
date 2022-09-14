import { Orders, OrderAccounts } from "@monaco-protocol/client";
import { Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { BN } from "@project-serum/anchor";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { CancelBetButton } from "../../../components/CancelBetButton";
import { Page } from "../../../components/Page";
import { useProgram } from "../../../context/ProgramProvider";
import { parseProtocolNumber } from "../../../utils/parseProtocolNumber";

const MyBets = () => {
    const { publicKey } = useWallet();
    const { query } = useRouter();
    const program = useProgram();
    const [myBets, setMyBets] = useState<OrderAccounts["orderAccounts"]>();

    const getMyBets = async () => {
        if (!publicKey) {
            return
        }
        const betOrdersResponse = await new Orders(program)
            .filterByMarket(new PublicKey(query.marketAccount as string))
            .filterByPurchaser(publicKey)
            .fetch();
        setMyBets(betOrdersResponse.data.orderAccounts);
    }

    useEffect(() => {
        getMyBets();
    }, []);

    return (
        <Page
            title="My Bets"
            description="Example of displaying all bets for a current market including a button to cancel any unmatched bet."
        >
            {myBets !== undefined
                ? (
                    <Card sx={{
                        padding: '1rem',
                    }}>
                        <TableContainer>
                            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Odds</TableCell>
                                    <TableCell>Bet type</TableCell>
                                    <TableCell>Stake</TableCell>
                                    <TableCell>Unmatched Stake</TableCell>
                                    <TableCell>Potential Payout</TableCell>
                                    <TableCell />
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {myBets.map(myBet => (
                                    <TableRow key={new BN(myBet.account.creationTimestamp).toNumber()}>
                                        <TableCell>{myBet.account.expectedPrice}</TableCell>
                                        <TableCell>{myBet.account.forOutcome ? "FOR" : "AGAINST"}</TableCell>
                                        <TableCell>{parseProtocolNumber(myBet.account.stake)}</TableCell>
                                        <TableCell>{parseProtocolNumber(myBet.account.stakeUnmatched)}</TableCell>
                                        <TableCell>{parseProtocolNumber(myBet.account.payout)}</TableCell>
                                        <TableCell>
                                            <CancelBetButton disabled={parseProtocolNumber(myBet.account.stakeUnmatched) === 0} betOrderPk={myBet.publicKey} />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                            </Table>
                        </TableContainer>
                    </Card>
                ) : null}
        </Page>
    );
}

export default MyBets;
