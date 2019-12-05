const readline = require('readline');
const axios = require('axios');
const db = require('./queries');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question('What art id would you like to bid on? ', async (artID) => {
      try {
          let users = await axios.get('http://localhost:3000/api/users');
          let foundUsers = 0;
          let i = 0;
          if(users.data.length > 0) {
            while(i < users.data.length || foundUsers < 3) {
              if(users.data[i].maxbid) foundUsers++;
              i++;
            }
          }
          let bids = [];

          if(foundUsers >= 3) {
              try {
                  await axios.post(`http://localhost:3000/api/art/${artID}/startBid`);
                  let round = 1;
                  let currUser = 0;
                  let bidIncrement = 0;
                  let currAmount= 0;
                  let currWinner = '';
                  let finalBid = 0;

                  while(round <= 10) {
                    if(users.data[currUser].maxbid) {
                      let random = Math.random().toFixed(2);
                      if(random <= 0.4 && random >= 0) bidIncrement = 1;
                      if(random <= 0.7 && random >= 0.41) bidIncrement = 5;
                      if(random <= 0.9 && random >= 0.71) bidIncrement = 10;
                      if(random <= 1 && random >= 0.91) bidIncrement = 20;
                      if(currAmount + bidIncrement < users.data[currUser].maxbid) {
                        finalBid = currAmount + bidIncrement;
                        currAmount = finalBid;
                        currWinner = users.data[currUser].name;
                      } else {
                        finalBid = 0;
                      }
  
                      console.log(`Round ${round}, Name: ${users.data[currUser].name}, RandomNumber: ${random}, BidIncrement: ${bidIncrement}, finalBid: ${finalBid}`);
                      bids.push({
                        userId: users.data[currUser].id,
                        name: users.data[currUser].name,
                        randNum: random,
                        bidInc: bidIncrement,
                        finalBid: finalBid
                      })
                      round++;
                    }

                    if(currUser + 1 >= users.data.length) {
                      currUser = 0;
                    } else {
                      currUser++;
                    }
                  }
                  let message = await db.updateArtAuction(bids, artID);
                  console.log(message);
                  console.log(`${currWinner} has won the auction!`);
                  
              } catch(e) {
                    throw e;
              }
          } else {
            console.log('Not enough users with max bids');
          }
      }
      catch(e) {
          throw e;
      } 
    rl.close();
  });