import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { ethers } from 'ethers'
import * as ethereum from '@/lib/ethereum'
import * as main from '@/lib/main'

import type { } from '@redux-devtools/extension' // required for devtools typing
import { mountStoreDevtool } from 'simple-zustand-devtools'

export type MarketListing = {
  seller: string
  tokenId: number,
  price: number,
  isSold: boolean
}

export interface WalletState {
  details: ethereum.Details | null
  nftContract: main.CardNFT | null
  mainContract: main.Main | null
  marketContract: main.CardMarket | null
  boosterNftContract: main.BoosterNft | null
  updateWallet: () => Promise<void>
  isAdmin: () => boolean
  adminAddress: string
  balance: number
  getMarketplaceOffers: () => Promise<MarketListing[]>
}

export const useWalletStore = create<WalletState>()(
  devtools((set, get) => ({
    details: null,
    nftContract: null,
    mainContract: null,
    adminAddress: '',
    marketContract: null,
    boosterContract: null,
    isAdmin() {
      return get().details?.account === get().adminAddress
    },
    balance: 0,
    updateWallet: async () => {

      const details_ = await ethereum.connect('metamask')
      if (!details_ || !details_?.account) {
        set({ ...get(), details: null })
        return
      }
      const nftContract_ = await main.initNft(details_)
      if (!nftContract_) {
        set({ ...get(), details: null })
        return
      }

      const boosterContract_ = await main.initBoosterNft(details_)
      if (!boosterContract_) {
        set({ ...get(), details: null })
        return
      }

      const mainContract_ = await main.initMain(details_)
      if (!mainContract_) {
        set({ ...get(), details: null })
        return
      }

      const marketContract = await main.initMarket(details_)
      if (!marketContract) {
        set({ ...get(), details: null })
        return
      }

      const balance_ = await details_.provider.getBalance(details_.account)

      const provider = details_.provider
      provider.on('block', async () => {
        if (!details_?.account) return
        const balance_ = await details_.provider.getBalance(details_.account)
        set({ ...get(), balance: +ethers.utils.formatEther(balance_) })
      })
      set({
        ...get(),
        details: details_,
        nftContract: nftContract_,
        mainContract: mainContract_,
        marketContract: marketContract,
        boosterNftContract: boosterContract_,
        adminAddress: await mainContract_.owner(),
        balance: +ethers.utils.formatEther(balance_),
      })
    },
    getMarketplaceOffers: async () => {
      const listings = await get().marketContract?.getListings()
      if (!listings) return []

      const markets: MarketListing[] = listings.map(listing => ({
        seller: listing[0],
        tokenId: Number(listing[1]),
        price: Number(listing[2]),
        isSold: listing[3]
      }))

      return markets
    }
  }))
)

mountStoreDevtool('walletStore', useWalletStore)
