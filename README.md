# Token Factory DApp

A decentralized application (DApp) that allows users to create and manage custom ERC20 tokens on Base network (Sepolia testnet and Mainnet). Built with React, TypeScript, and WalletConnect integration.

## Features

- 🪙 Create custom ERC20 tokens with configurable parameters:
  - Token name
  - Token symbol
  - Decimals
  - Initial supply
  - Maximum supply
- 👛 WalletConnect integration for seamless wallet connectivity
- 🔄 Network switching between Base Sepolia and Base Mainnet
- 📊 View factory statistics:
  - Total tokens created
  - Total unique creators
  - Factory status (active/paused)
- 📜 Track your created tokens:
  - Token addresses
  - Creation dates
  - Supply information
  - Active status
- 🎨 Modern UI with Toast notifications
- 🌐 Base network compatibility

## Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager
- A Web3 wallet (MetaMask, Trust Wallet, etc.)
- WalletConnect-compatible wallet for mobile interactions

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/16navigabraham/Token-Factory-DApp.git
   cd Token-Factory-DApp
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env` file in the root directory and add your WalletConnect Project ID:
   ```env
   VITE_WALLET_CONNECT_PROJECT_ID=your_project_id_here
   ```
   Get your project ID from [WalletConnect Cloud](https://cloud.walletconnect.com)

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

## Usage

1. Connect your wallet using the "Connect Wallet" button
2. Switch to your desired network (Base Sepolia for testing, Base Mainnet for production)
3. Fill in the token creation form:
   - Token Name (e.g., "My Token")
   - Token Symbol (e.g., "MTK")
   - Decimals (typically 18)
   - Initial Supply (amount to mint at creation)
   - Maximum Supply (maximum possible supply)
4. Click "Create Token" and confirm the transaction in your wallet
5. Wait for the transaction to be confirmed
6. View your created tokens in the "My Tokens" section

## Network Configuration

### Base Sepolia (Testnet)
- Chain ID: 84532
- RPC URL: https://sepolia.base.org
- Block Explorer: https://sepolia.basescan.org

### Base Mainnet
- Chain ID: 8453
- RPC URL: https://mainnet.base.org
- Block Explorer: https://basescan.org

## Tech Stack

- React + TypeScript
- Vite
- Wagmi (Ethereum hooks)
- WalletConnect SDK
- Ethers.js
- TailwindCSS
- React Hot Toast

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Base Network](https://base.org) - L2 Ethereum scaling solution
- [WalletConnect](https://walletconnect.com) - Web3 messaging layer
- [Wagmi](https://wagmi.sh) - React hooks for Ethereum
- [Ethers.js](https://docs.ethers.org) - Ethereum library

## Support

For support, please open an issue in the GitHub repository or reach out to the maintainers.
