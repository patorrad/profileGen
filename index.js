var inquirer = require("inquirer");
var fs = require("fs");
const util = require("util");
const axios = require("axios");
const generateHTML = require("./generateHTML");

const questions = [
    'What is your GitHub profile name?',
    'What color would you like for your profile print out?'
];




function writeToFile(fileName, data) {
    // let data = {
    //     color: 'green'
    //   }
    //   generateHTML(data);
    
    fs.writeFile(fileName, generateHTML(data), (err) => {
        if (err) throw err;
        console.log('The file has been saved.');        
    });
}

async function getGithub() {
        try {
            const { user } = await inquirer.prompt({
                message: questions[0],
                name: "user"
              });
            console.log(user);
            const { color } = await inquirer.prompt({
                message: questions[1],
                name: "color"
              });
            console.log(color);
            
            const { data } = await axios.get(
              `https://api.github.com/users/${user}/repos`  
            );
            console.log(data);
            
        } catch (err) {
            console.log(err);            
        }
    } 

function init() {
    let data = {color: 'green'};
    writeToFile('test.html', data);  
    //console.log(generateHTML(data));  
}
init();
