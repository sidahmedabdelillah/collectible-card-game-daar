import { useEffect, useMemo, useRef, useState } from 'react'
import styles from './styles.module.css'
import { useWalletStore } from './store/walletStore'
import { useCollectionsStore } from './store/collectionsStore'

export const App = () => {
  const walletStore = useWalletStore()
  const collectionsStore = useCollectionsStore()

  useEffect(() => {
    async function init() {
      await walletStore.updateWallet()
      await collectionsStore.fetchCollections()
    }
    init()
  }, [])

  const mint = async () => {
    const tx = await walletStore.mainContract?.createCollection(
      'first collection 2',
      20
    )
    await tx?.wait()
  }

  return (
    <div className={styles.body}>
      <h1>{walletStore.isAdmin() ? 'Hello BOSS' : 'Hello budy'}</h1>
      <h1>Balance : {walletStore.balance}</h1>
      <h1>Collections</h1>
      <div>
        {collectionsStore.collections.map(collection => (
          <h1 key={collection.name}>
            {collection.name} - {collection.cardCount}
          </h1>
        ))}
      </div>
      <button onClick={() => mint()}>Mint</button>
    </div>
  )
}
