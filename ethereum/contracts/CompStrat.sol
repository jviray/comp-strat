pragma solidity ^0.4.26;

contract DaiInterface {
    function balanceOf(address) public view returns (uint256);

    function approve(address, uint256) external returns (bool);

    function allowance(address, address) public view returns (uint256);

    function transfer(address, uint256) external returns (bool);

    function transferFrom(
        address,
        address,
        uint256
    ) public returns (bool);
}

contract CompDaiInterface {
    function balanceOf(address _address) public view returns (uint256);

    function balanceOfUnderlying(address owner) external returns (uint256);

    function exchangeRateCurrent() public returns (uint256);

    function mint(uint256) external returns (uint256);
}

contract CompStrat {
    DaiInterface daiContract;

    address cDaiAddress;
    CompDaiInterface cDaiContract;

    mapping(address => uint256) public cDaiBalances;

    // Kovan Dai Contract: 0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa
    // Kovan cDai Contract: 0xF0d0EB522cfa50B716B3b1604C4F0fA6f04376AD

    constructor(address _daiAddress, address _cDaiAddress) public {
        daiContract = DaiInterface(_daiAddress);

        cDaiAddress = _cDaiAddress;
        cDaiContract = CompDaiInterface(_cDaiAddress);
    }

    // ** User must first approve CompStrat address for "infinite" amount of tokens **
    // This is triggered separately on the UI

    function supplyDai(uint256 _tokenAmount) public returns (uint256) {
        // Pull Dai from msg.sender (should fail if msg.sender has not approved CompStrat address)
        // Can also fail if insufficient Dai
        daiContract.transferFrom(msg.sender, address(this), _tokenAmount);

        // Approve cDai contract for _tokenAmount
        daiContract.approve(cDaiAddress, _tokenAmount);

        // Mint cDai (returns 0 on success, otherwise error)
        cDaiContract.mint(_tokenAmount);

        // Calculate and store the amount of cDai that belongs to msg.sender
        int256 convertedTokenAmount = int256(_tokenAmount * 1e18);

        uint256 exchangeRate = cDaiContract.exchangeRateCurrent();
        int256 convertedExchange = int256(exchangeRate);

        int256 cDaiBalance = (convertedTokenAmount) / convertedExchange;
        uint256 convertedcDaiBalance = uint256(cDaiBalance);

        cDaiBalances[msg.sender] += convertedcDaiBalance;

        return convertedcDaiBalance;
    }

    function getTotalcDaiLocked() public view returns (uint256) {
        return cDaiContract.balanceOf(address(this));
    }

    // Can use the getter function created w/ the cDaiBalances mapping to
    // check a User's cDai balance

    // Can check the underlying Dai balance off-chain on the UI (no gas fees)
    // UI will take User's cDai balance and calculate the underlying balance
    // using the current exchange rate

    // ********** Remove later, testing purpose only ********** //

    // ******************************************************* //

    // Facilitate one-time deposit strategy (after approval)
    // Borrow
    // Redeem
    // Uniswap
}
