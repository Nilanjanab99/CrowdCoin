import web3 from './web3'
import compiledCampaign from './build/Campaign.json'

export default async function campaign(address){
	console.log('Address in campaign.js file: ', address);
	return new web3.eth.Contract(
		JSON.parse(compiledCampaign.interface),
		address
	);
}