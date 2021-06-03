import { processArguments } from '../prompt';

describe('prompt', () => {
  describe('processArguments', () => {
    it('should returns init action when receives the word init as arguments', () => {
      const action = processArguments('init');

      expect(action).toBe('init');
    });

    describe('should returns check action when', () => {
      it('receives the word check as arguments', () => {
        const action = processArguments('check');

        expect(action).toBe('check');
      });

      it('receives the word check with uppercase', () => {
        const action = processArguments('CHECK');

        expect(action).toBe('check');
      });

      it('not receives any word as arguments', () => {
        const action = processArguments();

        expect(action).toBe('check');
      });
    });

    it('should returns help action when receives the help word as arguments', () => {
      const action = processArguments('help');

      expect(action).toBe('help');
    });

    it('should returns help action when receives any other word as arguments', () => {
      const action = processArguments('unknown');

      expect(action).toBe('help');
    });
  });
});
