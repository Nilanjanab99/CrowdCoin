const Campaign = artifacts.require("Campaign");
const CampaignFactory = artifacts.require("CampaignFactory");
const assert = require("assert");

const inWei = (a) => {
  return web3.utils.toWei(a.toString(), "ether");
};

contract("CampaignFactory & Campaign", async (addresses) => {
  const [user1, user2, _] = addresses;
  const minLimit = 10000;

  it("can process requests.", async () => {
    const fact = await CampaignFactory.new();
    assert(fact.address);
    await fact.createCampaign(minLimit);

    const camp = await Campaign.at((await fact.getDeployedCampaigns())[0]);

    await camp.contribute({ from: user1, value: inWei(10) });
    await camp.createRequest("Purpose", inWei(5), user2, { from: user1 });
    await camp.approveRequest(0, { from: user1 });
    await camp.finalizeRequest(0, { from: user1 });
  });
});
