import { AppBar } from '@/components/AppBar'
import SideBar from '@/components/SideBar'
import {
  Alert,
  AlertColor,
  Backdrop,
  Box,
  Button,
  CircularProgress,
  CssBaseline,
  Snackbar,
  ThemeProvider,
  createTheme,
} from '@mui/material'
import { PropsWithChildren, useEffect, useState } from 'react'
import { MainBar } from '@/components/MainBar'
import { useWalletStore } from '@/store/walletStore'
import { useCollectionsStore } from '@/store/collectionsStore'
import axios, { AxiosResponse } from 'axios'
import PokeCard from '@/components/PokeCard'
import PokeCardNonNft from '@/components/PokeCardNonNft'
// move this to a separate file later

export type GetCollectionResponse = {
  data: {
    id: string
    name: string
    series: string
    printedTotal: number
    total: number
    legalities: {
      unlimited: string
      standard: string
      expanded: string
    }
    ptcgoCode: string
    releaseDate: string
    updatedAt: string
    images: {
      symbol: string
      logo: string
    }
  }
}

export type CardType = {
  id: string
  name: string
  level: number
  hp: number
  supertype: string
  subtypes: Array<string>
  types: Array<string>
  evolvesTo: Array<string>
  rules: Array<string>
  attacks: Array<{
    name: string
    cost: Array<string>
    convertedEnergyCost: number
    damage: string
    text: string
  }>
  weaknesses: Array<{
    type: string
    value: string
  }>
  retreatCost: Array<string>
  convertedRetreatCost: number
  set: {
    id: string
    name: string
    series: string
    printedTotal: number
    total: number
    legalities: {
      unlimited: string
      expanded: string
    }
    ptcgoCode: string
    releaseDate: string
    updatedAt: string
    images: {
      symbol: string
      logo: string
    }
  }
  number: string
  artist: string
  rarity: string
  nationalPokedexNumbers: Array<number>
  legalities: {
    unlimited: string
    expanded: string
  }
  images: {
    small: string
    large: string
  }
  tcgplayer: {
    url: string
    updatedAt: string
    prices: {
      holofoil: {
        low: number
        mid: number
        high: number
        market: number
        directLow: number
      }
    }
  }
}

export type GetCardsReponse = {
  data: CardType[]
}

export const AdminLayout = ({ }: PropsWithChildren) => {
  const walletStore = useWalletStore()
  const collectionsStore = useCollectionsStore()

  const [isSnackBarOpen, setIsSnackbarOpen] = useState(false)
  const [snackBarData, setSnackBarData] = useState({
    message: '',
    severity: 'success',
  })
  const [cardsImages, setCardImages] = useState<
    { image: string; nftId: number }[]
  >([])
  const [isReadyToMint, setIsReadyToMint] = useState(false)
  const [collectionToMint, setCollectionToMint] = useState<
    GetCollectionResponse['data'] | null
  >(null)
  const [isLoading, setIsLoading] = useState(false)
  const [imagesToMint, setImagesToMint] = useState<{ image: string }[]>([])

  const onClickAddButton = async (collectionId: string) => {
    try {
      setIsLoading(true)
      const {
        data,
      }: AxiosResponse<GetCollectionResponse> = await axios.get(
        `http://localhost:3000/api/sets/${collectionId}`
      )

      console.log("raw response: " ,data)


      setCollectionToMint(data.data)

      const cards: AxiosResponse<GetCardsReponse> = await axios.get(
        `http://localhost:3000/api/collections/${collectionId}/cards`
      )

      const images = cards.data.data.map(c => c.images.small)
      setImagesToMint(images.map(i => ({ image: i })))
      setIsReadyToMint(true)
    } catch (err) {
      setSnackBarData({
        message: 'This set doesnt exist',
        severity: 'error',
      })
      setIsSnackbarOpen(true)
    } finally {
      setIsLoading(false)
    }
  }

  const onClickMintButton = async () => {
    try {
      console.log('minting')
      if (!walletStore.mainContract || !collectionToMint) {
        console.log("returning ", walletStore.mainContract ,collectionToMint)
        return
      }

      setIsLoading(true)
      const cards: AxiosResponse<GetCardsReponse> = await axios.get(
        `http://localhost:3000/api/collections/${collectionToMint.id}/cards`
      )
      console.log('cards ', cards.data.data)
      console.log("minting with input :" ,{
        name: collectionToMint?.name,
        collectionId: collectionToMint?.id,
        cardsIds: cards.data.data.map(c => c.id),
        cardCount: collectionToMint?.total
      })
      const minting = await walletStore.mainContract?.createCollection(
        collectionToMint?.name,
        collectionToMint?.id,
        cards.data.data.map(c => c.id),
        collectionToMint?.total
      )
      console.log('minting ', minting)

      await minting.wait()

      setIsReadyToMint(false)

      await collectionsStore.fetchCollections()

      const activeCollection = collectionsStore.collections.find(
        c => c.collectionId == collectionToMint.id
      )
      if (activeCollection) {
        collectionsStore.setActiveCollection(activeCollection)
      }
      setCollectionToMint(null)
      setIsLoading(false)
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    const unsub = useCollectionsStore.subscribe(async (state, prevState) => {
      console.log('change ', state.activeCollection, prevState.activeCollection)
      if (state.activeCollection == null) {
        return
      }
      console.log('is loading')

      // setIsLoading(true)
      const cards: AxiosResponse<GetCardsReponse> = await axios.get(
        `http://localhost:3000/api/collections/${state.activeCollection.collectionId}/cards`
      )
      // const collections = 
      const images = cards.data.data.map(c => c.images.small)
      setCardImages(
        images.map((i, idx) => ({
          image: i,
          nftId: state.activeCollection?.ntfIds[idx] ?? -1,
        }))
      )

      setIsLoading(false);
    })
    return unsub
  }, [])

  useEffect(() => {
    const init = async () => {
      await walletStore.updateWallet()
      await collectionsStore.fetchCollections()
    }

    init()
  }, [])

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar />
      <SideBar onClickAddButton={onClickAddButton} isAdmin={walletStore.isAdmin()} />


      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        {/* <MainBar /> */}
        <Box sx={{ marginTop: '3rem' }}>
          {isReadyToMint && (
            <Button onClick={onClickMintButton}> Mint Collection </Button>
          )}
          {!isLoading ? (
            <div className="cards-container">
              {
                isReadyToMint && (
                  imagesToMint.map((image, index) => (
                    <PokeCardNonNft image={image.image} key={index} />
                  ))
                )
              }
              {!isReadyToMint && cardsImages.map((image, index) => (
                <PokeCard
                  nftId={image.nftId}
                  key={image.image}
                />
              ))}
            </div>
          ) : (
            <Backdrop
              sx={{ color: '#fff', zIndex: 10 }}
              open={isLoading}
              onClick={() => setIsLoading(false)}
            >
              <CircularProgress color="inherit" />
            </Backdrop>
          )}
        </Box>
      </Box>


      <Snackbar
        open={isSnackBarOpen}
        autoHideDuration={6000}
        onClose={() => setIsSnackbarOpen(false)}
        message={snackBarData.message}
      />
      {isSnackBarOpen && (
        <Alert severity={snackBarData.severity as AlertColor}>
          {snackBarData.message}
        </Alert>
      )}
    </Box>
  )
}
