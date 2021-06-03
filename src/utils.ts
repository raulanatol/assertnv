import * as fs from 'fs';
import { error } from './prompt';
import { satisfies } from 'semver';
import { exec } from 'child_process';

export const compose = (f, g) => (...args) => f(g(...args));

export const fileExists = filepath => fs.existsSync(filepath);

export const getPackageJSON = () => {
  const data = fs.readFileSync('./package.json');
  return JSON.parse(data.toString());
};

export const assertNodeVersion = (node: string) => {
  if (!satisfies(process.version, node)) {
    error(`The current node version ${process.version} does not satisfy the required version ${node} .`);
  }
};

export const assertNPMVersion = async (version: string) => {
  const npmVersion = await getCurrentNPMVersion();
  if (!satisfies(npmVersion, version)) {
    error(`The current npm version ${npmVersion} does not satisfy the required version ${version} .`);
  }
};

export const assertYarnVersion = async (version: string) => {
  const yarnVersion = await getCurrentYarnVersion();
  if (!satisfies(yarnVersion, version)) {
    error(`The current yarn version ${yarnVersion} does not satisfy the required version ${version}. Use "yarn policies set-version ${version}" to select the correct version`);
  }
};

const getCurrentNPMVersion = async () => {
  return new Promise((resolve, reject) => {
    exec('npm -v', (err, stdout) => {
      if (err) {
        reject('NPM not installed');
      }
      const npmVersion = stdout.split('\n')[0];
      resolve(npmVersion);
    });
  });
};

const getCurrentYarnVersion = async () => {
  return new Promise((resolve, reject) => {
    exec('yarn -v', (err, stdout) => {
      if (err) {
        reject('Yarn not installed');
      }
      const yarnVersion = stdout.split('\n')[0];
      resolve(yarnVersion);
    });
  });
};

export const initializeNPM = async () => {
  const npmVersion = await getCurrentNPMVersion();
  const version = process.version;
  fs.writeFileSync('./.nvmrc', version);
  const pkg = getPackageJSON();
  pkg.engines = {
    ...pkg.engines,
    node: '=' + version,
    npm: '=' + npmVersion
  };
  pkg.engineStrict = true;
  fs.writeFileSync('./package.json', JSON.stringify(pkg, null, 2));
};

const setPolicies = async (yarnVersion) => {
  return new Promise((resolve, reject) => {
    exec(`yarn policies set-version ${yarnVersion}`, (err) => {
      if (err) {
        reject('Yarn not installed');
      }
      resolve(true);
    });
  });
};

export const initializeYarn = async () => {
  const yarnVersion = await getCurrentYarnVersion();
  await setPolicies(yarnVersion);
  const pkg = getPackageJSON();
  pkg.engines = {
    ...pkg.engines,
    yarn: '=' + yarnVersion
  };
  pkg.engineStrict = true;
  fs.writeFileSync('./package.json', JSON.stringify(pkg, null, 2));
};
