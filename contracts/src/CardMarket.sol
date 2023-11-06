// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CardMarket is Ownable {
  ERC721 public nftContract; // The ERC721 NFT contract

  struct Listing {
    address seller;
    uint256 tokenId;
    uint256 price;
    bool isSold;
  }

  Listing[] public listings;

  event NFTListed(
    address indexed seller,
    uint256 indexed tokenId,
    uint256 price
  );
  event NFTSold(
    address indexed buyer,
    address indexed seller,
    uint256 indexed tokenId,
    uint256 price
  );

  constructor(
    address _nftContractAddress,
    address intialOwner
  ) Ownable(intialOwner) {
    nftContract = ERC721(_nftContractAddress);
  }

  function listNFT(uint256 _tokenId, uint256 _price) external {
    require(
      nftContract.ownerOf(_tokenId) == msg.sender,
      "You don't own this NFT"
    );
    require(
      _price >= 0 ether,
      "Price must be greater than or equal to the listing price"
    );

    nftContract.approve(address(this), _tokenId);

    listings.push(
      Listing({
        seller: msg.sender,
        tokenId: _tokenId,
        price: _price,
        isSold: false
      })
    );

    emit NFTListed(msg.sender, _tokenId, _price);
  }

  function buyNFT(uint256 _listingIndex) external payable {
    require(_listingIndex < listings.length, "Invalid listing index");
    Listing storage listing = listings[_listingIndex];

    require(!listing.isSold, "NFT is already sold");
    require(msg.value >= listing.price, "Insufficient funds to purchase");

    // Transfer NFT to the buyer
    nftContract.safeTransferFrom(listing.seller, msg.sender, listing.tokenId);

    // Mark the NFT as sold
    listing.isSold = true;

    // Transfer the payment to the seller
    payable(listing.seller).transfer(listing.price);
  }

  function getListingCount() external view returns (uint256) {
    return listings.length;
  }

  function getListings() external view returns (Listing[] memory) {
    return listings;
  }
}
