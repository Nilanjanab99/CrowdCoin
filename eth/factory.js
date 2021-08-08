// Preconfigured instance of CampaignFactory
import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';

const factory = new web3.eth.Contract(
    JSON.parse(CampaignFactory.interface),
    '0x86b9D5b30E51e6Cf5c949E2fd5C2B711e52d114f'
);

export default factory;