const hre = require("hardhat");


async function main() {
  const Upload = await hre.ethers.deployContract("Upload"); //fetching bytecode and ABI
  
  await Upload.waitForDeployment();//deploying your smart contract

  console.log("Deployed contract address:",`${Upload.target}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});