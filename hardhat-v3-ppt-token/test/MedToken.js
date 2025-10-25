import { expect } from 'chai';
import hre from 'hardhat';
import { loadFixture } from '@nomicfoundation/hardhat-toolbox-viem/network-helpers';
import { parseEther } from 'viem';

describe("PPT Token and MedInvoice Contract", () => {
    async function deployContractsFixture() {
        const [owner, addr1, addr2] = await hre.viem.getWalletClients();

        // Deploy PPT Token
        const pptToken = await hre.viem.deployContract("PPTToken", [parseEther("1000000")]);

        // Deploy MedInvoice Contract
        const medInvoiceContract = await hre.viem.deployContract("MedInvoiceContract", [pptToken.address]);

        const publicClient = await hre.viem.getPublicClient();

        return {
            pptToken,
            medInvoiceContract,
            owner,
            addr1,
            addr2,
            publicClient
        };
    }

    describe('PPT Token Deployment', () => {
        it('Should set the correct total supply', async () => {
            const { pptToken, publicClient } = await loadFixture(deployContractsFixture);
            const totalSupply = await publicClient.readContract({
                address: pptToken.address,
                abi: pptToken.abi,
                functionName: 'totalSupply'
            });
            expect(totalSupply).to.equal(parseEther("1000000"));
        });

        it('Should assign the total supply to the owner', async () => {
            const { pptToken, owner, publicClient } = await loadFixture(deployContractsFixture);
            const ownerBalance = await publicClient.readContract({
                address: pptToken.address,
                abi: pptToken.abi,
                functionName: 'balanceOf',
                args: [owner.account.address]
            });
            expect(ownerBalance).to.equal(parseEther("1000000"));
        });
    });

    describe('PPT Token Transactions', () => {
        it('Should transfer tokens between accounts', async () => {
            const { pptToken, owner, addr1, publicClient } = await loadFixture(deployContractsFixture);

            // Transfer tokens from owner to addr1
            await pptToken.write.transfer([addr1.account.address, parseEther("50")], {
                account: owner.account
            });

            const addr1Balance = await publicClient.readContract({
                address: pptToken.address,
                abi: pptToken.abi,
                functionName: 'balanceOf',
                args: [addr1.account.address]
            });
            expect(addr1Balance).to.equal(parseEther("50"));
        });

        it('Should update balances after transfers', async () => {
            const { pptToken, owner, addr1, publicClient } = await loadFixture(deployContractsFixture);

            const initialOwnerBalance = await publicClient.readContract({
                address: pptToken.address,
                abi: pptToken.abi,
                functionName: 'balanceOf',
                args: [owner.account.address]
            });

            await pptToken.write.transfer([addr1.account.address, parseEther("100")], {
                account: owner.account
            });

            const finalOwnerBalance = await publicClient.readContract({
                address: pptToken.address,
                abi: pptToken.abi,
                functionName: 'balanceOf',
                args: [owner.account.address]
            });

            expect(finalOwnerBalance).to.equal(initialOwnerBalance - parseEther("100"));

            const addr1Balance = await publicClient.readContract({
                address: pptToken.address,
                abi: pptToken.abi,
                functionName: 'balanceOf',
                args: [addr1.account.address]
            });
            expect(addr1Balance).to.equal(parseEther("100"));
        });
    });

    describe('MedInvoice Contract', () => {
        it('Should save files for token holders', async () => {
            const { pptToken, medInvoiceContract, owner, addr1, publicClient } = await loadFixture(deployContractsFixture);

            // Transfer some tokens to addr1
            await pptToken.write.transfer([addr1.account.address, parseEther("10")], {
                account: owner.account
            });

            // Save a file
            await medInvoiceContract.write.saveFile(["test-file-content"], {
                account: addr1.account
            });

            // Get saved files
            const files = await publicClient.readContract({
                address: medInvoiceContract.address,
                abi: medInvoiceContract.abi,
                functionName: 'getFiles',
                args: [],
                account: addr1.account
            });

            expect(files).to.have.lengthOf(1);
            expect(files[0]).to.equal("test-file-content");
        });

        it('Should get user token balance', async () => {
            const { medInvoiceContract, owner, publicClient } = await loadFixture(deployContractsFixture);

            const balance = await publicClient.readContract({
                address: medInvoiceContract.address,
                abi: medInvoiceContract.abi,
                functionName: 'getUserTokens',
                args: [],
                account: owner.account
            });

            expect(balance).to.equal(parseEther("1000000"));
        });
    });
});