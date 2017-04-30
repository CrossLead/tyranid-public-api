import { Tyr } from 'tyranid';

export default new Tyr.Collection({
  id: 'o00',
  name: 'organization',
  dbName: 'organizations',
  openAPI: true,
  fields: {
    _id: { is: 'mongoid' },
    name: { is: 'string' },
    domain: { is: 'url' }
  },
});
