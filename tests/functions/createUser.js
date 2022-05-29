const anchor = require("@project-serum/anchor");
const SystemProgram = anchor.web3.SystemProgram

async function createUser(program, provider) {
    const userAccount = anchor.web3.Keypair.generate();

    const name = "Dwi Sulfahnur";
    const avatar = "http://en.gravatar.com/dwisulfahnur.json";

    await program.rpc.signupUser(name, avatar, {
        accounts: {
            authority: provider.wallet.publicKey,
            userAccount: userAccount.publicKey,
            systemProgram: SystemProgram.programId,
        },
        signers: [userAccount],
    });

    const user = await program.account.userState.fetch(userAccount.publicKey);
    return { user, userAccount, name, avatar };
}

module.exports = { createUser };