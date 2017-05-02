import { Tyr } from 'tyranid';

export default new Tyr.Collection({
  id: 'mto',
  name: 'metricObservation',
  dbName: 'metricObservations',
  openAPI: {
    parent: 'metric',
    useParentScope: true
  },
  fields: {
    _id: { is: 'mongoid' },
    metricId: { link: 'metric' },
    organizationId: { is: 'mongoid' },
    date: { is: 'date' },
    value: { is: 'double' }
  },
});
