import { Tyr } from 'tyranid';

export default new Tyr.Collection({
  id: 't01',
  name: 'metric',
  dbName: 'metrics',
  openAPI: true,
  fields: {
    _id: { is: 'mongoid' },
    name: { is: 'string' }
  },
});
