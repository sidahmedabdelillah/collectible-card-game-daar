import { AppBar } from '@/components/AppBar'
import SideBar from '@/components/SideBar'
import UserSideBar from '@/components/UserSideBar'
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
import { useWalletStore, MarketListing } from '@/store/walletStore'
import { useCollectionsStore } from '@/store/collectionsStore'
import axios, { AxiosResponse } from 'axios'
import PokeCard from '@/components/PokeCard'
import PokeCardListing from '@/components/PokeCardMarket'
// move this to a separate file later

// Basic NAVIGATOR LOL
export type UserPages = "My Cards" | "MarketPlace"

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

export const UserLayout = () => {
  const walletStore = useWalletStore()

  const [isSnackBarOpen, setIsSnackbarOpen] = useState(false)
  const [snackBarData, setSnackBarData] = useState({
    message: '',
    severity: 'success',
  })
  const [cardNfts, setCardNfts] = useState<
    number[]
  >([])

  const [isLoading, setIsLoading] = useState(false)
  const [marketListings, setMarketListings] = useState<MarketListing[]>([])
  const [activePage, setActivePage] = useState<UserPages>("My Cards")


  const getCards = async () => {
    const cards = await walletStore.nftContract?.getTokensForOwner(walletStore.details?.account ?? "")
    console.log({ cards })
    const cardIds = cards?.map((c) => Number(c))
    setCardNfts(cardIds || [])
  }

  const fetchBoosters = async () => {
    walletStore.boosterNftContract
  }


  const loadMarketPlace = async () => {
    const offers = await walletStore.getMarketplaceOffers()
    setMarketListings(offers)
  }

  useEffect(() => {
    const init = async () => {
      await walletStore.updateWallet()
    }

    init()
  }, [])

  const refresh = async () => {
    await walletStore.updateWallet()
    await getCards()
    await loadMarketPlace()
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar />
      <UserSideBar updateNfts={async () => {
        await getCards();
      }
      }
        setActivePage={setActivePage}
        cardCount={cardNfts.length}
        loadMarketPlace={loadMarketPlace}
      />


      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        {/* <MainBar /> */}
        <Box sx={{ marginTop: '3rem' }}>


          {!isLoading ? (
            <>
              {activePage == "My Cards" && (<div className="cards-container">
                {cardNfts.map((ntf, index) => (
                  <PokeCard
                    nftId={ntf}
                    key={index}
                  />
                ))}
              </div>)
              }
              {
                activePage == "MarketPlace" && (
                  <>
                    {
                      marketListings.map((listing, index) => (
                        <PokeCardListing listing={listing} index={index} refresh={refresh} />
                      ))
                    }
                  </>
                )
              }
            </>
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
