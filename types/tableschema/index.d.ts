// Type definitions for datapackage 1.0
// Project: https://github.com/frictionlessdata/datapackage-js
// Definitions by: Luke Pezet <https://github.com/lpezet>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// Minimum TypeScript Version: 3.6

/// <reference types="node"/>

import * as Stream from 'stream';

export class Profile {
    static load(profile: any): Promise<Profile>;

    get name(): string | null;

    get jsonschema(): any;

    validate(descriptor: any): { valid: boolean; errors: Error[] };
}
export class Table {
    /**
     * Factory method to instantiate `Table` class.
     *
     * This method is async and it should be used with await keyword or as a `Promise`.
     * If `references` argument is provided foreign keys will be checked
     * on any reading operation.
     *
     * @param source - data source (one of):
     *   - local CSV file (path)
     *   - remote CSV file (url)
     *   - array of arrays representing the rows
     *   - readable stream with CSV file contents
     *   - function returning readable stream with CSV file contents
     * @param schema - data schema
     *   in all forms supported by `Schema` class
     * @param strict - strictness option to pass to `Schema` constructor
     * @param headers - data source headers (one of):
     *   - row number containing headers (`source` should contain headers rows)
     *   - array of headers (`source` should NOT contain headers rows)
     * @param parserOptions - options to be used by CSV parser.
     *   All options listed at <http://csv.adaltas.com/parse/#parser-options>.
     *   By default `ltrim` is true according to the CSV Dialect spec.
     * @throws raises any error occurred in table creation process
     * @returns data table class instance
     *
     */
    static load(
        source: string | any[] | Stream | (() => Stream),
        options?: {
            schema?: string | object;
            strict?: boolean;
            headers?: number | string[];
            format?: string;
            encoding?: string;
            parserOptions?: any;
        },
    ): Promise<Table>;

    /**
     * Headers
     *
     * @returns data source headers
     */
    get headers(): string[];

    /**
     * Schema
     *
     * @returns table schema instance
     */
    get schema(): Schema;

    /**
     * Iterate through the table data
     *
     * And emits rows cast based on table schema (async for loop).
     * With a `stream` flag instead of async iterator a Node stream will be returned.
     * Data casting can be disabled.
     *
     * @param keyed - iter keyed rows
     * @param extended - iter extended rows
     * @param cast - disable data casting if false
     * @param forceCast - instead of raising on the first row with cast error
     *   return an error object to replace failed row. It will allow
     *   to iterate over the whole data file even if it's not compliant to the schema.
     *   Example of output stream:
     *     `[['val1', 'val2'], TableSchemaError, ['val3', 'val4'], ...]`
     * @param relations - object of foreign key references in a form of
     *   `{resource1: [{field1: value1, field2: value2}, ...], ...}`.
     *   If provided foreign key fields will checked and resolved to its references
     * @param stream - return Node Readable Stream of table rows
     * @throws raises any error occurred in this process
     * @returns async iterator/stream of rows:
     *  - `[value1, value2]` - base
     *  - `{header1: value1, header2: value2}` - keyed
     *  - `[rowNumber, [header1, header2], [value1, value2]]` - extended
     */
    iter(options?: {
        keyed?: boolean;
        extended?: boolean;
        cast?: boolean;
        relations?: boolean;
        stream?: boolean;
        forceCast?: boolean;
    }): Promise<AsyncIterator<any> | Stream>;

    /**
     * Read the table data into memory
     *
     * > The API is the same as `table.iter` has except for:
     *
     * @param limit - limit of rows to read
     * @returns list of rows:
     *  - `[value1, value2]` - base
     *  - `{header1: value1, header2: value2}` - keyed
     *  - `[rowNumber, [header1, header2], [value1, value2]]` - extended
     */
    read(options?: {
        keyed: boolean;
        extended: boolean;
        cast: boolean;
        relations: boolean;
        limit: number;
        forceCast: boolean;
    }): Promise<any[]>;

    /**
     * Infer a schema for the table.
     *
     * It will infer and set Table Schema to `table.schema` based on table data.
     *
     * @param limit - limit rows sample size
     * @returns Table Schema descriptor
     */
    infer(options?: { limit: number }): Promise<any>;

    /**
     * Save data source to file locally in CSV format with `,` (comma) delimiter
     *
     * @param target  - path where to save a table data
     * @throws an error if there is saving problem
     * @returns true on success
     */
    save(target: string): Promise<boolean>;
}

export class Field {
    /**
     * Constructor to instantiate `Field` class.
     * @param descriptor - schema field descriptor
     * @param missingValues - an array with string representing missing values
     * @throws raises any error occured in the process
     * @returns returns field class instance
     */
    constructor(descriptor: any, options?: { missingValues: string[] });

    /**
     * Field name
     *
     * @returns
     */
    get name(): string;

    /**
     * Field type
     *
     * @returns
     */
    get type(): string;

    /**
     * Field format
     *
     * @returns
     */
    get format(): string;

    /**
     * Return true if field is required
     *
     * @returns
     */
    get required(): boolean;

    /**
     * Field constraints
     *
     * @returns
     */
    get constraints(): any;

    /**
     * Field descriptor
     *
     * @returns
     */
    get descriptor(): any;

    /**
     * Cast value
     *
     * @param value - value to cast
     * @param constraints
     * @returns cast value
     */
    castValue(value: any, options?: { constraints: boolean }): any;

    /**
     * Check if value can be cast
     *
     * @param value - value to test
     * @param constraints
     * @returns
     */
    testValue(value: any, options?: { constraints: boolean }): boolean;
}

export class Schema {
    /**
     * Factory method to instantiate `Schema` class.
     *
     * This method is async and it should be used with await keyword or as a `Promise`.
     *
     * @param descriptor - schema descriptor:
     *   - local path
     *   - remote url
     *   - object
     * @param strict - flag to alter validation behaviour:
     *   - if false error will not be raised and all error will be collected in `schema.errors`
     *   - if strict is true any validation error will be raised immediately
     * @throws raises any error occurred in the process
     * @returns returns schema class instance
     */
    static load(descriptor: any, options?: { strict: boolean; caseInsensitiveHeaders: boolean }): Promise<Schema>;

    /**
     * Validation status
     *
     * It always `true` in strict mode.
     *
     * @returns returns validation status
     */
    get valid(): boolean;

    /**
     * Validation errors
     *
     * It always empty in strict mode.
     *
     * @returns returns validation errors
     */
    get errors(): Error[];

    /**
     * Descriptor
     *
     * @returns schema descriptor
     */
    get descriptor(): any;

    /**
     * Primary Key
     *
     * @returns schema primary key
     */
    get primaryKey(): string[];

    /**
     * Foreign Keys
     *
     * @returns schema foreign keys
     */
    get foreignKeys(): any[];

    /**
     * Fields
     *
     * @returns schema fields
     */
    get fields(): Field[];

    /**
     * Field names
     *
     * @returns schema field names
     */
    get fieldNames(): string[];

    /**
     * Return a field
     *
     * @param fieldName
     * @returns field instance if exists
     */
    getField(fieldName: string, options?: { index: number }): Field | null;

    /**
     * Add a field
     *
     * @param descriptor
     * @returns added field instance
     */
    addField(descriptor: any): Field;

    /**
     * Remove a field
     *
     * @param name
     * @returns removed field instance if exists
     */
    removeField(name: string): Field | null;

    /**
     * Cast row based on field types and formats.
     *
     * @param row - data row as an array of values
     * @param failFalst
     * @returns cast data row
     */
    castRow(row: any[], options?: { failFast: boolean }): any[];

    /**
     * Infer and set `schema.descriptor` based on data sample.
     *
     * @param rows - array of arrays representing rows
     * @param headers - data sample headers (one of):
     *   - row number containing headers (`rows` should contain headers rows)
     *   - array of headers (`rows` should NOT contain headers rows)
     *   - defaults to 1
     * @returns Table Schema descriptor
     */
    infer(rows: any[], options?: { headers: number }): any;

    /**
     * Update schema instance if there are in-place changes in the descriptor.
     *
     * @example
     *
     * ```javascript
     * const descriptor = {fields: [{name: 'field', type: 'string'}]}
     * const schema = await Schema.load(descriptor)
     *
     * schema.getField('name').type // string
     * schema.descriptor.fields[0].type = 'number'
     * schema.getField('name').type // string
     * schema.commit()
     * schema.getField('name').type // number
     * ```
     *
     * @param strict - alter `strict` mode for further work
     * @throws raises any error occurred in the process
     * @returns returns true on success and false if not modified
     */
    commit(options?: { strict: boolean }): boolean;

    /**
     * Save schema descriptor to target destination.
     *
     * @param target - path where to save a descriptor
     * @throws raises any error occurred in the process
     * @returns returns true on success
     */
    save(target: string): boolean;
}

export as namespace tableschema;
