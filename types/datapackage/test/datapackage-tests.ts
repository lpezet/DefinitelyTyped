import { Package, Profile, Resource } from 'datapackage';
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
