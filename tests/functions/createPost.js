const anchor = require("@project-serum/anchor");
const SystemProgram = anchor.web3.SystemProgram

async function createPost(program, provider, blogAccount, userAccount) {
  const postAccount = anchor.web3.Keypair.generate();
  const title = "Lorem ipsum dolor sit amet";
  const content = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec dapibus libero felis, a ultricies arcu auctor eu. Fusce sed tortor non enim varius consequat eget quis lorem. Vestibulum metus dolor, commodo viverra rutrum a, ultricies vitae dolor.";
  await program.rpc.createPost(title, content, {
    // pass arguments to the program
    accounts: {
      blogAccount: blogAccount.publicKey,
      authority: provider.wallet.publicKey,
      userAccount: userAccount.publicKey,
      postAccount: postAccount.publicKey,
      systemProgram: SystemProgram.programId,
    },
    signers: [postAccount],
  });

  const post = await program.account.postState.fetch(postAccount.publicKey);
  return { post, postAccount, title, content };
}

module.exports = {
  createPost,
};