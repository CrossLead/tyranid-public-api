import test from 'ava';
import { Tyr } from 'tyranid';
import * as path from 'path';

import {
  route,
  definition,
  generate
} from '../';

/**
 * boot tyranid without db
 */
test.before(async (t) => {
  await Tyr.config({
    validate: [
      { glob: path.join(__dirname, './models/*.js') }
    ]
  });
  t.truthy(Tyr.collections.length);
});



test('should generate correct definition from schema', async (t) => {
  const def = definition(Tyr.byName['user'].def);
  t.deepEqual(def.name, 'User');
});