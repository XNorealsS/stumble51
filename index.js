const chalk = require("chalk");
const figlet = require("figlet");
const inquirer = require("inquirer");
const rs = require('readline-sync');
const request = require("@i-scrapper/plugins-request");


console.clear()
    console.log(`
██╗  ██╗    ███╗   ██╗ ██████╗ ██████╗ ███████╗ █████╗ ██╗     ███████╗
╚██╗██╔╝    ████╗  ██║██╔═══██╗██╔══██╗██╔════╝██╔══██╗██║     ██╔════╝
 ╚███╔╝     ██╔██╗ ██║██║   ██║██████╔╝█████╗  ███████║██║     ███████╗
 ██╔██╗     ██║╚██╗██║██║   ██║██╔══██╗██╔══╝  ██╔══██║██║     ╚════██║
██╔╝ ██╗    ██║ ╚████║╚██████╔╝██║  ██║███████╗██║  ██║███████╗███████║
╚═╝  ╚═╝    ╚═╝  ╚═══╝ ╚═════╝ ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚══════╝╚══════╝
      
 ${chalk.green.bold('NEW TOOL V5.1 FIXED')}
 ${chalk.red.bold('TYPE : X PUBLIC TOOL BY NOREALS')}
 By : ${chalk.red.bold('@Only_NoRealss')} - ${chalk.blue.bold('X CHEAT DEVELOPER SINCE 2019')}
 =========================================================================
 `)

const questions = [
    {
        type: "input",
        name: "authorization",
        message: color("Enter Auth Token :"),
        prefix: `${color("[+]", "redBright")}`,
        suffix: "",
        validate: function (input) {
            const done = this.async();
            if (!input) {
                done('${color(">>", "redBright")}', 'Kamu Perlu Memberikan keys Auth Sebagai  Object');
                return false;
            }
            let authParse;
            try {
                authParse = JSON.parse(input);
            } catch (error) {
                authParse = error.message;
            }
            if (typeof authParse != 'object') {
                done('Kamu Perlu Memberikan keys Auth Sebagai Object');
                return false;
            }
            return done(null, true);
        },
    },
    {
        type: "list",
        name: "round",
        message: color("Enter Keys Auth 'Round' ="),
        prefix: `${color("[+]", "redBright")}`,
        suffix: "",
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
                const print = `[${color(date.getHours())}:${date.getMinutes()}] ` + [color(Username, "redBright"), color(Country, "white"), color(Region, "redBright"), color(Crowns, "white"), color(SkillRating, "redBright")].join(" | ");
                console.log(print);
            }
        } catch (error) {}
    }, Number(4000));
}

function color(text, color) {
    return color ? chalk[color].bold(text) : chalk.white.bold(text);
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
