import { Router } from 'next/router'
import React, { Component } from 'react'
import { Form, Input, Message, Button} from 'semantic-ui-react'
import Campaign from '../eth/campaign'
import web3 from '../eth/web3'


class ContributeForm extends Component {
	state = {
		value: '',
		errorMessage: '',
		loading: false
	}

	onSubmit = async (event) => {
		this.setState({loading: true, errorMessage: ''});
		
		event.preventDefault();
		const campaign = await Campaign(this.props.address);



		try {
			const accounts = await web3.eth.getAccounts();
			await campaign.methods.contribute()
			.send({
				from: accounts[0],
				value: web3.utils.toWei(this.state.value, 'ether')
			});

			Router.replaceRoute(`/campaigns/${this.props.address}`);

		} catch (error) {
			this.setState({ errorMessage: error.message})
		}

		this.setState({
			loading: false,
			value: ''
		})
	}

	render() {
		return (
			<Form onSubmit={this.onSubmit} error={this.state.errorMessage.length}>
				<Form.Field>
					<label>
						Amount to contribute
					</label>
					<Input 
					value={this.state.value}
					onChange={event => this.setState({ value: event.target.value, errorMessage: ''})}
					label='ether' 
					labelPosition='right' 
					/>
				</Form.Field>
				<Message error header='Oops!' content={this.state.errorMessage} />
				<Button loading={this.state.loading} primary>
					Contribute!
				</Button>

			</Form>
		);
	}
}

export default ContributeForm