var inquirer = require("inquirer");
var fs = require("fs");
const axios = require("axios");
const generateHTML = require("./generateHTML");
var pdf = require('html-pdf');
var htmlToPdf;
var options = { format: 'Letter' };

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
    let pdfName = "./" + data.login + ".pdf";
    pdf.create(htmlToPdf, options).toFile(pdfName, function(err, res) {
        if (err) return console.log(err);
        console.log(res); // { filename: '/app/businesscard.pdf' }
    });
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
            html = "./" + data.login + ".html";
            htmlToPdf = fs.readFileSync(html, 'utf8');
            writeToFile(html, data);
            
        } catch (err) {
            console.log(err);            
        }
    } 

function init() { 
    getGithub();
}
init();
