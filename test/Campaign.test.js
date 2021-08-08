const assert = require('assert');
const ganache = require('ganache-cli');
const Web3  = require('web3');
const web3 = new Web3(ganache.provider());

const compileFactory = require('../eth/build/CampaignFactory.json');
const Campaign = require('../eth/build/Campaign.json');


let accounts; // accounts array
let factory; // factory contract address
let campaignAddress;
let campaign;
const minGas = '1000000';

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();
    factory = await new web3.eth.Contract(JSON.parse(compileFactory.interface))
        .deploy({ data:  compileFactory.bytecode})
        .send({ from: accounts[0], gas: minGas });
        
    await factory.methods.createCampaign('100')
        .send({from: accounts[0], gas: minGas});


    [campaignAddress] = await factory.methods.getDeployedCampaigns().call();
    campaign = await new web3.eth.Contract(
        JSON.parse(Campaign.interface),
        campaignAddress
    );    
});

describe('Our contract', ()=>{
    it('deployes the factory contract and campaign contracts', ()=>{
        assert.ok(factory.options.address);
        assert.ok(campaign.options.address);
        console.log(factory.options.address);
        console.log(campaign.options.address);
    });
    it('setting caller as the manager', async ()=>{
        const camp_manager = await campaign.methods.manager().call();
        assert.strictEqual(accounts[0], camp_manager);

        console.log(camp_manager, ' == ', accounts[0]);
    });

    it('allows people to contribute and marking them as contributors', async ()=>{
        for(var i = 0; i<10; i++){
            await campaign.methods.contribute().send({
                value: '200',
                from: accounts[i]
            });
            assert(await campaign.methods.approvers(accounts[i]));
        }
    });

    it('requires a minimum contribution for becoming a contributor', async ()=>{
        try {
            await campaign.methods.contribute().send({
                value: '99', 
                from: accounts[0]
            });
            assert(false);
        } catch (err) {
            assert(err);    
        }
    });

    it('allows manager to make a payment request.', async ()=>{
        await campaign.methods.createRequest('Buy', '10', accounts[0])
        .send({
            from: accounts[0],
            gas: '1000000'
        });

        assert(await campaign.methods.requests(0).call());
    });

    it('processes requests.', async ()=>{
        await campaign.methods.contribute().send({
            from: accounts[0],
            value: web3.utils.toWei('10', 'ether')
        });
        
        await campaign.methods
        .createRequest('a', web3.utils.toWei('5', 'ether'), accounts[1])
        .send({
            from: accounts[0],
            gas: 1000000
        });

        await campaign.methods.approveRequest(0).send({
            from: accounts[0],
            gas: 1000000
        });

        await campaign.methods.finalizeRequest(0).send({
            from: accounts[0],
            gas: 1000000
        });

        let ret = await web3.eth.getBalance(accounts[1]);
        let balance = web3.utils.fromWei(ret, 'ether');
        let f_bal = parseFloat(balance);

        assert(f_bal > 103 && f_bal < 105);
    });

});

