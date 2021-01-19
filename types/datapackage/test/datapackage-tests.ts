import { Package, Profile, Resource, Schema } from 'datapackage';
const packageDescriptor = {
    resources: [
        { name: 'name1', data: ['data'], schema: '#/schemas/main' },
        { name: 'name2', data: ['data'], dialect: '#/dialects/0' },
    ],
    schemas: { main: { fields: [{ name: 'name' }] } },
    dialects: [{ delimiter: ',' }],
};
Package.load(packageDescriptor).then((p: Package) => {});
Profile.load('data-package').then((p: Profile) => {});
const resurceDescriptor = {
    name: 'name',
    data: ['data'],
};
Resource.load(resurceDescriptor).then((r: Resource) => {});
const SCHEMA = {
    fields: [
        { name: 'id', type: 'string', constraints: { required: true } },
        { name: 'height', type: 'number' },
        { name: 'age', type: 'integer' },
        { name: 'name', type: 'string', constraints: { required: true } },
        { name: 'occupation', type: 'string' },
    ],
};
Schema.load(SCHEMA).then((s: Schema) => {});
