const chalk = require("chalk");
const figlet = require("figlet");
const inquirer = require("inquirer");


console.clear()
    

const questions = [
    {
        type: "input",
        name: "authorization",
        message: color("Authorization keys "),
        prefix: `${color("[", "redBright")}+${color("]", "redBright")}`,
        suffix: ":",
        validate: function (input) {
            const done = this.async();
            if (!input) {
                done('You need to provide Authorization keys');
                return false;
            }
            let authParse;
            try {
                authParse = JSON.parse(input);
            } catch (error) {
                authParse = error.message;
            }
            if (typeof authParse != "object") {
                done("You need to provide Authorization keys as Object");
                return false;
            }
            return done(null, true);
        },
    },
    {
    message: color(""),
        type: "list",
        name: "round",
        message: color("Authorization keys taken at 'Round' "),
        prefix: `${color("[", "redBright")}+${color("]", "redBright")}`,
        suffix: ":",
        choices: ["Stage 1", "Stage 2", "Stage 3"],
        filter: (value) => {
            return {
                "Stage 1": 1,
                "Stage 2": 2,
                "Stage 3": 3,
            }[value];
        },
    },
];

inquirer.prompt(questions)
    .then(async ({ authorization, round }) => {
        const authParse = JSON.parse(authorization);
        iStumble(round, authParse);
    });



function iStumble(round, authorization) {
    setInterval(async function iStumble() {
        try {
            const { data } = await stageRequest(authorization, round);
            if (typeof data == "string" && data.includes("BANNED")) {
                console.error(color("BANNED", "redBright"));
            } else if (typeof data == "object") {
                const date = new Date();
                let { Id, Username, Country, Region, Crowns, SkillRating } = data.User;
                const print = `[ ${(date.getHours())}:${date.getMinutes()} ] ` + [color(Username), color(Country, "white"), color(Region, "redBright"), color(Crowns, "white"), color(SkillRating, "redBright")].join(" | ");
                console.log(print);
            }
        } catch (error) {}
    }, Number(3000));
}

function color(text, color) {
    return color ? chalk[color].bold(text) : chalk.red.bold(text);
}


function stageRequest(authorization, round) {
    return new Promise((resolve, reject) => {
        request({
            url: `http://kitkabackend.eastus.cloudapp.azure.com:5010/round/finishv2/${round}`,
            headers: {
                Authorization: JSON.stringify(authorization),
                use_response_compression: true,
                "Accept-Encoding": "gzip",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64))",
            }
        })
            .then((response) => {
                resolve(response);
            })
            .catch(reject);
    });
}
