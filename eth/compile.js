const path = require('path');
const solc = require('solc');
const fs_e = require('fs-extra');

const buildPath = path.resolve(__dirname, 'build');
fs_e.removeSync(buildPath);

const factoryPath = path.resolve(__dirname, 'contracts', 'CampaignFactory.sol');
const source = fs_e.readFileSync(factoryPath, 'utf-8');
const output = solc.compile(source, 1).contracts;

fs_e.ensureDirSync(buildPath);


console.log(output);

for (let contract in output){
    fs_e.outputJSONSync(
        path.resolve(buildPath, contract.replace(':', '') + '.json'), // Path to the output file
        output[contract] // compiled code containing what we need
    );
}