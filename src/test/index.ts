import test from 'ava';
import { Tyr } from 'tyranid';
import * as path from 'path';


test.before(async (t) => {
  await Tyr.config({
    validate: [
      { glob: path.join(__dirname, './models/*.js') }
    ]
  });
  t.truthy(Tyr.collections.length);
});


test('collections should be present', async (t) => {
  t.truthy(Tyr.collections.length);
});