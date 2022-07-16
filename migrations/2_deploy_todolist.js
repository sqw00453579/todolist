const Contacts = artifacts.require("./TodoList.sol");

module.exports = function (deployer) {
    deployer.deploy(Contacts);
};