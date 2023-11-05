import { ethers } from 'ethers'
import * as ethereum from './ethereum'
import { contracts } from '@/contracts.json'
import type { CardNFT } from '$/src/CardNft.sol/CardNFT'
import type { CardMarket } from '$/src/CardMarket'
import type { BoosterNft } from '$/src/BoosterNft'

import type { Main } from '$/src/Main'
export type { CardNFT, Main, CardMarket, BoosterNft }

export const correctChain = () => {
  return 31337
}

export const initMain = async (details: ethereum.Details) => {
  const { provider, signer } = details
  const network = await provider.getNetwork()
  if (correctChain() !== network.chainId) {
    console.error('Please switch to HardHat')
    return null
  }
  const { address, abi } = contracts.Main
  const contract = new ethers.Contract(address, abi, provider)
  const deployed = await contract.deployed()
  if (!deployed) return null
  const contract_ = signer ? contract.connect(signer) : contract
  return contract_ as any as Main
}

export const initNft = async (details: ethereum.Details) => {
  const { provider, signer } = details
  const network = await provider.getNetwork()
  if (correctChain() !== network.chainId) {
    console.error('Please switch to HardHat')
    return null
  }
  const { address, abi } = contracts.CardNFT
  const contract = new ethers.Contract(address, abi, provider)
  const deployed = await contract.deployed()
  if (!deployed) return null
  const contract_ = signer ? contract.connect(signer) : contract
  return contract_ as any as CardNFT
}

export const initMarket = async (details: ethereum.Details) => {
  const {provider, signer} = details

  const network = await provider.getNetwork()
  if (correctChain() !== network.chainId) {
    console.error('Please switch to HardHat')
    return null
  }

  const { address, abi } = contracts.CardMarket
  const contract = new ethers.Contract(address, abi, provider)
  const deployed = await contract.deployed()
  if (!deployed) return null
  const contract_ = signer ? contract.connect(signer) : contract
  return contract_ as any as CardMarket
}

export const initBoosterNft = async (details: ethereum.Details) => {
  const {provider, signer} = details

  const network = await provider.getNetwork()
  if (correctChain() !== network.chainId) {
    console.error('Please switch to HardHat')
    return null
  }
}

export const cardNft = () => contracts.CardNFT
