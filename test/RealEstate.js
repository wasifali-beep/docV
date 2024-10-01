const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("RealEstateToken Contract", function () {
  let RealEstateToken;
  let realEstateToken;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

    RealEstateToken = await ethers.getContractFactory("RealEstateToken");
    realEstateToken = await RealEstateToken.deploy(owner.address);

    // Wait for the contract to be mined
    await realEstateToken.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the correct owner", async function () {
      expect(await realEstateToken.owner()).to.equal(owner.address);
    });

    it("Should have the correct name and symbol", async function () {
      expect(await realEstateToken.name()).to.equal("RealEstateToken");
      expect(await realEstateToken.symbol()).to.equal("RET");
    });
  });

  describe("Property Registration", function () {
    it("Should allow the owner to register a property", async function () {
      await realEstateToken.registerProperty(
        addr1.address,
        "Beautiful House",
        "123 Main St",
        "QmHash1",
        "QmDocHash1"
      );

      const property = await realEstateToken.getPropertyDetails(0);
      expect(property.description).to.equal("Beautiful House");
      expect(property.location).to.equal("123 Main St");
      expect(property.ipfsHash).to.equal("QmHash1");
      expect(property.documentIPFSHash).to.equal("QmDocHash1");
    });
  });

  describe("Property Transfer", function () {
    beforeEach(async function () {
      await realEstateToken.registerProperty(
        addr1.address,
        "Beautiful House",
        "123 Main St",
        "QmHash1",
        "QmDocHash1"
      );
    });

    it("Should allow the owner to transfer property", async function () {
      await realEstateToken.transferProperty(addr1.address, addr2.address, 0);
      expect(await realEstateToken.ownerOf(0)).to.equal(addr2.address);
    });
  });

  describe("Property Retrieval", function () {
    beforeEach(async function () {
      await realEstateToken.registerProperty(
        addr1.address,
        "Beautiful House",
        "123 Main St",
        "QmHash1",
        "QmDocHash1"
      );
    });

    it("Should return correct property details", async function () {
      const property = await realEstateToken.getPropertyDetails(0);
      expect(property.description).to.equal("Beautiful House");
      expect(property.location).to.equal("123 Main St");
    });

    it("Should return correct ownership history", async function () {
      await realEstateToken.transferProperty(addr1.address, addr2.address, 0);
      const history = await realEstateToken.getOwnershipHistory(0);
      expect(history.length).to.equal(2);
      expect(history[0]).to.equal(addr1.address);
      expect(history[1]).to.equal(addr2.address);
    });
  });
});