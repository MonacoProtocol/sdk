import { MarketPositions, getMarketOutcomeTitlesByMarket } from "@monaco-protocol/client";
import { PublicKey } from "@solana/web3.js";
import { getProgram, getProcessArgs } from "../utils/utils";
import { AnchorProvider } from "@coral-xyz/anchor";
import { parseResponseData } from "../parsers/parsers";

async function getMarketPositionForWallet(walletPk: PublicKey) {
  const program = await getProgram();
  const provider = program.provider as AnchorProvider;
  const response = await MarketPositions.marketPositionQuery(program)
    .filterByPurchaser(walletPk)
    .filterByPaid(false)
    .fetch();
  response.data = parseResponseData(response.data, 6);
  const positions = {};
  for (const position of response.data.marketPositionAccounts) {
    const outcomeTitles = await getMarketOutcomeTitlesByMarket(program, position.account.market);
    const matchedPosition = position.account.marketOutcomeSums.map((exposure, index) => {
      return {
        outcome: outcomeTitles.data.marketOutcomeTitles[index],
        exposure: exposure,
        unmatched: position.account.unmatchedExposures[index]
      }
    });

    positions[position.account.market.toBase58()] = {
      position: matchedPosition,
    }
  }
  for (const market in positions) {
    console.log(`Market: ${market}`);
    console.table(positions[market].position);
  }
}

const args = getProcessArgs(
  ["walletPk"],
  "npm run getMarketPositionsForWallet"
);
getMarketPositionForWallet(new PublicKey(args.walletPk));
