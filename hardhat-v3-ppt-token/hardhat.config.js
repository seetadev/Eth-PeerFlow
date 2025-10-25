import "@nomicfoundation/hardhat-toolbox-viem";
import dotenv from 'dotenv';

dotenv.config();

/** @type import('hardhat/config').HardhatUserConfig */
export default {
  solidity: "0.8.20",
  networks: {
    localhost: {
      type: "edr-simulated",
      url: "http://127.0.0.1:8545"
    },
    "calibnet": {
      type: "http",
      url: process.env.RPC_URL || "https://api.calibration.node.glif.io/rpc/v1",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : []
    },
    "filecoin": {
      type: "http",
      url: process.env.RPC_URL || "https://api.node.glif.io",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : []
    },
    "op-sepolia": {
      type: "http",
      url: process.env.RPC_URL || "https://sepolia.optimism.io",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : []
    },
    "op-mainnet": {
      type: "http",
      url: process.env.RPC_URL || "https://mainnet.optimism.io",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : []
    },
    "arbitrumSepolia": {
      type: "http",
      url: process.env.RPC_URL || "https://sepolia-rollup.arbitrum.io/rpc",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : []
    },
    "celo-alfajores": {
      type: "http",
      url: process.env.RPC_URL || "https://alfajores-forno.celo-testnet.org",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : []
    }
  },
  etherscan: {
    apiKey: {
      "calibnet": process.env.VERIFY_KEY,
      "op-sepolia": process.env.VERIFY_KEY,
      "op-mainnet": process.env.VERIFY_KEY,
      "optimism": process.env.VERIFY_KEY,
      "arbitrumSepolia": process.env.VERIFY_KEY,
      "celo-alfajores": process.env.VERIFY_KEY
    },
    customChains: [
      {
        network: "calibnet",
        chainId: 314159,
        urls: {
          apiURL: "https://api.calibration.node.glif.io/rpc/v1",
          browserURL: "https://calibration.filscan.io"
        }
      },
      {
        network: "op-sepolia",
        chainId: 11155420,
        urls: {
          apiURL: "https://api-sepolia-optimistic.etherscan.io/api",
          browserURL: "https://sepolia-optimism.etherscan.io"
        }
      },
      {
        network: "optimism",
        chainId: 10,
        urls: {
          apiURL: "https://api-optimistic.etherscan.io/api",
          browserURL: "https://optimistic.etherscan.io"
        }
      },
      {
        network: "arbitrumSepolia",
        chainId: 421614,
        urls: {
          apiURL: "https://api-sepolia.arbiscan.io/api",
          browserURL: "https://sepolia.arbiscan.io/"
        }
      },
      {
        network: "celo-alfajores",
        chainId: 44787,
        urls: {
            apiURL: "https://api-alfajores.celoscan.io/api",
            browserURL: "https://alfajores.celoscan.io",
        },
      },
      {
        network: "op-mainnet",
        chainId: 10,
        urls: {
          apiURL: "https://api-optimistic.etherscan.io/api",
          browserURL: "https://optimistic.etherscan.io"
        }
      }
    ]
  }
};