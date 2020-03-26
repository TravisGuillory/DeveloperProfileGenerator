const fs = require("fs");
const axios = require("axios");
const inquirer = require("inquirer");
const convertFactory = require('electron-html-to');
const generateHTML = require("./generateHTML");


var conversion = convertFactory({
    converterPath: convertFactory.converters.PDF
  });


let data = {};

let questions = [
    {
        message: 'What is your github username?',
        name: 'username',
    },
    {
        message: 'What is your favorite color',
        name: 'color',
        type: 'list',
        choices: ['green', 'blue', 'pink', 'red'],
    }
]

function init() {
    inquirer
    .prompt(questions)
    .then(function ({username, color}) {
        const userUrl = `https://api.github.com/users/${username}`; 

        axios
            .get(userUrl)
            .then((res) => {    
                
                switch(color) {
                    case 'green':
                        data.color = 0;
                        break;
                    case 'blue':
                        data.color = 1;
                        break;  
                    case 'pink':
                        data.color = 2;
                        break;
                    case 'red':
                        data.color = 3;
                        break;
                }      
                 console.log(data.color)  

                data.username = username;
                data.numOfRepo = res.data.public_repos;
                data.name = res.data.name
                data.followers = res.data.followers;
                data.following = res.data.following;
                data.portPic = res.data.avatar_url;
                data.location = res.data.location;
                data.blog = res.data.blog; 
                data.company = res.data.company
                data.bio = res.data.bio

                //Number of Stars is in a different api call
                axios 
                    .get(`https://api.github.com/users/${username}/repos?per_page=100`)
                    .then((res) => {
                        // console.log(res)
                        data.stars = 0;
                        for (let i = 0; i < res.data.length; i++) { // Loop through each repository and count the number of stars
                            data.stars += res.data[i].stargazers_count;
                        }
                        

                        // console.log(data.stars)

                        let outputHTML = generateHTML(data);
                        

                        conversion({ html: outputHTML }, function(err, result) {
                            if (err) {
                              return console.error(err);
                            }
                           
                            console.log(result.numberOfPages);
                            console.log(result.logs);
                            result.stream.pipe(fs.createWriteStream('./profile.pdf'));
                            conversion.kill(); // necessary if you use the electron-server strategy, see bellow for details
                          });
                    })

                


               

            })
    })
}

init();