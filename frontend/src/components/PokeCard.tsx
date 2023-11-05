import { useMemo, useState } from 'react'
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
import { useWalletStore } from '@/store/walletStore'
import axios, { AxiosResponse } from 'axios'
import { CardType } from '@/layouts/Layout'
import { ethers } from 'ethers'

export default function PokeCard({
  nftId,
}: {
  nftId: number
}) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isFlipped, setIsFliped] = useState(false)
  const [cardInfo, setCardInfo] = useState<CardType>()
  const [owner, setOwner] = useState<string>('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const walletStore = useWalletStore()

  const isOwner = useMemo(
    () => owner == walletStore.details?.account,
    [walletStore.details, owner]
  )

  const transferNft = async (address: string) => {
    if (!isOwner || !owner) {
      // TODO falsh error
      return
    }
    const isValid = ethers.utils.isAddress(address)
    if (!isValid) {
      // TODO falsh error
      return
    }

    const tx = await walletStore.nftContract?.transferFrom(
      owner,
      address,
      nftId
    )
    await tx.wait()
    setIsDialogOpen(false)
    const newOwner = await walletStore.nftContract?.ownerOf(nftId)
    if (newOwner) {
      setOwner(newOwner)
    }
  }

  const getInfo = async () => {
    setIsLoading(true)
    try {
      const reqUri = await walletStore.nftContract?.tokenURI(nftId)
      const owner = await walletStore.nftContract?.ownerOf(nftId)
      if (owner) {
        setOwner(owner)
      }
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

  return (
    <div
      className="card"
      style={{
        position: 'relative',
        height: '300px',
        transform: isFlipped ? 'rotateY(180deg)' : '',
        transition: 'all 0.5s',
        cursor: 'pointer',
      }}
      onClick={async () => {
        await getInfo()
        if (imageLoaded) {
          setTimeout(() => setIsFliped(!isFlipped), 500)
        }
      }}
    >
      {!isFlipped ? (
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
          <Skeleton
            variant="rectangular"
            style={{ position: 'absolute', width: '100%', height: '100%' }}
          />
        </>
      ) : (
        <Box
          sx={{
            width: '100%',
            height: '100%',
            color: 'white',
            transform: 'rotateY(180deg)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
          padding="10px"
          bgcolor="#281A3B"
        >
          <Box>
            <Typography variant="h6" component="div">
              Properties:
            </Typography>
            <Typography variant="body2">Name : {cardInfo?.name}</Typography>
            <Typography variant="body2">Level: {cardInfo?.level}</Typography>
            <Typography variant="body2">Health: {cardInfo?.hp}</Typography>
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Chip
              label={
                owner == walletStore.details?.account
                  ? 'You own this'
                  : 'Not yours'
              }
              variant="filled"
              sx={{
                marginBottom: '10px',
                backgroundColor:
                  owner == walletStore.details?.account ? 'green' : 'red',
              }}
            />
            {owner == walletStore.details?.account && (
              <Button
                color="error"
                variant="contained"
                onClick={() => setIsDialogOpen(true)}
              >
                Transfer Card
              </Button>
            )}
          </Box>
        </Box>
      )}
      <TransferCardDialog
        isOpen={isDialogOpen}
        name={cardInfo?.name}
        setIsOpen={setIsDialogOpen}
        transferNft={transferNft}
      />
    </div>
  )
}

const TransferCardDialog = ({
  isOpen,
  setIsOpen,
  name,
  transferNft,
}: {
  isOpen: boolean
  name?: string
  setIsOpen: (val: boolean) => void
  transferNft: (ad: string) => Promise<void>
}) => {
  const [address, setAddress] = useState('')

  const handleClose = () => {
    setIsOpen(false)
  }

  return (
    <>
      <Dialog open={isOpen} onClose={handleClose}>
        <DialogTitle>Transfer NFT </DialogTitle>
        <DialogContent>
          <DialogContentText>
            To Transfer the NFT {name}, please enter the address of the person
            receiving the NFT. please note that you will be charged a fee for
            this transaction.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="address"
            label="Receiver address"
            type="string"
            fullWidth
            variant="standard"
            value={address}
            onChange={e => setAddress(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={() => transferNft(address)}>Send</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
