import { prompt } from 'inquirer';
import { compose } from './utils';
import { Action, validActions } from './main';
import chalk from 'chalk';

export type Engine = 'npm' | 'yarn';

export const selectEnginesToCheck = (): Promise<Engine[]> => {
  return new Promise((resolve, reject) => {
    prompt([
      {
        type: 'checkbox',
        message: 'Select the engines to check',
        name: 'engines',
        choices: [
          { name: 'npm' },
          { name: 'yarn' }
        ],
        validate(answer) {
          if (answer.length < 1) {
            return 'You must choose at least one engine.';
          }
          return true;
        }
      }
    ])
      .then(({ engines }) => resolve(engines))
      .catch(error => reject(error));
  });
};

export const toAction = (word): Action =>
  word?.toLowerCase();

export const ofValidActions = (word: Action = 'check') =>
  validActions.includes(word) ? word : 'help';

export const processArguments = (word?: string): Action =>
  compose(ofValidActions, toAction)(word);

export const notInitializedError = () => {
  console.log(chalk.yellow('Is not initialized'), 'Use assertnv init first');
  process.exit(1);
};

export const error = (message: string) => {
  console.log(chalk.red(message));
  process.exit(1);
};
