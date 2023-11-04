import axios from 'axios'
import 'dotenv/config'
import { DeployFunction } from 'hardhat-deploy/types'

const MAIN_WALLLET = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'
const BASE_URL = 'http://localhost:3000/api/cards/'

const CARDS_BASE_URL = 'https://api.pokemontcg.io/v2/cards/'

const deployer: DeployFunction = async hre => {
  if (hre.network.config.chainId !== 31337) return
  const { deployer } = await hre.getNamedAccounts()
  // await hre.deployments.deploy('Main', { args:[""] ,from: deployer, log: true })
  const nft = await hre.deployments.deploy('CardNFT', {
    args: [MAIN_WALLLET, BASE_URL],
    from: deployer,
    log: true,
  })

  const main = await hre.deployments.deploy('Main', {
    args: [nft.address, MAIN_WALLLET],
    from: deployer,
    log: true,
  })

  const mainContract = await hre.ethers.getContractAt(
    'Main',
    main.address,
    deployer
  )

  const cards = await axios.get(
    `http://localhost:3000/api/collections/base1/cards`
  )

  const cardIds = cards.data.data.map((c: any) => c.id)
  console.log({ cardIds })
  const tx = await mainContract.createCollection('Base', 'base1', cardIds, 102)
  await tx.wait()
}

export default deployer
