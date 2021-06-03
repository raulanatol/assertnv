import updateNotifier from 'update-notifier';
import chalk from 'chalk';
import { assertNodeVersion, assertNPMVersion, assertYarnVersion, fileExists, getPackageJSON, initializeNPM, initializeYarn } from './utils';
import { Engine, notInitializedError, selectEnginesToCheck } from './prompt';

export const validActions = <const>['check', 'init', 'help'];
export type Action = typeof validActions[number];

const assertNPM = async () => {
  const { engines: { node, npm } } = getPackageJSON();

  assertNodeVersion(node);
  await assertNPMVersion(npm);
};

const assertYarn = async () => {
  const { engines: { yarn } } = getPackageJSON();

  await assertYarnVersion(yarn);
};

const assertEngine = (engine: Engine) =>
  ({ 'npm': assertNPM, 'yarn': assertYarn })[engine]();

export const isNPMInitialized = () => {
  const { engines, engineStrict } = getPackageJSON();
  if (!engines) {
    notInitializedError();
    return false;
  }

  if (!engines.npm) {
    notInitializedError();
    return false;
  }

  if (!engines.node) {
    notInitializedError();
    return false;
  }

  if (!engineStrict) {
    notInitializedError();
    return false;
  }

  return true;
};

export const isYarnInitialized = () => {
  const { engines, engineStrict } = getPackageJSON();
  if (!engines) {
    notInitializedError();
    return false;
  }

  if (!engines.yarn) {
    notInitializedError();
    return false;
  }

  if (!engineStrict) {
    notInitializedError();
    return false;
  }

  return true;
};

export const init = async () => {
  if (isInitialized()) {
    console.log(chalk.yellow('Is already initialized'), 'Use assertnv check');
    process.exit(1);
  }

  const engines = await selectEnginesToCheck();
  engines.forEach(engine => {
    if (engine === 'npm') {
      initializeNPM();
    }

    if (engine === 'yarn') {
      initializeYarn();
    }
  });
};

export const isInitialized = (): boolean => {
  if (!fileExists('./.nvmrc') || !fileExists('./.yarnrc')) {
    return false;
  }

  const { engines, engineStrict } = getPackageJSON();
  if (!engines) {
    return false;
  }

  if (!engineStrict) {
    return false;
  }

  return true;
};

export const assertInitialized = () => {
  if (!isInitialized()) {
    notInitializedError();
  }
};

export const check = async () => {
  assertInitialized();

  if (fileExists('./.nvmrc')) {
    await assertEngine('npm');
  }

  if (fileExists('./.yarnrc')) {
    await assertEngine('yarn');
  }
};

export const help = () => {
  console.log(chalk.bold.green('\nassertnv'));
  console.log(chalk('\nUsage:\n'));
  console.log(chalk('$ assertnv'), chalk.blue('<command>\n'));
  console.log('\n$', chalk('assertnv'), chalk.green('init\n'));
  console.log(chalk('Initialize the project\n'));
  console.log('\n$', chalk('assertnv'), chalk.green('check\n'));
  console.log(chalk('Checks the engines\n'));
};

export const checkIfLastVersion = () => {
  const pkg = require('../package.json');
  updateNotifier({ pkg }).notify({ isGlobal: true });
};

export const executeAction = (action: Action) =>
  ({ check, help, init })[action]();
