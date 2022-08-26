// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;
import "./structs.sol";
import "./modifiers.sol";

contract User is structs, modifiers {
    function login() public view returns (bool) {
        return (users[addressToUser[msg.sender]].walletAddress == msg.sender);
    }

    function addUser(
        string memory name,
        string memory aadhar,
        uint256 mobno,
        string memory fatherName,
        Gender gender,
        string memory _state,
        string memory _district,
        string memory _blockName,
        string memory _panchyatName,
        string memory _villageName
    ) public {
        require(
            users[addressToUser[msg.sender]].walletAddress != msg.sender,
            "Already Registered"
        );
        uint256 id = ++numUsers;
        addressToUser[msg.sender] = id;

        Location memory newlocation = Location({
            state: _state,
            district: _district,
            blockName: _blockName,
            panchyatName: _panchyatName,
            villageName: _villageName
        });

        users[id] = User(
            numUsers++,
            name,
            aadhar,
            mobno,
            fatherName,
            msg.sender,
            new uint256[](0),
            new uint256[](0),
            0, // SHG id is zero inttially as a placeholder for every user
            UserType.NONE,
            gender,
            newlocation
        );
    }

    // Request functions for user

    function makeRequest(
        uint256 _shgid,
        uint256 _userid,
        uint256 _amount,
        string memory _description,
        uint256 _loanTime
    ) public {
        uint256 requestId = ++numUserRequests;
        userRequests[requestId] = UserRequest(
            requestId,
            _userid,
            _amount,
            _description,
            _shgid,
            RequestStatus.IN_PROCESS,
            _loanTime,
            new uint256[](0)
        );
        users[_userid].requests.push(requestId);
    }

    function deleteRequest(uint256 _userid, uint256 _requestid)
        public
        onlyUser(_userid)
    {
        require(userRequests[_requestid].userId == _userid);

        uint256 index;
        for (uint256 i = 0; i < numUserRequests; i++) {
            if (userRequests[i].userId == _userid) {
                index = i;
                break;
            }
        }
        delete userRequests[index];
    }

    // Repay functions for user

    function payEMI(
        uint256 _userid,
        uint256 _loanid,
        uint256 _amount
    ) public payable onlyUser(_userid) {
        uint256 amount = getUserEMI(_userid, _loanid);
        require(amount == _amount);
        Loan storage loan = loans[_loanid];
        payable(address(this)).transfer(_amount);
        shgs[loan.lendeeId].currentBalance += _amount;
        loan.lastEMI = block.timestamp;
    }

    // fetch functions

    function getNumUsers() public view returns (uint256) {
        return numUsers;
    }

    function getUserRequest(uint256 _userid) public returns (uint256[] memory) {
        for (uint256 i = 0; i < numUserRequests; i++) {
            if (userRequests[i].userId == _userid) {
                userToRequests[_userid].push(i);
            }
        }
        return userToRequests[_userid];
    }

    function getUserEMI(uint256 userid, uint256 loanid)
        public
        onlyUser(userid)
        returns (uint256)
    {
        Loan storage loan = loans[loanid];
        uint256 months = ((block.timestamp - loan.lastEMI) / 24) * 60 * 60 * 30;

        require(months > 0);
        uint256 P = loan.amount;
        uint256 r = loan.intrest;
        uint256 t = loan.loanTime;
        uint256 emi = (P * (1 + ((r / 100) * 12))) ^ ((12 * t));

        loan.amount = loan.amount - emi;
        return emi;
    }

    function getAllLoans(uint256 userid)
        public
        view
        onlyUser(userid)
        returns (uint256[] memory)
    {
        return users[userid].loansTaken;
    }

    function getUserLoanAmount(uint256 _userid) public view returns (uint256) {
        uint256 amount = 0;
        uint256[] memory loans = users[_userid].loansTaken;
        for (uint256 i = 0; i < loans.length; i++) {
            amount += loans[i];
        }
        return amount;
    }

    // function flagDefaulters() public {}
}
