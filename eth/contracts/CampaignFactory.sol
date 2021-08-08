pragma solidity ^0.4.17;



contract CampaignFactory{
    address[] public deployedCampaigns;

    function createCampaign(uint minimum, string _name, string _description) public { 
        deployedCampaigns.push(new Campaign(msg.sender, minimum, _name, _description));
    }

    function getDeployedCampaigns() public view returns (address[]) {
        return deployedCampaigns;
    }
}


contract Campaign {
    struct Request {
        string description;
        uint value;
        address recipient;
        bool complete;
        uint approvalCount;
        mapping(address => bool) approvals;
    }

    Request[] public requests;
    address public manager;
    uint public minimumContribution;
    string public name;
    string public description;

    mapping(address => bool) public approvers;
    uint public approversCount;

    modifier restricted() {
        require(msg.sender == manager);
        _;
    }

    function Campaign(address new_manager, uint minimum, string _name, string _description) public {
        manager = new_manager;
        minimumContribution = minimum;
        name = _name;
        description = _description;
    }

    function contribute() public payable {
        require(msg.value > minimumContribution);

        approvers[msg.sender] = true;
        approversCount++;
    }

    function createRequest(
        string description,
        uint  value,
        address recipient
    ) public payable restricted {
        Request memory newRequest = Request({
            description: description,
            value: value,
            recipient: recipient,
            complete: false,
            approvalCount: 0
        });

        requests.push(newRequest);
    }

    function approveRequest(uint index) public {
        Request storage request = requests[index];

        require(approvers[msg.sender]);
        require(!request.approvals[msg.sender]);

        request.approvals[msg.sender] = true;
        request.approvalCount++;
    }

    function finalizeRequest(uint index) public restricted {
        Request storage request = requests[index];

        require(!request.complete);
        require(request.approvalCount > (approversCount / 2));

        request.recipient.transfer(request.value);

        request.complete = true;
    }
    function get_arr_size() public view returns (uint){
        return requests.length;
    }
    function getSummary() public view returns (uint, string, string, uint, uint, uint, address){
        return (
            minimumContribution,
            name,
            description,
            this.balance,
            requests.length,
            approversCount,
            manager
        );
    }
    function getRequestCount() public view returns (uint){
        return requests.length;
    }
}
