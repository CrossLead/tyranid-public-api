import test from 'ava';
import { Tyr } from 'tyranid';
import { join } from 'path';

import {
  path,
  schema,
  generate
} from '../';

/**
 * boot tyranid without db
 */
test.before(async (t) => {
  await Tyr.config({
    validate: [
      { glob: join(__dirname, './models/*.js') }
    ]
  });
  t.truthy(Tyr.collections.length);
});



test('should generate correct definition from schema', async (t) => {
  const def = schema(Tyr.byName['user'].def);
  t.deepEqual(def.name, 'User');
});