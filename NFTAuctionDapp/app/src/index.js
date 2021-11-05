import Web3 from 'web3';
import auctionArtifact from '../../build/contracts/Auction.json'

const App = {
  web3: null,
  account: null,
  auction: null, 
  
  start: async function() {
    const { web3 } = this;

    try {
      // get contract instance
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = auctionArtifact.networks[networkId];
      this.auction = new web3.eth.Contract(
        auctionArtifact.abi,
        deployedNetwork.address,
      );

      // get accounts
      const accounts = await web3.eth.getAccounts();
      this.account = accounts[0];
      // console.log("will ready +++++++ ");
      // this.ready();
    } catch (error) {
      console.log(error);
    }
  },
  
  refreshAcc: async function() {
    const element = document.getElementById("acc");
    element.innerHTML = this.account;
  },

  refresh: async function() {
    const { SeeID } = this.auction.methods;
    const ID = await SeeID().call();
    const { SeeName } = this.auction.methods;
    const { SeeData } = this.auction.methods;
    const { SeeBegin } = this.auction.methods;
    const { SeeAddress } = this.auction.methods;
    const element = document.getElementById("NFTlist");
    element.innerHTML = "";
    for(var i=1;i<=ID;i++)
    {
      const aAddress = await SeeAddress(i).call();
      if(aAddress==this.account)
      {
        const aName = await SeeName(i).call();
        const aData = await SeeData(i).call();
        const aBegin = await SeeBegin(i).call();
        var x = "<tr>"+"<td>"+i+"</td>"+"<td>"+aName+"</td>"+"<td>"+aData+"</td>"+"<td>"+aBegin+"</td>"+"</tr>";
        element.innerHTML = element.innerHTML+x;
      }
    }
  },

  AuctionRefresh: async function() {
    try{
    const { SeeIndex } = this.auction.methods;
    const index = await SeeIndex().call();
    const { SeeTokenID } = this.auction.methods;
    const { SeeName } = this.auction.methods;
    const { SeeData } = this.auction.methods;
    const { SeeBegin } = this.auction.methods;
    const { SeeBid } = this.auction.methods;
    const { SeeBidder } = this.auction.methods;
    const { SeeTime } = this.auction.methods;
    const { changeNow } = this.auction.methods;
    await changeNow().send({from: this.account});
    const element = document.getElementById("details");
    element.innerHTML = "";
    for(var i=1;i<=index;i++)
    {
      const tokenID = await SeeTokenID(i).call();
      var name = await SeeName(tokenID).call();
      var data = await SeeData(tokenID).call();
      var begin = await SeeBegin(i).call();
      var bid = await SeeBid(i).call();
      var bidder = await SeeBidder(i).call();
      var time = await SeeTime(i).call();
      var x = "<tr>"+"<td>"+i+"</td>"+"<td>"+name+"</td>"+"<td>"+data+"</td>"+"<td>"+bid+"</td>"+"<td>"+bidder+"</td>"+"<td>"+time+"</td>"+"<td>"+begin+"</td>"+"</tr>";
      element.innerHTML = element.innerHTML+x;
    }
    App.refresh();
  }catch (err) {
    console.log(err);
  }
  },

  mintNFT: async function() {
    try {
      const { Mint } = this.auction.methods;
      const _name = document.getElementById("NFTname").value;
      const _data = document.getElementById("NFTdata").value;
      await Mint(_name, _data, this.account).send({ from: this.account });
      console.log(_name, _data, this.account);
      App.refresh();
    } catch (err) {
      console.log(err);
    }
  },

  startAuction: async function() {
    try{
      const { setSimpleAuction } = this.auction.methods;
      const nftID = document.getElementById("newAuction_nftID").value;
      await setSimpleAuction(nftID).send({ from: this.account });
      console.log("start auction: " + nftID);
      App.AuctionRefresh();
    }catch (err) {
      console.log(err);
    }
  },

  bidAuction: async function() {
    try{
      const { bid } = this.auction.methods;
      const nftID = document.getElementById("nftID").value;
      const price = document.getElementById("price").value;
      await bid(nftID, price).send({ from: this.account });
      console.log("bid auction: " + nftID + "   " + price);
      App.AuctionRefresh();
    }catch (err) {
      console.log(err);
    }
  },

  endAuction: async function() {
    try{
      const { AuctionEnd } = this.auction.methods;
      const { SeeBid } = this.auction.methods;
      const { SeeBidder } = this.auction.methods;
      const { SeeAddress } = this.auction.methods;
      const { transferFrom } = this.auction.methods;
      const { transfer } = this.auction.methods;
      const nftID = document.getElementById("nftID").value;
      const bid = await SeeBid(nftID).call();
      const bidder = await SeeBidder(nftID).call();
      const owner = await SeeAddress(nftID).call();
      let amount = this.web3.utils.toWei(bid.toString(), 'ether');
      await AuctionEnd(nftID).send({ from: this.account, value: amount});
      // await transferFrom(bidder, owner, bid).send({from: this.account});
      // await transfer(owner, bid);
      console.log("end auction: "+bidder+"   "+owner+"   "+bid);
      App.AuctionRefresh();
    }catch (err) {
      console.log(err);
    }
  },

}

window.App = App;

window.addEventListener("load", function() {
  // console.log("load+++++");
  if (window.ethereum) {
    // use MetaMask's provider
    App.web3 = new Web3(window.ethereum);
    window.ethereum.enable(); // get permission to access accounts
  } else {
    console.warn(
      "No web3 detected. Falling back to http://127.0.0.1:8545. You should remove this fallback when you deploy live",
    );
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    App.web3 = new Web3(
      new Web3.providers.HttpProvider("http://127.0.0.1:8545"),
    );
  }

  App.start();
});
