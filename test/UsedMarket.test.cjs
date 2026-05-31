const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("UsedMarket", function () {
  async function deployUsedMarket() {
    const [owner, buyer, stranger, nextBuyer] = await ethers.getSigners();
    const UsedMarket = await ethers.getContractFactory("UsedMarket");
    const usedMarket = await UsedMarket.deploy();
    await usedMarket.waitForDeployment();

    return { usedMarket, owner, buyer, stranger, nextBuyer };
  }

  async function registerSampleItem(usedMarket, signer, overrides = {}) {
    const values = {
      name: "한정판 포토카드 세트",
      description: "소유권 이력 인증 대상 물품",
      listedPrice: ethers.parseEther("0.18"),
      category: "수집품",
      imageUrl: "https://example.com/item.jpg",
      isPublic: true,
      ...overrides
    };

    const tx = await usedMarket.connect(signer).registerItem(
      values.name,
      values.description,
      values.listedPrice,
      values.category,
      values.imageUrl,
      values.isPublic
    );

    return { tx, values };
  }

  it("registers items with itemId starting at 1 and increasing", async function () {
    const { usedMarket, owner } = await deployUsedMarket();

    const { tx } = await registerSampleItem(usedMarket, owner);

    await expect(tx)
      .to.emit(usedMarket, "ItemRegistered")
      .withArgs(1, owner.address, "한정판 포토카드 세트", ethers.parseEther("0.18"), "수집품", true, anyValue);

    await registerSampleItem(usedMarket, owner, { name: "친필 사인 앨범", category: "음반" });

    expect(await usedMarket.nextItemId()).to.equal(3);
    const firstItem = await usedMarket.getItem(1);
    const secondItem = await usedMarket.getItem(2);

    expect(firstItem.itemId).to.equal(1);
    expect(firstItem.currentOwner).to.equal(owner.address);
    expect(secondItem.itemId).to.equal(2);
  });

  it("returns all registered items", async function () {
    const { usedMarket, owner, buyer } = await deployUsedMarket();

    await registerSampleItem(usedMarket, owner);
    await registerSampleItem(usedMarket, buyer, {
      name: "레트로 게임 패키지",
      category: "게임",
      isPublic: false
    });

    const items = await usedMarket.getAllItems();

    expect(items).to.have.lengthOf(2);
    expect(items[0].name).to.equal("한정판 포토카드 세트");
    expect(items[1].category).to.equal("게임");
    expect(items[1].isPublic).to.equal(false);
  });

  it("reverts consistently for missing item ids", async function () {
    const { usedMarket } = await deployUsedMarket();

    await expect(usedMarket.getItem(999)).to.be.revertedWith("Item does not exist");
    await expect(usedMarket.getTransactionHistory(999)).to.be.revertedWith("Item does not exist");
  });

  it("allows only the current owner to update item data before transfer", async function () {
    const { usedMarket, owner, stranger } = await deployUsedMarket();
    await registerSampleItem(usedMarket, owner);

    await expect(
      usedMarket.connect(stranger).updateItem(
        1,
        "수정 시도",
        "권한 없는 수정",
        ethers.parseEther("0.20"),
        "수집품",
        "https://example.com/updated.jpg"
      )
    ).to.be.revertedWith("Only current owner");

    await expect(
      usedMarket.connect(owner).updateItem(
        1,
        "수정된 한정판 포토카드 세트",
        "설명 수정",
        ethers.parseEther("0.20"),
        "수집품",
        "https://example.com/updated.jpg"
      )
    )
      .to.emit(usedMarket, "ItemUpdated")
      .withArgs(1, "수정된 한정판 포토카드 세트", "설명 수정", ethers.parseEther("0.20"), "수집품", "https://example.com/updated.jpg");

    const item = await usedMarket.getItem(1);
    expect(item.name).to.equal("수정된 한정판 포토카드 세트");
    expect(item.listedPrice).to.equal(ethers.parseEther("0.20"));
  });

  it("allows only the current owner to change visibility without changing owner", async function () {
    const { usedMarket, owner, stranger } = await deployUsedMarket();
    await registerSampleItem(usedMarket, owner);

    await expect(usedMarket.connect(stranger).setItemVisibility(1, false)).to.be.revertedWith("Only current owner");

    await expect(usedMarket.connect(owner).setItemVisibility(1, false))
      .to.emit(usedMarket, "ItemVisibilityChanged")
      .withArgs(1, false);

    const item = await usedMarket.getItem(1);
    expect(item.isPublic).to.equal(false);
    expect(item.currentOwner).to.equal(owner.address);
  });

  it("transfers ownership only for public items and records history", async function () {
    const { usedMarket, owner, buyer, nextBuyer } = await deployUsedMarket();
    await registerSampleItem(usedMarket, owner);

    await expect(usedMarket.connect(owner).transferOwnership(1, buyer.address, ethers.parseEther("0.17")))
      .to.emit(usedMarket, "OwnershipTransferred")
      .withArgs(1, owner.address, buyer.address, ethers.parseEther("0.17"), anyValue);

    let item = await usedMarket.getItem(1);
    expect(item.currentOwner).to.equal(buyer.address);
    expect(item.listedPrice).to.equal(ethers.parseEther("0.18"));

    let history = await usedMarket.getTransactionHistory(1);
    expect(history).to.have.lengthOf(1);
    expect(history[0].from).to.equal(owner.address);
    expect(history[0].to).to.equal(buyer.address);
    expect(history[0].transactionPrice).to.equal(ethers.parseEther("0.17"));

    await usedMarket.connect(buyer).transferOwnership(1, nextBuyer.address, ethers.parseEther("0.21"));
    history = await usedMarket.getTransactionHistory(1);
    item = await usedMarket.getItem(1);

    expect(history).to.have.lengthOf(2);
    expect(history[1].from).to.equal(buyer.address);
    expect(history[1].to).to.equal(nextBuyer.address);
    expect(item.currentOwner).to.equal(nextBuyer.address);
    expect(item.listedPrice).to.equal(ethers.parseEther("0.18"));
  });

  it("blocks ownership transfer by non-owner, to zero address, to self, and for private items", async function () {
    const { usedMarket, owner, buyer, stranger } = await deployUsedMarket();
    await registerSampleItem(usedMarket, owner, { isPublic: false });

    await expect(
      usedMarket.connect(owner).transferOwnership(1, buyer.address, ethers.parseEther("0.17"))
    ).to.be.revertedWith("Item must be public");

    await usedMarket.connect(owner).setItemVisibility(1, true);

    await expect(
      usedMarket.connect(stranger).transferOwnership(1, buyer.address, ethers.parseEther("0.17"))
    ).to.be.revertedWith("Only current owner");

    await expect(
      usedMarket.connect(owner).transferOwnership(1, ethers.ZeroAddress, ethers.parseEther("0.17"))
    ).to.be.revertedWith("New owner is required");

    await expect(
      usedMarket.connect(owner).transferOwnership(1, owner.address, ethers.parseEther("0.17"))
    ).to.be.revertedWith("New owner must differ");
  });

  it("creates history only on ownership transfer and blocks previous owner update after transfer", async function () {
    const { usedMarket, owner, buyer } = await deployUsedMarket();
    await registerSampleItem(usedMarket, owner);

    expect(await usedMarket.getTransactionHistory(1)).to.have.lengthOf(0);

    await usedMarket.connect(owner).setItemVisibility(1, false);
    expect(await usedMarket.getTransactionHistory(1)).to.have.lengthOf(0);

    await usedMarket.connect(owner).setItemVisibility(1, true);
    await usedMarket.connect(owner).transferOwnership(1, buyer.address, ethers.parseEther("0.17"));

    await expect(
      usedMarket.connect(owner).updateItem(
        1,
        "이전 소유자 수정",
        "실패해야 함",
        ethers.parseEther("0.10"),
        "수집품",
        "https://example.com/fail.jpg"
      )
    ).to.be.revertedWith("Only current owner");

    await expect(
      usedMarket.connect(buyer).updateItem(
        1,
        "새 소유자 수정",
        "이전 이후 수정 불가",
        ethers.parseEther("0.10"),
        "수집품",
        "https://example.com/fail.jpg"
      )
    ).to.be.revertedWith("Transferred item cannot be updated");
  });
});

const anyValue = require("@nomicfoundation/hardhat-chai-matchers/withArgs").anyValue;
