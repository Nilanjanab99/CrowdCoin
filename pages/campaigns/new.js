import React, { Component } from 'react'
import { Container, Button, Form, Input, Message } from 'semantic-ui-react'
import Layout from '../../components/Layouts'
import {Router} from '../../routes'


import web3 from '../../eth/web3'
import factory from '../../eth/factory'

class CampaignNew extends Component {
	state = {
		minimumContribution: '',
		name:'',
		description:'',
		errorMessage: '',
		successMessage: '',
		loading: false,
		showSuccess: false,
	};
	
	onSubmit = async (event)=>{
		this.setState({loading: true});
		
		
		try {
			// Form submittal
			
			event.preventDefault();
			
			const accounts = await new web3.eth.getAccounts();
			console.log('Accounts returned are: ', accounts);
			const res = await factory.methods
			.createCampaign(this.state.minimumContribution, this.state.name, this.state.description)
			.send({
				from: accounts[0]
			});
			console.log('Transaction successful.');
			console.log(res);
					
			this.setState({
				successMessage: 
				'Your transaction was successful.'
				// 'blockHash: ' + res.blockHash +
				// 'blockNumber: ' + res.blockNumber +
				// 'contactAddress' + res.contactAddress +
				// 'cumulativeGasUsed' + res.cumulativeGasUsed
			});
			this.setState({showSuccess: true});

			Router.pushRoute('/');
		} catch (err) {
			this.setState({errorMessage: err.message});
		}

		this.setState({loading: false});
	}

	render() {
		return (
			<Container>
				<Layout>
					<h1>Create a new Campaign page</h1>
					<Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
						<Form.Field>
							<label>Minimum contribution</label>
							<Input 
								labelPosition='right' 
								label='wei' 
								placeholder='0' 
								
								value={this.state.minimumContribution}
								type='number'
								onChange={event => {
									this.setState({minimumContribution: event.target.value});
									this.setState({errorMessage: ''});
								}}
							/>
						
						</Form.Field>

						<Form.Field>
							<label>Name</label>
							<Input 
								labelPosition='right' 
								label='name' 
								placeholder='name' 
								
								value={this.state.name}
								type='text'
								onChange={event => {
									this.setState({name: event.target.value});
									this.setState({errorMessage: ''});
								}}
							/>
						
						</Form.Field>

						<Form.Field>
							<label>Description</label>
							<Input 
								labelPosition='right' 
								label='description' 
								placeholder='description' 
								
								value={this.state.description}
								type='text'
								onChange={event => {
									this.setState({description: event.target.value});
									this.setState({errorMessage: ''});
								}}
							/>
						
						</Form.Field>


						<Message positive error={!this.state.showSuccess} header="Transaction successful." content={this.state.successMessage} />
						<Message error header="Oops!" content={this.state.errorMessage} />
						
						
						<Button loading={this.state.loading} primary>Create</Button>
					</Form>
				</Layout>

			</Container>
		);
	}
}

export default CampaignNew