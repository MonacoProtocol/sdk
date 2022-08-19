import { Button } from "@mui/material"
import { LoadingButton } from "@mui/lab"
import { cancelBetOrder } from "@monacoprotocol/client";
import { PublicKey } from "@solana/web3.js";
import { useProgram } from "../../context/ProgramProvider";
import { useState } from "react";

type CancelBetButtonProps = {
    betOrderPk: PublicKey;
    disabled: boolean;
}

export const CancelBetButton = ({
    betOrderPk,
    disabled,
}: CancelBetButtonProps) => {
    const [loading, setLoading] = useState(false);
    const program = useProgram();

    const onClick = async() => {
        try {
            await cancelBetOrder(betOrderPk, program);
        } catch (e) {
            console.error(e)
        }
        setLoading(false);
    }

    return (
        <LoadingButton loading={loading} variant="outlined" onClick={onClick} disabled={disabled}>Cancel Bet</LoadingButton>
    );
}