import { http, createConfig } from 'wagmi'
import { baseSepolia, base } from 'wagmi/chains'
import { createWeb3Modal } from '@web3modal/wagmi'
import { walletConnect } from 'wagmi/connectors'

// Get projectId at https://cloud.walletconnect.com
const projectId = 'YOUR_PROJECT_ID'

// Create wagmi config
export const config = createConfig({
  chains: [baseSepolia, base],
  connectors: [
    walletConnect({ projectId })
  ],
  transports: {
    [baseSepolia.id]: http(),
    [base.id]: http()
  }
})

// Create modal
export const modal = createWeb3Modal({
  wagmiConfig: config,
  projectId,
  chains: [baseSepolia, base],
  themeMode: 'dark'
})