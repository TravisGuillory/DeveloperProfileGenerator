const inquirer = require('inquirer');
const fs = require('fs');
const axios = require('axios');
const generateHtml = require("./generateHTML");


let data = {};

const questions = [
    {
        name: 'userName',
        type: "input",
        message: "Input developer GitHub username"

    },
    {
        name: "colorSelection",
        message: "Choose your favorite color.",
        type: "list", 
        choices: ["green", "blue", "pink", "red"]
    }
];


function writeToFile(data) {
    fs.writeFile("index.html", data, function(){
        if (err){
            throw error;
        }
    })
}



function init() {
    inquirer.prompt(questions)
        .then(function({userName, colorSelection}){
            const userrURL = `https://api.github.com/users/${userName}`;
            axios.get(userrURL)
                .then((response)=>{
                   console.log(response.data);
                   let data.color;
                    switch (colorSelection){
                        case "green":
                            data.color = 0;
                            break;
                        case "blue":
                            data.color  = 1;
                            break;
                        case "pink":
                            data.color = 2;
                            break;
                        case "red":
                            data.color = 3;
                            break;
                        default:
                            data.color = 0;
                            break;
                    }

                   
                
                })
        })

}
init();


