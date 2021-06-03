import { isNPMInitialized, isYarnInitialized } from '../main';
import * as utils from '../utils';

jest.mock('../utils');

describe('main', () => {
  describe('isNPMInitialized', () => {
    it('should return false if no engines is in package.json', () => {
      (process as any).exit = jest.fn();
      (utils as any).getPackageJSON = () => ({});

      isNPMInitialized();

      expect(process.exit).toBeCalledWith(1);
    });

    it('should return false if no engines.npm is in package.json', () => {
      (process as any).exit = jest.fn();
      (utils as any).getPackageJSON = () => ({ engines: {} });

      isNPMInitialized();

      expect(process.exit).toBeCalledWith(1);
    });

    it('should return false if no engines.node is in package.json', () => {
      (process as any).exit = jest.fn();
      (utils as any).getPackageJSON = () =>
        ({ engines: { npm: '1' } });

      isNPMInitialized();

      expect(process.exit).toBeCalledWith(1);
    });

    it('should return false if engineStrict is not in package.json', () => {
      (process as any).exit = jest.fn();
      (utils as any).getPackageJSON = () =>
        ({ engines: { npm: '1', node: '2' } });

      isNPMInitialized();

      expect(process.exit).toBeCalledWith(1);
    });

    it('should return true if engines.node and npm and engineStrict are in package.json', () => {
      (process as any).exit = jest.fn();
      (utils as any).getPackageJSON = () =>
        ({ engines: { npm: '1', node: '2' }, engineStrict: true });

      isNPMInitialized();

      expect(process.exit).not.toBeCalled();
    });
  });

  describe('isYarnInitialized', () => {
    it('should return false if no engines is in package.json', () => {
      (process as any).exit = jest.fn();
      (utils as any).getPackageJSON = () => ({});

      isYarnInitialized();

      expect(process.exit).toBeCalledWith(1);
    });

    it('should return false if no engines.yarn in the package.json', () => {
      (process as any).exit = jest.fn();
      (utils as any).getPackageJSON = () => ({ engines: {} });

      isYarnInitialized();

      expect(process.exit).toBeCalledWith(1);
    });

    it('should return false if engineStrict is not in package.json', () => {
      (process as any).exit = jest.fn();
      (utils as any).getPackageJSON = () =>
        ({ engines: { yarn: '1' } });

      isYarnInitialized();

      expect(process.exit).toBeCalledWith(1);
    });
  });
});
