import { confirmTransaction, findSubcategoryPda, findCategoryPda, createSubcategory, signAndSendInstructions } from "@monaco-protocol/event-client";
import { getProcessArgs, getProgram } from "../utils/utils";
import { web3 } from "@coral-xyz/anchor";

const createNewSubcategory = async (categoryCode: string, name: string, code: string) => {
    const program = await getProgram();
    
    const categoryPda = findCategoryPda(categoryCode, program);
    const subcategoryPda = findSubcategoryPda(categoryPda, code, program);

    const accounts = {
        subcategory: subcategoryPda,
        category: categoryPda,
        payer: program.provider.publicKey,
        systemProgram: web3.SystemProgram.programId,
    };

    const args = {code, name }
    
    const instruction = createSubcategory(args, accounts);
    const signature = await signAndSendInstructions(program, [instruction]);
    await confirmTransaction(program, signature)
};


const args = getProcessArgs(['categoryCode', 'name', 'code'], 'npm run createSubcategory')
createNewSubcategory(args.categoryCode, args.name, args.code)
