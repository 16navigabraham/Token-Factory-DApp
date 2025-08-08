import { useState, useEffect, useCallback } from 'react';
import { ethers, Contract, BrowserProvider } from 'ethers';
import { FACTORY_ABI, FACTORY_ADDRESSES, NETWORKS } from '../config/contracts';
import toast from 'react-hot-toast';

interface TokenInfo {
  tokenAddress: string;
  name: string;
  symbol: string;
  decimals: number;
  initialSupply: string;
  maxSupply: string;
  creator: string;
  createdAt: string;
  isActive: boolean;
}

export const useTokenFactory = () => {
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [contract, setContract] = useState<Contract | null>(null);
  const [account, setAccount] = useState<string>('');
  const [chainId, setChainId] = useState<string>('');
  const [userTokens, setUserTokens] = useState<TokenInfo[]>([]);
  const [factoryStats, setFactoryStats] = useState({ totalTokens: 0, totalCreators: 0, isPaused: false });
  const [loading, setLoading] = useState(false);

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        toast.error('Please install MetaMask!');
        return;
      }

      const provider = new BrowserProvider(window.ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);
      const signer = await provider.getSigner();
      const network = await provider.getNetwork();
      const chainId = '0x' + network.chainId.toString(16);

      setProvider(provider);
      setSigner(signer);
      setAccount(accounts[0]);
      setChainId(chainId);

      const factoryAddress = FACTORY_ADDRESSES[chainId as keyof typeof FACTORY_ADDRESSES];
      if (factoryAddress) {
        const contract = new Contract(factoryAddress, FACTORY_ABI, signer);
        setContract(contract);
        toast.success('Wallet connected!');
      } else {
        toast.error('Please switch to Base Sepolia or Base Mainnet');
      }
    } catch (error) {
      console.error('Connection error:', error);
      toast.error('Failed to connect wallet');
    }
  };

  const switchNetwork = async (network: 'sepolia' | 'mainnet') => {
    try {
      const networkConfig = network === 'sepolia' ? NETWORKS.BASE_SEPOLIA : NETWORKS.BASE_MAINNET;
      
      if (network === 'mainnet' && !FACTORY_ADDRESSES['0x2105']) {
        toast.error('Mainnet contract address not configured yet');
        return;
      }

      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: networkConfig.chainId }],
      });
    } catch (error: any) {
      if (error.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [network === 'sepolia' ? NETWORKS.BASE_SEPOLIA : NETWORKS.BASE_MAINNET],
          });
        } catch (addError) {
          console.error('Error adding network:', addError);
          toast.error('Failed to add network');
        }
      } else {
        console.error('Error switching network:', error);
        toast.error('Failed to switch network');
      }
    }
  };

  const createToken = async (
    name: string,
    symbol: string,
    decimals: number,
    initialSupply: string,
    maxSupply: string
  ) => {
    if (!contract) {
      toast.error('Please connect wallet first');
      return;
    }

    setLoading(true);
    try {
      const initialSupplyWei = ethers.parseUnits(initialSupply, decimals);
      const maxSupplyWei = ethers.parseUnits(maxSupply, decimals);

      const tx = await contract.createToken(name, symbol, decimals, initialSupplyWei, maxSupplyWei);
      toast.loading('Creating token...', { id: 'create' });
      
      const receipt = await tx.wait();
      toast.success('Token created successfully!', { id: 'create' });
      
      await loadUserTokens();
      await loadFactoryStats();
      
      return receipt;
    } catch (error) {
      console.error('Error creating token:', error);
      toast.error('Failed to create token', { id: 'create' });
    } finally {
      setLoading(false);
    }
  };

  const loadUserTokens = async () => {
    if (!contract || !account) return;

    try {
      const tokenAddresses = await contract.getCreatorTokens(account);
      const tokenInfos = await Promise.all(
        tokenAddresses.map(async (address: string) => {
          const info = await contract.getTokenInfo(address);
          return {
            tokenAddress: info.tokenAddress,
            name: info.name,
            symbol: info.symbol,
            decimals: Number(info.decimals),
            initialSupply: ethers.formatUnits(info.initialSupply, info.decimals),
            maxSupply: ethers.formatUnits(info.maxSupply, info.decimals),
            creator: info.creator,
            createdAt: new Date(Number(info.createdAt) * 1000).toLocaleString(),
            isActive: info.isActive
          };
        })
      );
      setUserTokens(tokenInfos);
    } catch (error) {
      console.error('Error loading tokens:', error);
    }
  };

  const loadFactoryStats = async () => {
    if (!contract) return;

    try {
      const stats = await contract.getFactoryStats();
      setFactoryStats({
        totalTokens: Number(stats.totalTokens),
        totalCreators: Number(stats.totalCreators),
        isPaused: stats.isPaused
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  useEffect(() => {
    if (contract) {
      loadUserTokens();
      loadFactoryStats();
    }
  }, [contract, account]);

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        setAccount(accounts[0] || '');
      });

      window.ethereum.on('chainChanged', (chainId: string) => {
        window.location.reload();
      });
    }
  }, []);

  return {
    account,
    chainId,
    connectWallet,
    switchNetwork,
    createToken,
    userTokens,
    factoryStats,
    loading
  };
};