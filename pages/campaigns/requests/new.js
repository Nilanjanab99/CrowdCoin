import { Component }	 from 'react'
import { Container, Form, Button, Message, Input } from 'semantic-ui-react';
import Layout from '../../../components/Layouts'
import Campaign from '../../../eth/campaign'
import web3 from '../../../eth/web3'
import {Link, Router} from '../../../routes'


class RequestNew extends Component {
	state = {
		value: '',
		description: '',
		recipient: '',
		errorMessage: ''
	};

	static async getInitialProps(props){
		const {address} = props.query;
		return {address};
	}

	onSubmit = async (event) => {
		event.preventDefault();

		this.setState({loading: 'true', errorMessage: ''});

		const campaign = await Campaign(this.props.address);
		const {description, value, recipient} = this.state;

		try {

			console.log('Line 1 execution');
			const accounts = await web3.eth.getAccounts();
			
			console.log('Line 2 execution');

			const res = await campaign.methods
			.createRequest(
				description, 
				web3.utils.toWei(value, 'ether'), 
				recipient
				).send({ from: accounts[0]});
				
				console.log(res);
				console.log('Line 3 execution');
				Router.pushRoute(`/campaigns/${this.props.address}/requests`);
		} catch (error) {
			this.setState({errorMessage: error.message});
		}

		this.setState({loading: false});
	}
	
	render() {
		return (
			<Container>
				<Layout>
					<Link route={`/campaigns/${this.props.address}/requests`}>
					<a>
						<Button primary>
						<i class="arrow alternate circle left outline icon"></i>
							Back to all requests
						</Button>
					</a>
					</Link>

					<h3>Creating a new spend request</h3>
					
					<Form onSubmit={this.onSubmit} error={this.state.errorMessage.length}>
						<Form.Field>
							<label>Description</label>
							<Input 
								value={this.state.description}
								onChange={event => 
								this.setState({description: event.target.value, errorMessage: ''})
								}
							/>
						</Form.Field>
						
						<Form.Field>
							<label>Value in Ether</label>
							<Input 
								value={this.state.value}
								onChange={event => 
								this.setState({value: event.target.value, errorMessage: ''})
								}
							/>
						</Form.Field>
						
						<Form.Field>
							<label>Recipient address</label>
							<Input 
								value={this.state.recipient}
								onChange={event => 
								this.setState({recipient: event.target.value, errorMessage: ''})
								}
							/>
						</Form.Field>

							<Message error header='Oops!' content={this.state.errorMessage}>

							</Message>

						<Button primary loading={this.state.loading} >
								Create
						</Button>
					</Form>


				</Layout>
			</Container>
		);
	}
};

export default RequestNew;