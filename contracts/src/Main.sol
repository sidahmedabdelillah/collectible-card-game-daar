// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

import "./Collection.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract Main is Ownable {
  uint private count;

  Collection[] private collections;
  mapping(string => Collection) private collectionsByName;
  mapping(address => Collection[]) private collectionsByAddress;
  mapping(uint256 => Collection) private collectionByCard;
  address private _cardNftContract;

  struct CollectionStruct {
    string name;
    string collectionId;
    uint256 cardCount;
    uint256[] cards;
  }

  constructor(address _address, address _owner) Ownable(_owner) {
    count = 0;
    _cardNftContract = _address;
  }

  function transferCard(address to, uint256 cardId) public {
    Collection collection = collectionByCard[cardId];
    CardNFT cardNFT = CardNFT(_cardNftContract);
    address from = cardNFT.ownerOf(cardId);
    require(msg.sender == from, "You must be the owner of the card !");
    cardNFT.transferFrom(from, to, cardId);
    // check the key
    Collection[] storage toCollection = collectionsByAddress[to];
    for(uint256 i = 0; i < toCollection.length; i++) {
      if(toCollection[i] == collection) {
        return;
      }
    }
    toCollection.push(collection);
  }

  function createCollection(
    string calldata name,
    string calldata collectionId,
    string[] calldata cardIds,
    uint256 cardCount
  ) external onlyOwner {
    Collection newCollection = new Collection(
      name,
      collectionId,
      cardCount,
      _cardNftContract
    );
    CardNFT cardNFT = CardNFT(_cardNftContract);
    for (uint i = 0; i < cardCount; i++) {
      // create card
      uint256 cardId = cardNFT.safeMint(owner(), cardIds[i]);

      // add to cards
      newCollection.addCard(cardId);
      collectionByCard[cardId] = newCollection;
    }

    collections.push(newCollection);
    collectionsByName[name] = newCollection;
  }

  function getCollections() public view onlyOwner returns (CollectionStruct[] memory) {
    // create an array of collectionStructs
    CollectionStruct[] memory collectionStructs = new CollectionStruct[](
      collections.length
    );
    // loop through collections
    for (uint i = 0; i < collections.length; i++) {
      // get collection
      Collection collection = collections[i];
      // get name
      string memory name = collection.name();
      string memory collectionId = collection.collectionId();
      // get cardCount
      uint256 cardCount = collection.cardCount();
      // get cardNftContract
      uint256[] memory cards = collection.getCards();
      // create collectionStruct
      CollectionStruct memory collectionStruct = CollectionStruct(
        name,
        collectionId,
        cardCount,
        cards
      );
      // add to collectionStructs
      collectionStructs[i] = collectionStruct;
    }
    return collectionStructs;
  }

  function getCollectionsByAddress(address _address) public view returns (CollectionStruct[] memory) {
    // create an array of collectionStructs
    // Todo handle the case where the key does not exists
    Collection[] memory userCollections = collectionsByAddress[_address];
    CollectionStruct[] memory collectionStructs = new CollectionStruct[](
      userCollections.length
    );
    CardNFT cardNFT = CardNFT(_cardNftContract);
    // loop through collections
    for (uint i = 0; i < userCollections.length; i++) {
      // get collection
      Collection collection = userCollections[i];
      // get name
      string memory name = collection.name();
      string memory collectionId = collection.collectionId();
      // get cardCount
      uint256 cardCount = collection.cardCount();
      // get cardNftContract
      uint256[] memory cards = collection.getCards();
      uint256 numberOfCards = 0;
      for (uint j = 0; j < cards.length; j++) {
        if(cardNFT.ownerOf(cards[j]) == _address) {
          numberOfCards ++;
        }
      }
      uint256[] memory userCards = new uint256[](numberOfCards);
      uint256 cardIndex = 0;
      for (uint j = 0; j < cards.length; j++) {
        if(cardNFT.ownerOf(cards[j]) == _address) {
          userCards[cardIndex] = cards[j];
          cardIndex ++;
        }
      }
      // create collectionStruct
      CollectionStruct memory collectionStruct = CollectionStruct(
        name,
        collectionId,
        cardCount,
        userCards
      );
      // add to collectionStructs
      collectionStructs[i] = collectionStruct;
    }
    return collectionStructs;
  }

  function getCollectionById(
    uint256 id
  ) public view onlyOwner returns (CollectionStruct memory) {
    Collection collection = collections[id];
    return
      CollectionStruct(
        collection.name(),
        collection.collectionId(),
        collection.cardCount(),
        collection.getCards()
      );
  }

  function getCollectionByName(
    string memory name
  ) public view onlyOwner returns (CollectionStruct memory) {
    Collection collection = collectionsByName[name];
    return
      CollectionStruct(
        collection.name(),
        collection.collectionId(),
        collection.cardCount(),
        collection.getCards()
      );
  }
}
