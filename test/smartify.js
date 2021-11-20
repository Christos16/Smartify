const Smartify = artifacts.require("Smartify");


contract("Smartify", accounts => {

    const initialMsg = "Test"
    const creatorAddress = accounts[1];
    let contract;
   
    
    beforeEach(async() => {
        contract = await Smartify.new(initialMsg, {from: creatorAddress})
    })


  
    it(" should initiliaze values", async () => {
   
        const smartifySays = await contract.smartifySays.call();
        expect(smartifySays).to.equal(initialMsg);


        const owner = await contract.owner.call();
        expect(owner).to.equal(creatorAddress);

        const creator = await contract.creator.call();
        expect(creator).to.equal(creatorAddress);


        const lastSaleAmount = (await contract.lastSaleAmount.call()).toString();
        expect(lastSaleAmount).to.equal("0");
  
    })

    describe("buy", () => {
        it('should change owner', async() => {

            const buyer = accounts[3];

            await contract.buy({from: buyer, value: 10})

            const owner = await contract.owner.call();
            expect(owner).to.equal(buyer);
        })


        it('should fail if caller pays less or the same amount as previous owner', async() => {
            const firstBuyer = accounts[3];
            const failedBuyer = accounts[2];

            await contract.buy({from: firstBuyer, value: 10});

            try {
                await contract.buy({from: failedBuyer, value: 10});
                expect.fail();
            } catch(e){
                expect(e.reason).to.equal("You are cheap! pay more!");
            }
          
            try {
                await contract.buy({from: failedBuyer, value: 5});
                expect.fail();
            } catch(e){
                expect(e.reason).to.equal("You are cheap! pay more!");
            }
          
       


            const owner = await contract.owner.call();
            expect(owner).to.equal(firstBuyer);
           
        })
    })



    describe("setSmartifySays", () => {
        it('fail for non owner', async() => {

            const buyer = accounts[3];

            await contract.buy({from: buyer, value: 10})

  try {
    await contract.setSmartifySays("no no", {from: accounts[5]});
    expect.fail();
} catch(e){
    expect(e.reason).to.equal("You are NOT my owner!");
}
        })

        it('owner should be able to change text', async() => {
            const smartifySays = await contract.smartifySays.call();
            expect(smartifySays).to.equal(initialMsg);
            
            const buyer = accounts[3];
            await contract.buy({from: buyer, value: 10})

            const newMessage = "hello world";
            await contract.setSmartifySays(newMessage, {from: buyer});
            const smartifySaysAfterUpdate = await contract.smartifySays.call();
            expect(smartifySaysAfterUpdate).to.equal(newMessage);
        })


        // it('should fail if caller pays less or the same amount as previous owner', async() => {
        //     const firstBuyer = accounts[3];
        //     const failedBuyer = accounts[2];

        //     await contract.buy({from: firstBuyer, value: 10});

        //     try {
        //         await contract.buy({from: failedBuyer, value: 10});
        //         expect.fail();
        //     } catch(e){
        //         expect(e.reason).to.equal("You are cheap! pay more!");
        //     }
          
        //     try {
        //         await contract.buy({from: failedBuyer, value: 5});
        //         expect.fail();
        //     } catch(e){
        //         expect(e.reason).to.equal("You are cheap! pay more!");
        //     }
          
       


        //     const owner = await contract.owner.call();
        //     expect(owner).to.equal(firstBuyer);
           
        // })
    })

    describe('claim', () => {
        it('should fail for not creator', async () => {

            try {
                await contract.claim({from: accounts[2]});
                expect.fail();
            } catch(e){
                expect(e.reason).to.equal('You are not the creator!')
            }
        })

        it('should pay money to the creator', async () => {

            const creatorBalanceBeforeClaim = await web3.eth.getBalance(creatorAddress)

            const weiValue = web3.utils.toWei("1", "ether");

        
      

            await contract.buy({from: accounts[0], value: weiValue})
            await contract.claim({from: creatorAddress});

            const creatorBalanceAfterClaim = await web3.eth.getBalance(creatorAddress);
            const contractBalance = await web3.eth.getBalance(contract.address);

            expect(contractBalance.toString()).to.equal('0');

            expect(Number(creatorBalanceBeforeClaim.toString())).to.be.below(Number(creatorBalanceAfterClaim.toString()))

        })
    })

    describe('finalize', () => {
        it('should fail for not creator', async () => {
          
            try {
                await contract.finalize({from: accounts[2]});
                expect.fail();
            } catch(e){
                expect(e.reason).to.equal('You are not the creator!')
            }
        })

        it('should pay money to the creator', async () => {

            const creatorBalanceBeforeClaim = await web3.eth.getBalance(creatorAddress)

            const weiValue = web3.utils.toWei("1", "ether");

            await contract.buy({from: accounts[0], value: weiValue})
            await contract.finalize({from: creatorAddress});

            const creatorBalanceAfterClaim = await web3.eth.getBalance(creatorAddress);
            const contractBalance = await web3.eth.getBalance(contract.address);

            expect(contractBalance.toString()).to.equal('0');
            expect(Number(creatorBalanceBeforeClaim.toString())).to.be.below(Number(creatorBalanceAfterClaim.toString()))

           

        })


        it('should not be able to interact after', async () => {

            await contract.finalize({from: creatorAddress});
            await contract.buy({from: accounts[0], value: 100})
 
      

        })
    })
})