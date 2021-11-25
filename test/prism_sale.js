const PrismSale = artifacts.require("PrismSale");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("PrismSale", function (accounts) {
  it("should assert true", async function () {
    await PrismSale.deployed();
    return assert.isTrue(true);
  });

  it("should get the right accounts", async function () {
    const contract = await PrismSale.deployed()

    const owner = await contract.owner.call()
    const charity = await contract.charity.call()

    assert.isTrue(owner == 0xf26A96Df463a105dcEC61181F45fd74B9af0ab9e)
    assert.isTrue(charity == 0xC8cFfE48eFe11A28544436E0dfe1546459aa6E87)
  })

  it("should split the payment", async function () {
    const contract = await PrismSale.deployed()

    const startBalance = web3.utils.toBN(await web3.eth.getBalance(accounts[1]))

    const purchase = await contract.buy.sendTransaction({
      from: accounts[0],
      value: web3.utils.toWei("0.01", "ether")
    })

    const commission = web3.utils.toBN(web3.utils.toWei("0.008", "ether"))
    const endBalance = web3.utils.toBN(await web3.eth.getBalance(accounts[1]))

    assert.equal(
      startBalance.add(commission).toString(), 
      endBalance.toString()
    )
  })

  it("should split the payment to the charity", async function () {
    const contract = await PrismSale.deployed()

    const startBalance = web3.utils.toBN(await web3.eth.getBalance(accounts[3]))

    const purchase = await contract.buy.sendTransaction({
      from: accounts[5],
      value: web3.utils.toWei("0.01", "ether")
    })

    const commission = web3.utils.toBN(web3.utils.toWei("0.002", "ether"))
    const endBalance = web3.utils.toBN(await web3.eth.getBalance(accounts[3]))

    assert.equal(
      startBalance.add(commission).toString(), 
      endBalance.toString()
    )
  })


});
