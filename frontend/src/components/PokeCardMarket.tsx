import { useMemo, useState, useEffect } from 'react'
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Skeleton,
  TextField,
  Typography,
} from '@mui/material'
import { useWalletStore, MarketListing } from '@/store/walletStore'
import axios, { AxiosResponse } from 'axios'
import { CardType } from '@/layouts/Layout'
import { ethers } from 'ethers'

export default function PokeCardListing({
  listing,
  index,
  refresh
}: {
  listing: MarketListing
  index: number
  refresh: () => Promise<void>
}) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [cardInfo, setCardInfo] = useState<CardType>()
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const walletStore = useWalletStore()

  const isOwner = useMemo(
    () => listing.seller == walletStore.details?.account,
    [walletStore.details, listing]
  )

  const getInfo = async () => {
    setIsLoading(true)
    try {
      const reqUri = await walletStore.nftContract?.tokenURI(listing.tokenId)
      const owner = await walletStore.nftContract?.ownerOf(listing.tokenId)

      if (reqUri) {
        const { data }: AxiosResponse<{ data: CardType }> = await axios.get(
          reqUri
        )


        setCardInfo(data.data)
      }
    } catch (err) {
      console.log(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageLoad = () => {
    setImageLoaded(true)
  }

  useEffect(() => { getInfo() }, [])

  const buyCard = async () => {
    const tx = await walletStore.marketContract?.buyNFT(index, {
      value: ethers.utils.parseEther(listing.price.toString()),
    })

    await tx?.wait()
    await refresh()
  }

  return (
    <div
      className="card"
      style={{
        position: 'relative',
        height: '300px',
        transition: 'all 0.5s',
        cursor: 'pointer',
      }}
    >
      <>
        <img
          src={cardInfo?.images.small}
          onLoad={handleImageLoad}
          style={{
            opacity: imageLoaded ? 1 : 0,
            height: '100%',
            width: '100%',
          }}
        />
        <Box display={'flex'} sx={{
          width: '100%',
          flexDirection: 'column',
        }}>
          <Typography>
            {listing.price} ETH
          </Typography>
          <Button variant='contained' color='success' onClick={buyCard} >
            Buy
          </Button>
        </Box>
        {isLoading && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'rgba(0,0,0,0.7)',
            }}
          >
            <CircularProgress />
          </Box>
        )}
      </>
    </div>
  )
}
