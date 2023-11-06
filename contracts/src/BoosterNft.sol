// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./CardNft.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract BoosterNft is ERC721, ERC721Enumerable, ERC721URIStorage, Ownable {
  uint256 private _nextTokenId;
  string private _baseTokenURI;
  address private _cardNftContract;

  uint256[] public boosterIds ;

  string public boosterName;
  uint256 public cardCount;
  // list of CardNft nfts
  mapping(uint256 => uint256[]) public boosterCards;

  constructor(
    address cardNftContract,
    address initialOwner,
    string memory newbaseURI
  ) ERC721("BoosterNft", "BFT") Ownable(initialOwner)  {
    _cardNftContract = cardNftContract;
    _baseTokenURI = newbaseURI;
  }


  function getCardsforBooster(uint256 boosterId) public view returns (uint256[] memory) {
    return boosterCards[boosterId];
  }

  function getBoosterIds( ) public view returns (uint256[] memory) {
    return boosterIds;
  }

  function _update(
    address to,
    uint256 tokenId,
    address auth
  ) internal override(ERC721, ERC721Enumerable) returns (address) {
    return super._update(to, tokenId, auth);
  }

  function safeMint(address to, string memory boosterId, uint256[] memory cards) public returns (uint256) {
    uint256 tokenId = _nextTokenId++;
    _safeMint(to, tokenId);
    _setTokenURI(tokenId, string.concat(_baseTokenURI , boosterId));
    boosterCards[tokenId] = cards;
    boosterIds.push(tokenId);
    return tokenId;
  }

  function _increaseBalance(
    address account,
    uint128 value
  ) internal override(ERC721, ERC721Enumerable) {
    super._increaseBalance(account, value);
  }

  function tokenURI(
    uint256 tokenId
  ) public view override(ERC721, ERC721URIStorage) returns (string memory) {
    return super.tokenURI(tokenId);
  }

  function supportsInterface(
    bytes4 interfaceId
  )
    public
    view
    override(ERC721, ERC721Enumerable, ERC721URIStorage)
    returns (bool)
  {
    return super.supportsInterface(interfaceId);
  }
}
