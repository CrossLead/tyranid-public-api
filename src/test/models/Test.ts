import { Tyr } from 'tyranid';

export default new Tyr.Collection({
  id: 't00',
  name: 'test',
  dbName: 'test',
  swagger: true,
  fields: {
    _id: { is: 'mongoid' },
    name: { is: 'string' },
    linkId: { link: 'linked' },
    nestedMapArray: {
      is: 'array',
      of: {
        is: 'object',
        keys: { is: 'string' },
        of: { is: 'object', keys: { is: 'string' }, of: { link: 'user' } },
      },
    },
    list: {
      is: 'array',
      of: {
        is: 'object',
        fields: { type: { is: 'integer' }, name: { is: 'string' } },
      },
    },
  },
});
