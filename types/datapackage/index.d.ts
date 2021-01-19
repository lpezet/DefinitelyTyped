// Type definitions for datapackage 1.0
// Project: https://github.com/frictionlessdata/datapackage-js
// Definitions by: Luke Pezet <https://github.com/lpezet>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// Minimum TypeScript Version: 3.6

/// <reference types="node"/>

import * as Stream from 'stream';

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

export class Resource {
    /**
     * Factory method to instantiate `Resource` class.
     *
     * This method is async and it should be used with await keyword or as a `Promise`.
     *
     * @param descriptor - resource descriptor as local path, url or object
     * @param basePath - base path for all relative paths
     * @param strict - strict flag to alter validation behavior.
     *   Setting it to `true` leads to throwing errors on
     *   any operation with invalid descriptor
     * @throws raises error if something goes wrong
     * @returns returns resource class instance
     */
    static load(descriptor: any, options?: { basePath: string; strict: boolean }): Promise<Resource>;

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
     * Profile
     *
     * @returns
     */
    get profile(): Profile;

    /**
     * Descriptor
     *
     * @returns schema descriptor
     */
    get descriptor(): any;

    /**
     * Name
     *
     * @returns
     */
    get name(): string;

    /**
     * Whether resource is inline
     *
     * @returns
     */
    get inline(): boolean;

    /**
     * Whether resource is local
     *
     * @returns
     */
    get local(): boolean;

    /**
     * Whether resource is remote
     *
     * @returns
     */
    get remote(): boolean;

    /**
     * Whether resource is multipart
     *
     * @returns
     */
    get multipart(): boolean;

    /**
     * Whether resource is tabular
     *
     * @returns
     */
    get tabular(): boolean;

    /**
     * Source
     *
     * Combination of `resource.source` and `resource.inline/local/remote/multipart`
     * provides predictable interface to work with resource data.
     *
     * @returns
     */
    get source(): string[] | string;

    /**
     * Headers
     *
     * > Only for tabular resources
     *
     * @returns data source headers
     */
    get headers(): string[];

    /**
     * Schema
     *
     * > Only for tabular resources
     *
     * @returns
     */
    get schema(): Schema;

    /**
     * Iterate through the table data
     *
     * > Only for tabular resources
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
     * @param relations - if true foreign key fields will be
     *   checked and resolved to its references
     * @param stream - return Node Readable Stream of table rows
     * @throws raises any error occurred in this process
     * @returns async iterator/stream of rows:
     *  - `[value1, value2]` - base
     *  - `{header1: value1, header2: value2}` - keyed
     *  - `[rowNumber, [header1, header2], [value1, value2]]` - extended
     */
    iter(options: {
        relations: boolean;
        keyed: boolean;
        extended: boolean;
        forceCast: boolean;
        stream: boolean;
    }): Promise<AsyncIterator<any> | Stream>;

    /**
     * Read the table data into memory
     *
     * > Only for tabular resources; the API is the same as `resource.iter` has except for:
     *
     * @param limit - limit of rows to read
     * @returns list of rows:
     *  - `[value1, value2]` - base
     *  - `{header1: value1, header2: value2}` - keyed
     *  - `[rowNumber, [header1, header2], [value1, value2]]` - extended
     */
    read(options?: { relations: boolean; limit: number }): Promise<any[]>;

    /**
     * It checks foreign keys and raises an exception if there are integrity issues.
     *
     * > Only for tabular resources
     *
     * @throws raises if there are integrity issues
     * @returns returns True if no issues
     */
    checkRelations(): Promise<boolean>;

    /**
     * Iterate over data chunks as bytes. If `stream` is true Node Stream will be returned.
     *
     * @param stream - Node Stream will be returned
     * @returns returns Iterator/Stream
     */
    rawIter(options?: { stream: boolean }): Promise<Iterator<any> | Stream>;

    /**
     * Returns resource data as bytes.
     *
     * @returns returns Buffer with resource data
     */
    rawRead(): Buffer;

    /**
     * Infer resource metadata like name, format, mediatype, encoding, schema and profile.
     *
     * It commits this changes into resource instance.
     *
     * @returns returns resource descriptor
     */
    infer(): Promise<any>;

    /**
     * Update resource instance if there are in-place changes in the descriptor.
     *
     * @param strict - alter `strict` mode for further work
     * @throws DataPackageError raises error if something goes wrong
     * @returns returns true on success and false if not modified
     */
    commit(options?: { strict: boolean }): boolean;

    /**
     * Save resource to target destination.
     *
     * > For now only descriptor will be saved.
     *
     * @param target - path where to save a resource
     * @throws raises error if something goes wrong
     * @returns returns true on success
     */
    save(target: string): boolean;
}

export class Profile {
    /**
     * Factory method to instantiate `Profile` class.
     *
     * This method is async and it should be used with await keyword or as a `Promise`.
     *
     * @param profile - profile name in registry or URL to JSON Schema
     * @throws raises error if something goes wrong
     * @returns returns profile class instance
     */
    static load(profile: string): Promise<Profile>;

    /**
     * Name
     *
     * @returns
     */
    get name(): string;

    /**
     * JsonSchema
     *
     * @returns
     */
    get jsonschema(): any;

    /**
     * Validate a data package `descriptor` against the profile.
     *
     * @param descriptor - retrieved and dereferenced data package descriptor
     * @returns returns a `{valid, errors}` object
     */
    validate(descriptor: any): any;
}

export class Package {
    /**
     * Factory method to instantiate `Package` class.
     *
     * This method is async and it should be used with await keyword or as a `Promise`.
     *
     * @param descriptor - package descriptor as local path, url or object.
     *   If ththe path has a `zip` file extension it will be unzipped
     *   to the temp directory first.
     * @param basePath - base path for all relative paths
     * @param strict - strict flag to alter validation behavior.
     *   Setting it to `true` leads to throwing errors on any operation
     *   with invalid descriptor
     * @throws raises error if something goes wrong
     * @returns returns data package class instance
     */
    static load(descriptor: any, options?: { basePath: string; strict: boolean }): Promise<Package>;
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
     * Profile
     *
     * @returns
     */
    get profile(): Profile;

    /**
     * Descriptor
     *
     * @returns schema descriptor
     */
    get descriptor(): any;

    /**
     * Resources
     *
     * @returns
     */
    get resources(): Resource[];

    /**
     * Resource names
     *
     * @returns
     */
    get resourceNames(): string[];

    /**
     * Return a resource
     *
     * @param name
     * @returns resource instance if exists
     */
    getResource(name: string): Resource | null;

    /**
     * Add a resource
     *
     * @param descriptor
     * @returns added resource instance
     */
    addResource(descriptor: any): any;

    /**
     * Remove a resource
     *
     * @param name
     * @returns removed resource instance if exists
     */
    removeResource(name: string): Resource | null;

    /**
     * Infer metadata
     *
     * @param pattern
     * @returns
     */
    infer(pattern?: string): Promise<any>; // Luke: or is it Promise<any>?

    /**
     * Update package instance if there are in-place changes in the descriptor.
     *
     * @example
     *
     * ```javascript
     * const dataPackage = await Package.load({
     *     name: 'package',
     *     resources: [{name: 'resource', data: ['data']}]
     * })
     *
     * dataPackage.name // package
     * dataPackage.descriptor.name = 'renamed-package'
     * dataPackage.name // package
     * dataPackage.commit()
     * dataPackage.name // renamed-package
     * ```
     *
     * @param strict - alter `strict` mode for further work
     * @throws raises any error occurred in the process
     * @returns returns true on success and false if not modified
     */
    commit(options?: { strict: boolean }): boolean;

    /**
     * Save data package to target destination.
     *
     * If target path has a  zip file extension the package will be zipped and
     * saved entirely. If it has a json file extension only the descriptor will be saved.
     *
     * @param target - path where to save a data package
     * @param raises error if something goes wrong
     * @param returns true on success
     */
    save(target: string): boolean;
}

export as namespace datapackage;
