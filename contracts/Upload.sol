// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract Upload{

    struct Access{
        address user;
        bool access;
    }

    // Mapping address to the array of images
    mapping(address => string[]) value;

    // Mapping address to the Access array
    mapping(address => Access[]) public accessList;

    // 2D Array of boolean values(true or false) for ownerShip of a user to the msg.sender
    mapping(address => mapping(address => bool)) ownerShip;

    // 2D arrray to help as a cache storage
    mapping(address => mapping(address => bool)) previousData;


    function add(address _user, string calldata url) external{
        value[_user].push(url);
    }

    // TO allow the ownerShip and accessList of a user from the msg.sender 
    function allow(address user) external{
        ownerShip[msg.sender][user] = true;

        // Change the access status of the same user , instead of a new user beign created
        if(previousData[msg.sender][user] == true){
            for(uint i=0; i < accessList[msg.sender].length;i++){
                if(accessList[msg.sender][i].user == user){
                    accessList[msg.sender][i].access = true;
                }
            }
        }
        else{
            accessList[msg.sender].push(Access(user,true)) ;
            previousData[msg.sender][user] == true;
        }
    }

    // TO disallow the ownerShip and accessList of a user from the msg.sender 
    function disAllow(address user) external{
        ownerShip[msg.sender][user] = false;
        for(uint i=0; i < accessList[msg.sender].length;i++){
                if(accessList[msg.sender][i].user == user){
                    accessList[msg.sender][i].access = false;
                }
            }
    }

    // To view images of our own account or others account
    function display(address _user) external view returns(string[] memory){
        require(_user == msg.sender || ownerShip[_user][msg.sender], "You don't have access");
        return value[_user];
    }

    // TO view the accessList of the msg.sender 
    function shareAccess() public view returns(Access[] memory){
        return accessList[msg.sender];
    }

    
}

// 0x5FbDB2315678afecb367f032d93F642f64180aa3