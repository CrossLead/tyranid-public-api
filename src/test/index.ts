import test from 'ava';
import { join } from 'path';
import { Tyr } from 'tyranid';

import {
  pascal,
  path,
  schema,
  spec,
  validate,
  yaml
} from '../';

/**
 * boot tyranid without db
 */
test.before(async (t) => {
  await Tyr.config({
    validate: [
      { glob: join(__dirname, './models/*.js') },
    ],
  });
  t.truthy(Tyr.collections.length);
});

test('pascalCase should return correct values', (t) => {
  t.is(pascal('my short sentence'), 'MyShortSentence');
  t.is(pascal('my_snake_sentence'), 'MySnakeSentence');
});

test('should generate correct definition from schema', async (t) => {
  const s = schema(Tyr.byName.user.def);
  t.deepEqual(s.name, 'User');
});

test('should generate correct definition from schema with nesting', async (t) => {
  const s = schema(Tyr.byName.test.def);
  t.deepEqual(s.name, 'Test');
  t.deepEqual(s.schema.properties!.nestedMapArray.type, 'array');
});

test('should generate spec that passes validation', async (t) => {
  const s = spec(Tyr);
  /* tslint:disable */
  require('fs').writeFileSync('./test-spec.yaml', yaml(s))
  /* tslint:enable */
  t.pass();
});
