import test from 'ava';
import { Tyr } from 'tyranid';
import * as path from 'path';


test.before(async () => {
  await Tyr.config({
    validate: [
      { glob: path.join(__dirname, './models/*.js') }
    ]
  });
});


test('collections should be present', async (t) => {
  t.truthy(Tyr.collections.length);
});