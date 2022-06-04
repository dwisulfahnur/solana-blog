import { Keypair } from "@solana/web3.js";
import { AnchorProvider, Program } from "@project-serum/anchor";
import { IDL, PROGRAM_KEY, getConnection } from "./program";

export const genUserKey = (PROGRAM_KEY, walletKey) => {
    const userAccount = Keypair.fromSeed(
        new TextEncoder().encode(
            `${PROGRAM_KEY.toString().slice(0, 15)}__${walletKey
                .toString()
                .slice(0, 15)}`
        )
    );
    return userAccount;
};


export const fetchUser = async (wallet) => {
    const connection = getConnection()
    const provider = new AnchorProvider(connection, wallet, {})
    const program = new Program(IDL, PROGRAM_KEY, provider)
    const userAccount = genUserKey(PROGRAM_KEY, wallet.publicKey)

    const _user = await program.account.userState.fetch(userAccount.publicKey)
    return _user
}
