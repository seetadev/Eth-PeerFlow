import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { 
  Wallet, 
  CheckCircle, 
  Clock, 
  User, 
  Calendar, 
  FileText, 
  Shield, 
  AlertTriangle,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { INCIDENT_MANAGER_ADDRESS, INCIDENT_MANAGER_ABI, type IncidentData } from '../lib/contract';
import { DEFAULT_NETWORK } from '../lib/network';

declare global {
  interface Window {
    ethereum?: any;
  }
}

export default function IncidentVerificationDashboard() {
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [incidents, setIncidents] = useState<IncidentData[]>([]);
  const [selectedIncident, setSelectedIncident] = useState<IncidentData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [networkError, setNetworkError] = useState<string>('');
  const [contractError, setContractError] = useState<string>('');
  const [debugInfo, setDebugInfo] = useState<string>('');

  // Connect wallet function
  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask to continue");
      return;
    }

    setIsConnecting(true);
    setNetworkError('');
    setContractError('');
    
    try {
      // Check if user is on the correct network
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      const currentChainId = parseInt(chainId, 16);
      
      if (currentChainId !== DEFAULT_NETWORK.chainId) {
        setNetworkError(`Please switch to ${DEFAULT_NETWORK.name} (Chain ID: ${DEFAULT_NETWORK.chainId})`);
        
        // Try to switch to the correct network
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: DEFAULT_NETWORK.chainIdHex }],
          });
        } catch (switchError: any) {
          // If the network is not added, try to add it
          if (switchError.code === 4902) {
            try {
              await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [
                  {
                    chainId: DEFAULT_NETWORK.chainIdHex,
                    chainName: DEFAULT_NETWORK.name,
                    rpcUrls: [DEFAULT_NETWORK.rpcUrl],
                    blockExplorerUrls: [DEFAULT_NETWORK.blockExplorerUrl],
                    nativeCurrency: DEFAULT_NETWORK.nativeCurrency,
                  },
                ],
              });
            } catch (addError) {
              console.error('Failed to add network:', addError);
              alert(`Please manually add ${DEFAULT_NETWORK.name} to your MetaMask and switch to it.`);
              return;
            }
          } else {
            console.error('Failed to switch network:', switchError);
            alert(`Please manually switch to ${DEFAULT_NETWORK.name} in your MetaMask.`);
            return;
          }
        }
      }

      const browserProvider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await browserProvider.send("eth_requestAccounts", []);
      const signer = await browserProvider.getSigner();
      
      // Create contract instance
      const contractInstance = new ethers.Contract(INCIDENT_MANAGER_ADDRESS, INCIDENT_MANAGER_ABI, signer);
      
      // Test contract connection by trying to get the owner
      try {
        console.log('Testing contract connection...');
        const ownerAddress = await contractInstance.owner();
        console.log('Contract owner:', ownerAddress);
        
        setContract(contractInstance);
        setWalletAddress(accounts[0]);
        setIsWalletConnected(true);
        setIsOwner(ownerAddress.toLowerCase() === accounts[0].toLowerCase());
        
      } catch (contractErr: any) {
        console.error('Contract connection error:', contractErr);
        setContractError(`Failed to connect to contract at ${INCIDENT_MANAGER_ADDRESS}. Please verify the contract is deployed on ${DEFAULT_NETWORK.name}.`);
        
        // Still set wallet as connected for debugging
        setWalletAddress(accounts[0]);
        setIsWalletConnected(true);
      }

    } catch (error) {
      console.error('Wallet connection error:', error);
      alert("Failed to connect wallet. Please try again.");
    } finally {
      setIsConnecting(false);
    }
  };

  // Fetch all incidents
  const fetchIncidents = async () => {
    if (!contract) {
      console.log('No contract instance available');
      return;
    }

    setIsLoading(true);
    setContractError('');
    
    try {
      console.log('Fetching incidents from contract:', INCIDENT_MANAGER_ADDRESS);
      
      // First try to get the last incident ID
      let lastIncidentId;
      try {
        lastIncidentId = await contract.getLastIncidentId();
        console.log('Last incident ID:', lastIncidentId.toString());
      } catch (error: any) {
        console.error('Error getting last incident ID:', error);
        
        // Check if it's a network/contract issue
        if (error.code === 'CALL_EXCEPTION') {
          setContractError(`Contract call failed. Please ensure you're connected to ${DEFAULT_NETWORK.name} and the contract is deployed at ${INCIDENT_MANAGER_ADDRESS}`);
          return;
        }
        throw error;
      }

      const lastId = Number(lastIncidentId);
      
      if (lastId === 0) {
        console.log('No incidents found');
        setIncidents([]);
        return;
      }

      console.log(`Fetching ${lastId} incidents...`);
      const incidentPromises = [];

      for (let i = 1; i <= lastId; i++) {
        incidentPromises.push(
          contract.getIncident(i).catch((error: any) => {
            console.error(`Error fetching incident ${i}:`, error);
            return null; // Return null for failed fetches
          })
        );
      }

      const incidentResults = await Promise.all(incidentPromises);
      
      // Filter out null results and format valid incidents
      const formattedIncidents: IncidentData[] = incidentResults
        .filter((result, index) => {
          if (!result) {
            console.warn(`Failed to fetch incident ${index + 1}`);
            return false;
          }
          return true;
        })
        .map((result, index) => ({
          id: (index + 1).toString(),
          description: result[1],
          reportedBy: result[2],
          timestamp: new Date(Number(result[3]) * 1000).toLocaleString(),
          verified: result[4]
        }));

      console.log(`Successfully fetched ${formattedIncidents.length} incidents`);
      setIncidents(formattedIncidents);
      
    } catch (error: any) {
      console.error('Error fetching incidents:', error);
      
      let errorMessage = 'Failed to fetch incidents. ';
      
      if (error.code === 'CALL_EXCEPTION') {
        errorMessage += `Please ensure you're connected to ${DEFAULT_NETWORK.name} and the contract is deployed.`;
      } else if (error.code === 'NETWORK_ERROR') {
        errorMessage += 'Network connection issue. Please check your internet connection.';
      } else {
        errorMessage += 'Please try again.';
      }
      
      setContractError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Verify an incident
  const verifyIncident = async (incidentId: string) => {
    if (!contract || !isOwner) {
      alert('Only the contract owner can verify incidents.');
      return;
    }

    setIsVerifying(true);
    try {
      const tx = await contract.verifyIncident(incidentId);
      await tx.wait();
      
      // Refresh incidents after verification
      await fetchIncidents();
      
      // Update selected incident if it was the one verified
      if (selectedIncident && selectedIncident.id === incidentId) {
        setSelectedIncident({
          ...selectedIncident,
          verified: true
        });
      }

      alert('Incident verified successfully!');
    } catch (error) {
      console.error('Error verifying incident:', error);
      alert('Failed to verify incident. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  // Test contract connection function
  const testContract = async () => {
    if (!contract) {
      setDebugInfo('No contract instance available');
      return;
    }

    setDebugInfo('Testing contract connection...');
    
    try {
      // Test 1: Check if contract exists
      const provider = contract.runner?.provider;
      if (provider) {
        const code = await provider.getCode(INCIDENT_MANAGER_ADDRESS);
        setDebugInfo(prev => prev + `\nContract code length: ${code.length} characters`);
        
        if (code === '0x') {
          setDebugInfo(prev => prev + '\n❌ No contract deployed at this address');
          setContractError('No contract found at the specified address. Please verify the contract is deployed.');
          return;
        } else {
          setDebugInfo(prev => prev + '\n✅ Contract exists at this address');
        }
      }

      // Test 2: Try to call owner()
      try {
        const owner = await contract.owner();
        setDebugInfo(prev => prev + `\n✅ Owner call successful: ${owner}`);
      } catch (err: any) {
        setDebugInfo(prev => prev + `\n❌ Owner call failed: ${err.message}`);
      }

      // Test 3: Try to call getLastIncidentId()
      try {
        const lastId = await contract.getLastIncidentId();
        setDebugInfo(prev => prev + `\n✅ getLastIncidentId successful: ${lastId.toString()}`);
      } catch (err: any) {
        setDebugInfo(prev => prev + `\n❌ getLastIncidentId failed: ${err.message}`);
      }

      // Test 4: Check network
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      const currentChainId = parseInt(chainId, 16);
      setDebugInfo(prev => prev + `\nCurrent Chain ID: ${currentChainId}`);
      setDebugInfo(prev => prev + `\nExpected Chain ID: ${DEFAULT_NETWORK.chainId}`);
      
      if (currentChainId !== DEFAULT_NETWORK.chainId) {
        setDebugInfo(prev => prev + '\n❌ Wrong network!');
      } else {
        setDebugInfo(prev => prev + '\n✅ Correct network');
      }

    } catch (error: any) {
      setDebugInfo(prev => prev + `\n❌ Test failed: ${error.message}`);
    }
  };

  // Fetch incidents when contract is available
  useEffect(() => {
    if (contract) {
      fetchIncidents();
    }
  }, [contract]);

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Shield className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Incident Verification Dashboard</h1>
                <p className="text-gray-600">Admin panel for verifying reported incidents</p>
              </div>
            </div>

            {/* Wallet Connection */}
            <div className="flex items-center space-x-4">
              {!isWalletConnected ? (
                <button
                  onClick={connectWallet}
                  disabled={isConnecting}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center space-x-2"
                >
                  {isConnecting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Connecting...</span>
                    </>
                  ) : (
                    <>
                      <Wallet className="w-4 h-4" />
                      <span>Connect Wallet</span>
                    </>
                  )}
                </button>
              ) : (
                <div className="flex items-center space-x-3">
                  <div className="bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-green-900">
                        {formatAddress(walletAddress)}
                      </span>
                    </div>
                  </div>
                  {isOwner && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Owner
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Owner status warning */}
          {isWalletConnected && !isOwner && (
            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span className="text-sm text-amber-800">
                  You are not the contract owner. Only the owner can verify incidents.
                </span>
              </div>
            </div>
          )}

          {/* Network Error */}
          {networkError && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <span className="text-sm text-red-800">{networkError}</span>
              </div>
            </div>
          )}

          {/* Contract Error */}
          {contractError && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <div>
                  <span className="text-sm text-red-800">{contractError}</span>
                  <div className="mt-2 text-xs text-red-600">
                    <p>Contract Address: {INCIDENT_MANAGER_ADDRESS}</p>
                    <p>Network: {DEFAULT_NETWORK.name} (Chain ID: {DEFAULT_NETWORK.chainId})</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {isWalletConnected && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Debug Info */}
            <div className="lg:col-span-3 mb-4">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Debug Information</h3>
                <div className="text-xs text-gray-600 space-y-1">
                  <p>Contract Address: {INCIDENT_MANAGER_ADDRESS}</p>
                  <p>Network: {DEFAULT_NETWORK.name} (Chain ID: {DEFAULT_NETWORK.chainId})</p>
                  <p>RPC URL: {DEFAULT_NETWORK.rpcUrl}</p>
                  <p>Connected Address: {walletAddress}</p>
                  <p>Is Owner: {isOwner ? 'Yes' : 'No'}</p>
                  <p>Contract Instance: {contract ? 'Connected' : 'Not Connected'}</p>
                </div>
                
                {/* Test Contract Button */}
                {contract && (
                  <div className="mt-3 flex space-x-2">
                    <button
                      onClick={testContract}
                      className="bg-gray-600 hover:bg-gray-700 text-white text-xs px-3 py-1 rounded"
                    >
                      Test Contract Connection
                    </button>
                    {debugInfo && (
                      <button
                        onClick={() => setDebugInfo('')}
                        className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1 rounded"
                      >
                        Clear Debug
                      </button>
                    )}
                  </div>
                )}
                
                {/* Debug Info Display */}
                {debugInfo && (
                  <div className="mt-3 p-2 bg-white border rounded text-xs">
                    <pre className="whitespace-pre-wrap">{debugInfo}</pre>
                  </div>
                )}
              </div>
            </div>
            {/* Incidents List */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">All Incidents</h2>
                    <button
                      onClick={fetchIncidents}
                      disabled={isLoading}
                      className="text-blue-600 hover:text-blue-700 disabled:text-gray-400 flex items-center space-x-1"
                    >
                      <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                      <span className="text-sm">Refresh</span>
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  {isLoading ? (
                    <div className="text-center py-8">
                      <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                      <p className="text-gray-600">Loading incidents...</p>
                    </div>
                  ) : incidents.length === 0 ? (
                    <div className="text-center py-8">
                      <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No incidents found</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {incidents.map((incident) => (
                        <div
                          key={incident.id}
                          onClick={() => setSelectedIncident(incident)}
                          className={`p-4 border rounded-lg cursor-pointer transition-all ${
                            selectedIncident?.id === incident.id
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <span className="text-sm font-medium text-gray-900">
                                  Incident #{incident.id}
                                </span>
                                {incident.verified ? (
                                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    <CheckCircle className="w-3 h-3 mr-1" />
                                    Verified
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                    <Clock className="w-3 h-3 mr-1" />
                                    Pending
                                  </span>
                                )}
                              </div>
                              <div className="text-sm text-gray-600 mb-2">
                                {incident.description.startsWith('http') ? (
                                  <a
                                    href={incident.description}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:text-blue-800 underline break-all line-clamp-2"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    {incident.description}
                                  </a>
                                ) : (
                                  <span className="line-clamp-2 break-words">
                                    {incident.description}
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center space-x-4 text-xs text-gray-500">
                                <span className="flex items-center space-x-1">
                                  <User className="w-3 h-3" />
                                  <span>{formatAddress(incident.reportedBy)}</span>
                                </span>
                                <span className="flex items-center space-x-1">
                                  <Calendar className="w-3 h-3" />
                                  <span>{incident.timestamp}</span>
                                </span>
                              </div>
                            </div>
                            <ExternalLink className="w-4 h-4 text-gray-400" />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Incident Details */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 sticky top-4">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Incident Details</h2>
                </div>

                <div className="p-6">
                  {selectedIncident ? (
                    <div className="space-y-4">
                      {/* Status */}
                      <div>
                        <label className="text-sm font-medium text-gray-700 block mb-1">Status</label>
                        {selectedIncident.verified ? (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Verified
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                            <Clock className="w-4 h-4 mr-2" />
                            Pending Verification
                          </span>
                        )}
                      </div>

                      {/* Incident ID */}
                      <div>
                        <label className="text-sm font-medium text-gray-700 block mb-1">Incident ID</label>
                        <p className="text-sm text-gray-900">#{selectedIncident.id}</p>
                      </div>

                      {/* Description */}
                      <div>
                        <label className="text-sm font-medium text-gray-700 block mb-1">Description</label>
                        <div className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">
                          {selectedIncident.description.startsWith('http') ? (
                            <a
                              href={selectedIncident.description}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 underline break-all"
                            >
                              {selectedIncident.description}
                            </a>
                          ) : (
                            <span className="break-words">
                              {selectedIncident.description}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Reported By */}
                      <div>
                        <label className="text-sm font-medium text-gray-700 block mb-1">Reported By</label>
                        <p className="text-sm text-gray-900 font-mono bg-gray-50 p-2 rounded">
                          {selectedIncident.reportedBy}
                        </p>
                      </div>

                      {/* Timestamp */}
                      <div>
                        <label className="text-sm font-medium text-gray-700 block mb-1">Reported At</label>
                        <p className="text-sm text-gray-900">{selectedIncident.timestamp}</p>
                      </div>

                      {/* Verify Button */}
                      {!selectedIncident.verified && isOwner && (
                        <div className="pt-4 border-t border-gray-200">
                          <button
                            onClick={() => verifyIncident(selectedIncident.id)}
                            disabled={isVerifying}
                            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                          >
                            {isVerifying ? (
                              <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                <span>Verifying...</span>
                              </>
                            ) : (
                              <>
                                <CheckCircle className="w-4 h-4" />
                                <span>Mark as Verified</span>
                              </>
                            )}
                          </button>
                        </div>
                      )}

                      {!selectedIncident.verified && !isOwner && (
                        <div className="pt-4 border-t border-gray-200">
                          <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <AlertTriangle className="w-5 h-5 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-gray-600">
                              Only the contract owner can verify incidents
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">Select an incident to view details</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}