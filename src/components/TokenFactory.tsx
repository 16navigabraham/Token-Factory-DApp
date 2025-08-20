import React, { useState } from 'react';
import { useTokenFactory } from '../hooks/useTokenFactory';
import toast from 'react-hot-toast';

const TokenFactory: React.FC = () => {
  const {
    account,
    chainId,
    connectWallet,
    switchNetwork,
    createToken,
    userTokens,
    factoryStats,
    loading
  } = useTokenFactory();

  const [formData, setFormData] = useState({
    name: '',
    symbol: '',
    decimals: '18',
    initialSupply: '',
    maxSupply: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.symbol || !formData.initialSupply || !formData.maxSupply) {
      toast.error('Please fill all fields');
      return;
    }

    if (Number(formData.initialSupply) > Number(formData.maxSupply)) {
      toast.error('Initial supply cannot exceed max supply');
      return;
    }

    await createToken(
      formData.name,
      formData.symbol,
      Number(formData.decimals),
      formData.initialSupply,
      formData.maxSupply
    );

    setFormData({
      name: '',
      symbol: '',
      decimals: '18',
      initialSupply: '',
      maxSupply: ''
    });
  };

  const getCurrentNetwork = () => {
    if (chainId === '0x14a34') return 'Base Sepolia';
    if (chainId === '0x2105') return 'Base Mainnet';
    return 'Unknown Network';
  };

  const shortenAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-800">Token Factory</h1>
            <div className="flex items-center gap-4">
              {account ? (
                <>
                  <div className="text-sm">
                    <p className="text-gray-600">Network: {getCurrentNetwork()}</p>
                    <p className="text-gray-600">Account: {shortenAddress(account)}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => switchNetwork('sepolia')}
                      className={`px-3 py-1 rounded text-sm ${
                        chainId === '0x14a34' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-200 hover:bg-gray-300'
                      }`}
                    >
                      Sepolia
                    </button>
                    <button
                      onClick={() => switchNetwork('mainnet')}
                      className={`px-3 py-1 rounded text-sm ${
                        chainId === '0x2105' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-200 hover:bg-gray-300'
                      }`}
                    >
                      Mainnet
                    </button>
                  </div>
                </>
              ) : (
                <button
                  onClick={connectWallet}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Connect your Wallet
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-gray-600 text-sm">Total Tokens</p>
            <p className="text-2xl font-bold">{factoryStats.totalTokens}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-gray-600 text-sm">Total Creators</p>
            <p className="text-2xl font-bold">{factoryStats.totalCreators}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-gray-600 text-sm">Factory Status</p>
            <p className="text-2xl font-bold">
              {factoryStats.isPaused ? '⏸️ Paused' : '✅ Active'}
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Create Token Form */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4">Create New Token</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Token Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="My Token"
                  disabled={!account}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Token Symbol
                </label>
                <input
                  type="text"
                  value={formData.symbol}
                  onChange={(e) => setFormData({ ...formData, symbol: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="MTK"
                  disabled={!account}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Decimals
                </label>
                <select
                  value={formData.decimals}
                  onChange={(e) => setFormData({ ...formData, decimals: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={!account}
                >
                  <option value="6">6</option>
                  <option value="8">8</option>
                  <option value="18">18</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Initial Supply
                </label>
                <input
                  type="number"
                  value={formData.initialSupply}
                  onChange={(e) => setFormData({ ...formData, initialSupply: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="1000000"
                  disabled={!account}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Supply
                </label>
                <input
                  type="number"
                  value={formData.maxSupply}
                  onChange={(e) => setFormData({ ...formData, maxSupply: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="10000000"
                  disabled={!account}
                />
              </div>

              <button
                type="submit"
                disabled={!account || loading || factoryStats.isPaused}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating...' : 'Create Token'}
              </button>
            </form>
          </div>

          {/* User Tokens */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4">Your Tokens</h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {userTokens.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  {account ? 'No tokens created yet' : 'Connect wallet to view your tokens'}
                </p>
              ) : (
                userTokens.map((token, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{token.name} ({token.symbol})</h3>
                        <p className="text-xs text-gray-500 mt-1">
                          {shortenAddress(token.tokenAddress)}
                        </p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded ${
                        token.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {token.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-gray-600">Initial Supply</p>
                        <p className="font-medium">{token.initialSupply}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Max Supply</p>
                        <p className="font-medium">{token.maxSupply}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Decimals</p>
                        <p className="font-medium">{token.decimals}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Created</p>
                        <p className="font-medium text-xs">{token.createdAt}</p>
                      </div>
                    </div>
                    <div className="mt-3">
                      <a
                        href={`${chainId === '0x14a34' 
                          ? 'https://sepolia.basescan.org' 
                          : 'https://basescan.org'}/address/${token.tokenAddress}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        View on Explorer →
                      </a>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenFactory;