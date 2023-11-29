// external modules
import inquirer from "inquirer"
import chalk from "chalk"

// internal modules
import fs from "fs"

console.log("Iniciamos o Accounts")

operation()

function operation(){
    inquirer.prompt([{
        type: 'list',
        name: 'action',
        message: 'What you wanna do? ',
        choices: [
            'Create account',
            'Check balance',
            'Deposit',
            'Withdraw',
            'Quit'
        ]
    }])
    .then((answer) => {
        const action = answer["action"]
        
        if(action == "Create account"){
            craeteAccount()
        }else if(action == "Check balance"){
            getAccountBalance()
        }else if(action == "Deposit"){
            deposit()
        }else if(action == "Withdraw"){
            withdraw()
        }else if(action == "Quit"){
            console.log(chalk.bgBlue.black("Thanks for use Accounts"))
            process.exit()
        }

    })
    .catch((err) => console.log(err))
}


// create an account
function craeteAccount() {
    console.log(chalk.bgGreen.black("Congratulations to choice our bank"))
    console.log(chalk.green("Define your account options"))

    buildAccount()
}


function buildAccount() {
    inquirer.prompt([{
        name: 'accountName',
        message: 'Type the name of your account: '
    }]).then(answer => {
        const accountName = answer['accountName']

        console.info(accountName)

        if(!fs.existsSync('accounts')){
            fs.mkdirSync('accounts')
        }

        if(fs.existsSync(`accounts/${accountName}.json`)){
            console.log(chalk.bgRed.black("This account already exists"))
            buildAccount()
            return
        }

        fs.writeFileSync(`accounts/${accountName}.json`, '{"balance": 0}', function (err){
            console.log(err)
        })

        console.log(chalk.green('Your account was created'))
        operation()
    }).catch((err) => console.log(err))
}

// add an amount to user account
function deposit(){
    inquirer.prompt([
        {
            name: "accountName",
            message: "What is your account name?"
        }
    ])
    .then((answer) => {
        const accountName = answer['accountName']

        // verify if account exists
        if(!checkAccount(accountName)){
            return deposit()
        }
        
        inquirer.prompt([
            {
                name: "amount",
                message: "How much you wish to deposit? "
            }
        ]).then((answer) => {
            const amount = answer["amount"]
            // add an ammount
            addAmmount(accountName, amount)
            operation()
        }).catch((err) => console.log(err))
    })
    .catch((err) => console.log(err))
}

function withdraw(){
    inquirer.prompt([
        {
            name: "accountName",
            message: "What is your account name?"
        }
    ])
    .then((answer) => {
        const accountName = answer['accountName']

        // verify if account exists
        if(!checkAccount(accountName)){
            return withdraw()
        }
        
        inquirer.prompt([
            {
                name: "amount",
                message: "How much you wish to withdraw? "
            }
        ]).then((answer) => {
            const amount = answer["amount"]
            // add an ammount
            removeAmmount(accountName, amount)
            operation()
        }).catch((err) => console.log(err))
    })
    .catch((err) => console.log(err))
}


// show account balance
function getAccountBalance(){
    inquirer.prompt([
        {
            name: "accountName",
            message: "What is your account name?"
        }
    ]).then((answer) => {
        const accountName = answer["accountName"]

        // verify if account exists
        if(!getAccount(accountName)){
            return getAccountBalance()
        }

        const account = getAccount(accountName)
        console.log(chalk.bgBlue.black(
            `Your account balance is $${account.balance}`
        ))
        operation()
    }).catch((err) => console.log(err))
}
function checkAccount(accountName){
    if(!fs.existsSync(`accounts/${accountName}.json`)){
        console.log(chalk.bgRed.black("This account doesn´t exists"))
        return false
    }
    return true
}

function addAmmount(accountName, amount){
    const account = getAccount(accountName)

    if(!amount){
        console.log(chalk.bgRed.black("An error has occured, try again later"))
        return deposit()
    }

    account.balance = parseFloat(amount) + parseFloat(account.balance)
    fs.writeFileSync(
        `accounts/${accountName}.json`,
        JSON.stringify(account),
        function(err){
            console.log(err)
        }
    )

    console.log(chalk.green(`The value $${amount} was deposited in your account`))
}

function removeAmmount(accountName, amount){
    const account = getAccount(accountName)

    if(!amount){
        console.log(chalk.bgRed.black("An error has occured, try again later"))
        return withdraw()
    }

    account.balance = parseFloat(account.balance) - parseFloat(amount)
    fs.writeFileSync(
        `accounts/${accountName}.json`,
        JSON.stringify(account),
        function(err){
            console.log(err)
        }
    )

    console.log(chalk.green(`The value $${amount} was withdraw of your account`))
}


function getAccount(accountName){
    const accountJSON = fs.readFileSync(`accounts/${accountName}.json`,{
        encoding: "utf8",
        flag: "r"
    })
    return JSON.parse(accountJSON)
}
