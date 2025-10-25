import hre from "hardhat";
import { formatEther } from "viem";

async function main() {
  console.log("🚀 Starting deployment with Hardhat v3...");

  const [deployer] = await hre.viem.getWalletClients();
  console.log("Deploying contracts with account:", deployer.account.address);

  // Deploy PPT Token with 200 million initial supply (already includes 18 decimals)
  console.log("\n📦 Deploying PPT Token...");
  const pptToken = await hre.viem.deployContract("PPTToken", [200_000_000n]);

  console.log("✅ PPT Token deployed at:", pptToken.address);

  // Deploy MedInvoiceContract with PPT Token address
  console.log("\n📦 Deploying MedInvoiceContract...");
  const medInvoiceContract = await hre.viem.deployContract("MedInvoiceContract", [pptToken.address]);

  console.log("✅ MedInvoiceContract deployed at:", medInvoiceContract.address);

  // Get contract details
  const publicClient = await hre.viem.getPublicClient();

  const totalSupply = await publicClient.readContract({
    address: pptToken.address,
    abi: pptToken.abi,
    functionName: 'totalSupply'
  });

  const ownerBalance = await publicClient.readContract({
    address: pptToken.address,
    abi: pptToken.abi,
    functionName: 'balanceOf',
    args: [deployer.account.address]
  });

  console.log("\n📊 Deployment Summary:");
  console.log("======================");
  console.log("Network: localhost");
  console.log("Deployer:", deployer.account.address);
  console.log("PPT Token:", pptToken.address);
  console.log("MedInvoiceContract:", medInvoiceContract.address);
  console.log("Total Supply:", formatEther(totalSupply), "PPT");
  console.log("Owner Balance:", formatEther(ownerBalance), "PPT");

  return {
    pptToken: pptToken.address,
    medInvoiceContract: medInvoiceContract.address,
    deployer: deployer.account.address
  };
}

main()
  .then((addresses) => {
    console.log("\n🎉 Migration to Hardhat v3 completed successfully!");
    console.log("📋 Contract addresses saved for testing");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });