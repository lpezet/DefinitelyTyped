import { Schema, Field, Table } from 'tableschema';
const SOURCE = [
    ['id', 'height', 'age', 'name', 'occupation'],
    [1, '10.0', 1, 'string1', '2012-06-15 00:00:00'],
    [2, '10.1', 2, 'string2', '2013-06-15 01:00:00'],
    [3, '10.2', 3, 'string3', '2014-06-15 02:00:00'],
    [4, '10.3', 4, 'string4', '2015-06-15 03:00:00'],
    [5, '10.4', 5, 'string5', '2016-06-15 04:00:00'],
];
const SCHEMA = {
    fields: [
        { name: 'id', type: 'integer', constraints: { required: true } },
        { name: 'height', type: 'number' },
        { name: 'age', type: 'integer' },
        { name: 'name', type: 'string', constraints: { unique: true } },
        { name: 'occupation', type: 'datetime', format: 'any' },
    ],
    primaryKey: 'id',
};
Schema.load(SCHEMA)
    .then((s: Schema) => {
        return Table.load(SOURCE, { schema: s });
    })
    .then((t: Table) => {
        t.read();
    });
