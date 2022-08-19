import { BN } from "@project-serum/anchor";


export const parseProtocolNumber = (protocolNumber: BN) =>
    new BN(protocolNumber).toNumber() / 10 ** 9;
