import { Tyr } from 'tyranid';

export default new Tyr.Collection({
  id: 't01',
  name: 'linked',
  dbName: 'linked',
  swagger: true,
  fields: { _id: { is: 'mongoid' }, name: { is: 'string' } }
});
