const PrismSale = artifacts.require("PrismSale");

module.exports = function (deployer) {
  deployer.deploy(PrismSale);
};
