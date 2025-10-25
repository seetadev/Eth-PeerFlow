// Network Configuration
// This file contains network settings for the incident verification app

export interface NetworkConfig {
  chainId: number;
  chainIdHex: string;
  name: string;
  rpcUrl: string;
  blockExplorerUrl: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
}

// Hedera Testnet Configuration
export const HEDERA_TESTNET: NetworkConfig = {
  chainId: 296,
  chainIdHex: '0x128',
  name: 'Hedera Testnet',
  rpcUrl: 'https://testnet.hashio.io/api',
  blockExplorerUrl: 'https://hashscan.io/testnet',
  nativeCurrency: {
    name: 'HBAR',
    symbol: 'HBAR',
    decimals: 18,
  },
};

// Hedera Mainnet Configuration
export const HEDERA_MAINNET: NetworkConfig = {
  chainId: 295,
  chainIdHex: '0x127',
  name: 'Hedera Mainnet',
  rpcUrl: 'https://mainnet.hashio.io/api',
  blockExplorerUrl: 'https://hashscan.io/mainnet',
  nativeCurrency: {
    name: 'HBAR',
    symbol: 'HBAR',
    decimals: 18,
  },
};

// Default network (currently Hedera Testnet)
export const DEFAULT_NETWORK = HEDERA_TESTNET;

// Helper function to add/switch network in MetaMask
export const addNetworkToMetaMask = async (network: NetworkConfig): Promise<boolean> => {
  if (!window.ethereum) {
    console.error('MetaMask is not installed');
    return false;
  }

  try {
    await window.ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [
        {
          chainId: network.chainIdHex,
          chainName: network.name,
          rpcUrls: [network.rpcUrl],
          blockExplorerUrls: [network.blockExplorerUrl],
          nativeCurrency: network.nativeCurrency,
        },
      ],
    });
    return true;
  } catch (error) {
    console.error('Failed to add network to MetaMask:', error);
    return false;
  }
};

// Helper function to switch to a specific network
export const switchToNetwork = async (network: NetworkConfig): Promise<boolean> => {
  if (!window.ethereum) {
    console.error('MetaMask is not installed');
    return false;
  }

  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: network.chainIdHex }],
    });
    return true;
  } catch (error: any) {
    // If the network is not added, try to add it
    if (error.code === 4902) {
      return addNetworkToMetaMask(network);
    }
    console.error('Failed to switch network:', error);
    return false;
  }
};

// Helper function to check if user is on the correct network
export const isCorrectNetwork = async (): Promise<boolean> => {
  if (!window.ethereum) {
    return false;
  }

  try {
    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
    return chainId === DEFAULT_NETWORK.chainIdHex;
  } catch (error) {
    console.error('Failed to check network:', error);
    return false;
  }
};

// Helper function to ensure user is on correct network
export const ensureCorrectNetwork = async (): Promise<boolean> => {
  const isCorrect = await isCorrectNetwork();
  if (!isCorrect) {
    return await switchToNetwork(DEFAULT_NETWORK);
  }
  return true;
};