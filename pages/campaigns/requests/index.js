import React, { Component } from 'react'
import Layout from '../../../components/Layouts'
import Campaign from '../../../eth/campaign'

import { Button, Container, Table } from 'semantic-ui-react';
import { Link } from '../../../routes'
import RequestRow from '../../../components/RequestRow'


class RequestIndex extends Component {
	static async getInitialProps(props) {
		const { address } = props.query;
		const campaign = await Campaign(address);

		const requestCount = await campaign.methods.getRequestCount().call();
		const approversCount = await campaign.methods.approversCount().call();


		const requests = await Promise.all(
			Array(parseInt(requestCount)).fill().map((element, index) => {
				return campaign.methods.requests(index).call();
			})
		);



		return { address, requests, requestCount, approversCount };
	}

	renderRows() {
		return this.props.requests.map((request, index) => {
			return <RequestRow
				request={request}
				key={index}
				id={index}
				address={this.props.address}
				approversCount={this.props.approversCount}
			/>;
		})
	}


	render() {
		const { Header, Row, HeaderCell, Body } = Table;


		return (
			<Container>
				<Layout>

					<h3>All requests</h3>
					<Link route={`/campaigns/${this.props.address}/requests/new`}>
						<a>

							<Button floated='right' style={{marginBottom: 10}} primary>Add request</Button>
						</a>
					</Link>
					<Table>
						<Header>
							<Row>
								<HeaderCell>ID</HeaderCell>
								<HeaderCell>Description</HeaderCell>
								<HeaderCell>Amount</HeaderCell>
								<HeaderCell>Recipient</HeaderCell>
								<HeaderCell>Approval Count</HeaderCell>
								<HeaderCell>Approve</HeaderCell>
								<HeaderCell>Finalize</HeaderCell>
							</Row>
						</Header>
						<Body>
							{this.renderRows()}
						</Body>
					</Table>
					<div>
						Found {this.props.requestCount} requests
					</div>
				</Layout>
			</Container>
		);
	}

}

export default RequestIndex