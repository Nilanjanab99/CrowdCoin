import { Menu, Button } from 'semantic-ui-react'
import Head from 'next/head'
import {Link} from '../routes'

export default function header(){
    return (
        <Menu style={{ marginTop: '2em', marginBottom: '2em' }}>
            <Head>
                <link async rel="stylesheet" href="//cdn.jsdelivr.net/npm/semantic-ui@2.4.2/dist/semantic.min.css" />
                <script async src="//cdn.jsdelivr.net/npm/semantic-ui@2.4.2/dist/semantic.min.js"></script>
            </Head>
            <Link route='/'>
                <a className="item">
                    <h1>

                    <b>CrowdCoin</b>
                    </h1>
                </a>
            </Link> 


            <Menu.Menu position="right">
                
                
                <Link route='/'>
                    <a className="item">
                        Campaigns
                    </a>
                </Link>
                
                <Link route='/campaigns/new'>
                    <a className="item">
                    < Button floated="right" content='Create a new campaign' icon='add circle' primary />
                    </a>
                </Link>

            </Menu.Menu>
        </Menu>
    );
}