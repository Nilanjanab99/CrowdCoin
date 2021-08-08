import React, { Component } from 'react'
import { Card, Container, Grid, Button } from 'semantic-ui-react'
import Layout from '../../components/Layouts'

import Campaign from '../../eth/campaign'
import web3 from '../../eth/web3'
import ContributeForm from '../../components/ContributeForm'
import { Link } from '../../routes'


class CampaignShow extends Component {
	static async getInitialProps(props) {
		console.log('Address in show.js file: ', props.query.address)

		const campaign = await Campaign(props.query.address)
		const summary = await campaign.methods.getSummary().call()

		console.log(summary)

		return {
			address: props.query.address,
			minimumContribution: summary[0],
			name: summary[1],
			description: summary[2],
			balance: summary[3],
			requestsCount: summary[4],
			approversCount: summary[5],
			manager: summary[6]
		}
	}


	renderCards() {
		const {
			balance,
			manager,
			minimumContribution,
			name,
			description,
			requestsCount,
			approversCount,
		} = this.props;

		const items = [
			{
				header: manager,
				meta: 'Address of manager',
				description: 'The manager created this campaign and create request to withdraw money from this fund.',
				style: { overflowWrap: 'break-word' }
			},
			{
				header: name,
				meta: 'Name of Campaign',
				description: 'Name of Campaign.',
				style: { overflowWrap: 'break-word' }
			},
			{
				header: description,
				meta: 'Description of Campaign',
				description: 'About the Campaign.',
				style: { overflowWrap: 'break-word' }
			},
			{
				header: minimumContribution,
				meta: 'Minimum contribution(wei)',
				description: 'You must contribute this much amount to become a contributor and approve requests'
			},
			{
				header: requestsCount,
				meta: 'Number of requests',
				description: 'A request tries to withdraw money from the contract. Request must be approved by approvers.'
			},
			{
				header: approversCount,
				meta: 'Number of approvers',
				description: 'Number of people already contributed in this campaign'
			},
			{
				header: web3.utils.fromWei(balance, 'ether'),
				meta: 'Campaign Balance(ether)',
				description: 'Total balance of the campaign that manager can spend.'
			}
		]

		return <Card.Group items={items} />;
	}

	render() {
		return (
			<Container>
				<Layout>

					<h3>Here we go guys</h3>
					<Container>
						<Grid>
							<Grid.Row>

								<Grid.Column width={10}>
									{this.renderCards()}
								</Grid.Column>

								<Grid.Column width={5}>
									<ContributeForm address={this.props.address} />
								</Grid.Column>
							</Grid.Row>
								<Link route={`/campaigns/${this.props.address}/requests `}>
									<a>
										<Button primary>
											View Requests
									</Button>
									</a>
								</Link>

							<Grid.Row>

							</Grid.Row>
						</Grid>

					</Container>
				</Layout>
			</Container>
		);
	}
}

export default CampaignShow