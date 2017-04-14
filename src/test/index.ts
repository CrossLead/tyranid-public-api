import test from 'ava';
import { join } from 'path';
import { Tyr } from 'tyranid';

import {
  path,
  schema,
  spec,
} from '../';

import {
  pascalCase,
  yaml,
} from '../utils';

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
  t.is(pascalCase('my short sentence'), 'MyShortSentence');
  t.is(pascalCase('my_snake_sentence'), 'MySnakeSentence');
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

test('should generate correct definition from schema with nesting', async (t) => {
  const s = spec(Tyr);
  console.log(yaml(s));
  t.pass();
});
