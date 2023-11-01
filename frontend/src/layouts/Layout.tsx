import { AppBar } from '@/components/AppBar'
import SideBar from '@/components/SideBar'
import {
  Alert,
  AlertColor,
  Box,
  CssBaseline,
  Snackbar,
  ThemeProvider,
  createTheme,
} from '@mui/material'
import { PropsWithChildren, useEffect, useState } from 'react'
import CardCompenet from '../card-compenet'
import { MainBar } from '@/components/MainBar'
import { useWalletStore } from '@/store/walletStore'
import { useCollectionsStore } from '@/store/collectionsStore'
import axios, { AxiosResponse } from 'axios'
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
  supertype: string
  subtypes: Array<string>
  hp: string
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

export const AdminLayout = ({}: PropsWithChildren) => {
  const walletStore = useWalletStore()
  const collectionsStore = useCollectionsStore()

  const [isSnackBarOpen, setIsSnackbarOpen] = useState(false)
  const [snackBarData, setSnackBarData] = useState({
    message: '',
    severity: 'success',
  })
  const [cardsImages, setCardImages] = useState<string[]>([])

  const onClickAddButton = async (collectionId: string) => {
    try {
      const {
        data: { data },
      }: AxiosResponse<GetCollectionResponse> = await axios.get(
        `https://api.pokemontcg.io/v2/sets/${collectionId}`
      )

      const cards: AxiosResponse<GetCardsReponse> = await axios.get(
        `https://api.pokemontcg.io/v2/cards`,
        {
          params: {
            q: `id:${collectionId}-*`,
          },
        }
      )

      const images = cards.data.data.map(c => c.images.small)
      setCardImages(images)
    } catch (err) {
      setSnackBarData({
        message: 'This set doesnt exist',
        severity: 'error',
      })
      setIsSnackbarOpen(true)
    }
  }

  useEffect(() => {}, [])
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar />
      <SideBar onClickAddButton={onClickAddButton} />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <MainBar />
        <Box sx={{ marginTop: '1%' }}>
          <CardCompenet images={cardsImages} />
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
