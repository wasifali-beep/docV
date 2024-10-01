// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract RealEstateToken is ERC721, Ownable {
    uint256 private _currentTokenId = 0;

    struct Property {
        string description;
        string location;
        string ipfsHash; // Stores IPFS hash of the property metadata
        string documentIPFSHash; // Stores IPFS hash of the document associated with the property
    }

    mapping(uint256 => Property) private _properties;
    mapping(uint256 => address[]) private _ownershipHistory;

    event PropertyRegistered(uint256 indexed tokenId, address indexed owner, string description, string location, string ipfsHash, string documentIPFSHash);
    event PropertyTransferred(uint256 indexed tokenId, address indexed from, address indexed to);
    event NotificationSent(address indexed to, string message);

    constructor(address initialOwner) ERC721("RealEstateToken", "RET") Ownable(initialOwner) {
        // No additional setup needed
    }

    // Function to register new property
    function registerProperty(
        address to,
        string memory description,
        string memory location,
        string memory ipfsHash,
        string memory documentIPFSHash
    ) public onlyOwner {
        uint256 tokenId = _currentTokenId;
        _properties[tokenId] = Property(description, location, ipfsHash, documentIPFSHash);
        _mint(to, tokenId);
        _currentTokenId++;

        _ownershipHistory[tokenId].push(to);

        emit PropertyRegistered(tokenId, to, description, location, ipfsHash, documentIPFSHash);
        emit NotificationSent(to, "New property registered and assigned to you.");
    }

    // Function to transfer property ownership
    function transferProperty(address from, address to, uint256 tokenId) public onlyOwner {
        require(ownerOf(tokenId) == from, "Transfer from incorrect owner");
        require(to != address(0), "Transfer to the zero address");

        _transfer(from, to, tokenId);
        _ownershipHistory[tokenId].push(to);

        emit PropertyTransferred(tokenId, from, to);
        emit NotificationSent(to, "You have received a new property.");
        emit NotificationSent(from, "Your property has been transferred.");
    }

    // Function to get property details
    function getPropertyDetails(uint256 tokenId) public view returns (Property memory) {
        return _properties[tokenId];
    }

    // Function to get ownership history
    function getOwnershipHistory(uint256 tokenId) public view returns (address[] memory) {
        return _ownershipHistory[tokenId];
    }
}
