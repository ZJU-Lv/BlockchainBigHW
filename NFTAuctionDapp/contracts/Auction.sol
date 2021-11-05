
pragma solidity >=0.4.21 <0.7.0;
import "../node_modules/zeppelin-solidity/contracts/token/ERC20/StandardToken.sol";

contract Auction is StandardToken{
/***************************************************************************************** */
  uint index = 0; //当前拍卖的序号

  mapping (uint256 => bool) public begin; //拍卖是否进行

  address payable [1000] beneficiary;
//   mapping (uint256 => address) public beneficiary; // 拍卖的受益人
  mapping (uint256 => uint) public auctionEnd; // 拍卖的结束时间
  mapping (uint256 => uint) public timeLeft;

  mapping (uint256 => address) public highestBidder; // 当前的最高出价者
  mapping (uint256 => uint) public highestBid; // 当前的最高出价

  mapping(uint256 => uint) tokenID; // 记录每次拍卖的物品ID
  mapping(uint256 => string) tokenName; // 记录每次拍卖的物品名称
  mapping(uint256 => string) tokenData; // 记录每次拍卖的物品数据
  mapping(address => uint) pendingReturns; // 记录每个人没有达成交易的投入金额

  /***************************************************************************************** */
  uint public ID = 0;
  mapping (uint256 => string) public NFTname;     //每个NFT的名称
  mapping (uint256 => string) public NFTdata;    //每个NFT的数据，unit256是NFT的ID 
  mapping (uint256 => address) public  NFTowners;         //每个NFT的拥有者

    function Mint (string memory name, string memory data, address _to) public returns (uint, string memory, string memory, address) {
        ID ++;
        NFTdata[ID] = data;
        NFTname[ID] = name;
        NFTowners[ID] = _to;
     
        return (ID, NFTname[ID], NFTdata[ID], NFTowners[ID]);
    }

    function SeeTokenID (uint i) view public returns (uint)
    {
        return tokenID[i];
    }

    function SeeName (uint i) view public returns (string memory)
    {
        return NFTname[i];
    }

    function SeeData (uint i) view public returns (string memory)
    {
        return NFTdata[i];
    }

    function SeeAddress (uint i) view public returns (address)
    {
        return NFTowners[i];
    }

    function SeeID () view public returns (uint)
    {
        return ID;
    }

    function SeeIndex () view public returns (uint)
    {
        return index;
    }

    function SeeBegin (uint i) view public returns (bool)
    {
        return begin[i];
    }

    function SeeBid (uint i) view public returns (uint)
    {
        return highestBid[i];
    }

    function SeeBidder (uint i) view public returns (address)
    {
        return highestBidder[i];
    }

    function SeeTime (uint i) view public returns (uint)
    {
        return timeLeft[i];
    }

  /// 创建一个新的拍卖，参数为拍卖品名字
  function setSimpleAuction(uint256 nft_i) public returns (bool) {
    require(msg.sender==NFTowners[nft_i]);
    index ++;
    begin[index] = true;
    tokenID[index] = nft_i;
    tokenName[index] = NFTname[nft_i];
    tokenData[index] = NFTdata[nft_i];
    uint _biddingTime = 100; // 每次拍卖持续的时间
    beneficiary[index] = msg.sender;
    highestBidder[index] = msg.sender;
    highestBid[index] = 0;
    auctionEnd[index] = now + _biddingTime;
    changeNow();
    return true;
  }

  function changeNow() public {
    for(uint i=1;i<=index;i++)
    {
        if(now > auctionEnd[i]) {
        begin[i] == false;
        timeLeft[i] = 0;
        }
        else{
        timeLeft[i] = auctionEnd[i] - now;
        }
    }
  }

//   function checkInfo() public view returns(string memory, uint, uint, uint, address, uint) {
//     // emit LogUint(s, x);
//     return (s, x, index, highestBid, highestBidder, 0);
//   }

  // 出价，当小于当前最高时不成立，当被超过时记录数据，等待被用户主动取回
  function bid(uint i, uint price) public payable {

    require(now <= auctionEnd[i]);
    // 如果出价不够，交易撤回
    require(price > highestBid[i]);

    if (highestBid[i] != 0) {
      pendingReturns[highestBidder[i]] += highestBid[i];
    }
    highestBidder[i] = msg.sender;
    highestBid[i] = price;
  }

  // 取回被超出的拍卖前的出资
  function withdraw() public returns (bool) {
    uint amount = pendingReturns[msg.sender];
    require(amount > 0);
    pendingReturns[msg.sender] = 0;
    return true;
  }

  // 通过编号查询已经结束的拍卖
//   function checkToken(uint i) public returns (address, string memory) {
//     require(i <= index);
//     address addr = myToken[i];
//     checkn = tokenName[i];
//     return (addr, checkn);
//   }

  // 结束拍卖，将金额给予受益人
  function AuctionEnd(uint i) public payable {
    require(now >= auctionEnd[i]);
    require(highestBidder[i] == msg.sender);
    begin[i] = false;
    NFTowners[tokenID[i]] = msg.sender;
    beneficiary[i].transfer(msg.value);
  }
}
