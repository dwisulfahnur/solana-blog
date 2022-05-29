const anchor = require("@project-serum/anchor");
const SystemProgram = anchor.web3.SystemProgram

async function createBlog(program, provider) {
    const blogAccount = anchor.web3.Keypair.generate();
    const genesisPostAccount = anchor.web3.Keypair.generate();
    await program.rpc.initBlog({
        accounts: {
            authority: provider.wallet.publicKey,
            systemProgram: SystemProgram.programId,
            blogAccount: blogAccount.publicKey,
            genesisPostAccount: genesisPostAccount.publicKey,
        },
        signers: [blogAccount, genesisPostAccount]
    });

    const blog = await program.account.blogState.fetch(blogAccount.publicKey);
    return { blog, blogAccount, genesisPostAccount };
}

module.exports = { createBlog, };