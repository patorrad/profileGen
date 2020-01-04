var inquirer = require("inquirer");
var fs = require("fs");
const axios = require("axios");
const generateHTML = require("./generateHTML");
const convertFactory = require("electron-html-to");

const questions = [
    'What is your GitHub profile name?',
    'What color would you like for your profile print out? (Options: green, blue, pink or red)',
];



function checkColor(color) {
    const colors = ['green', 'blue', 'pink', 'red'];
    return colors.includes(color);
}

function writeToFile(fileName, data) {
    fs.writeFile(fileName, generateHTML(data), (err) => {
        if (err) throw err;
        console.log('The file has been saved.');        
    });
    var conversion = convertFactory({
        converterPath: convertFactory.converters.PDF
    });
    conversion({ html: '<h1>Hello World</h1>' }, function(err, result) {
        if (err) {
          return console.error(err);
        }
       
        console.log(result.numberOfPages);
        console.log(result.logs);
        result.stream.pipe(fs.createWriteStream('test.pdf'));
        conversion.kill(); 
    })
}

async function getGithub() {
        try {
            //Prompt user
            const { user, color } = await inquirer.prompt([
            {
                message: questions[0],
                name: "user"
            },
            {
                message: questions[1],
                name: "color"
            }]);   
            //Check color input is correct         
            if (!checkColor(color)) throw 'Chosen color is not an option. Try again.';
            //Get user data
            const { data } = await axios.get(
              `https://api.github.com/users/${user}`  
            );
            const { stars } = await axios.get(
              `https://api.github.com/users/${user}/starred`  
            );
            data.color = color;
            let location = data.location.split(',');
            if (location[0] != null) data.city = location[0];
            if (location[1] != null) data.state = location[1].trim();
            if (data.bio === null) data.bio = ' '
            if (data.company === null) data.bio = ' '
            console.log(stars);
            writeToFile('test.html', data);
            
        } catch (err) {
            console.log(err);            
        }
    } 

function init() { 
    getGithub();
}
init();
