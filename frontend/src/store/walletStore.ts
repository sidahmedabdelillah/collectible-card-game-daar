import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { ethers } from 'ethers'
import * as ethereum from '@/lib/ethereum'
import * as main from '@/lib/main'

import type {} from '@redux-devtools/extension' // required for devtools typing
import { mountStoreDevtool } from 'simple-zustand-devtools'

export interface WalletState {
  details: ethereum.Details | null
  nftContract: main.CardNFT | null
  mainContract: main.Main | null
  updateWallet: () => Promise<void>
  isAdmin: () => boolean
  adminAddress: string
  balance: number
}

export const useWalletStore = create<WalletState>()(
  devtools((set, get) => ({
    details: null,
    nftContract: null,
    mainContract: null,
    adminAddress: '',
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

      const mainContract_ = await main.initMain(details_)
      if (!mainContract_) {
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
        adminAddress: await mainContract_.owner(),
        balance: +ethers.utils.formatEther(balance_),
      })
    },
  }))
)

mountStoreDevtool('walletStore', useWalletStore)
