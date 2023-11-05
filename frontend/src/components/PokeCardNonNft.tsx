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
import { useWalletStore } from '@/store/walletStore'
import axios, { AxiosResponse } from 'axios'
import { CardType } from '@/layouts/Layout'
import { ethers } from 'ethers'

export default function PokeCardNonNft({
  image,
}: {
  image: string
}) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isFlipped, setIsFliped] = useState(false)
  const [owner, setOwner] = useState<string>('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)

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
        if (imageLoaded) {
          setTimeout(() => setIsFliped(!isFlipped), 500)
        }
      }}
    >

      <img
        src={image}
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
    </div>
  )
}

