import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

import type {} from '@redux-devtools/extension' // required for devtools typing
import { mountStoreDevtool } from 'simple-zustand-devtools'
import { WalletState, useWalletStore } from './walletStore'

export interface Collection {
  name: string
  cardCount: number
  ntfIds: number[]
}

interface CollectionsStore {
  collections: Collection[]
  getCollection: (name: string | number) => Collection
  fetchCollections: () => Promise<void>
}

const collectionStructResponseToCollection = (
  res: [string, bigint, bigint[]]
) => ({
  name: res[0],
  cardCount: Number(res[1]),
  ntfIds: res[2].map(n => Number(n)),
})

export const useCollectionsStore = create<CollectionsStore>()(
  devtools((set, get) => ({
    collections: [],
    getCollection: (name: string | number) => {
      if (typeof name === 'number') return get().collections[name]
      return get().collections.find(c => c.name === name)!
    },
    async fetchCollections() {
      const walletStore = useWalletStore.getState()

      if (!walletStore.mainContract) return

      const collections = await walletStore.mainContract.getCollections()
      set({
        ...get(),
        collections: collections.map(collectionStructResponseToCollection),
      })
    },
  }))
)

mountStoreDevtool('collectionStore', useCollectionsStore)
