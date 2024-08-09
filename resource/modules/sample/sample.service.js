'use strict';
const { CalmService } = require( '../../../system/core/CalmService' );

class MODULE_SINGULAR_PASCALService extends CalmService {
    // Setting Global Populate to apply in Get All & Get Single
    populateFields = [ { path: 'createdBy' }, { path: 'updatedBy' } ];
    constructor( model ) {
        super( model );
    }

    async getAll(query) {
        // eslint-disable-next-line prefer-const
        let { skip, limit, sortBy, ...restQuery } = query;

        skip = skip ? Number( skip ) : 0;
        limit = limit ? Number( limit ) : 10;
        sortBy = sortBy ? sortBy : { 'createdAt': -1 };

        try {
            const total = await this.model.countDocuments( restQuery );

            if(limit == Number(0)) {
                return { data: [], total };
            }

            const item = await this.model.find(restQuery).sort( sortBy ).skip( skip ).limit( limit ).populate( this.populateFields );
            
            if( !item ) {
                throw new Error( 'UNKNOWN_ERROR' );
            }
            
            return { 'data': this.parseObj( item ), total };
        }catch(errors) {
            throw errors;
        }
    }

    async get( id ) {
        
        try {

            const item = await this.model.findById( id ).populate( this.populateFields );

            if( !item ) {
                throw new Error( 'UNKNOWN_ERROR' );
            }

            return { 'data': item.toJSON() };

        } catch( errors ) {
            throw errors;
        }

    }

    async insert(data) {
        try {
            const item = await this.model.create(data);
            if ( !item ) {
                throw new Error('UNKNOWN_ERROR');
            }
            return { 'data': item.toJSON() };
        } catch (error) {
            throw error;
        }
    }

    async update(id, data) {
        try {

            const item = await this.model.findByIdAndUpdate( id, { ...data }, { 'new': true, context: 'query' });
            if ( !item ) {
                throw new Error('UNKNOWN_ERROR');
            }
            
            return { 'data': item.toJSON() };
        } catch (error) {
            throw error;
        }
    }

    async delete(id) {
        try {
            
            const item = await this.model.findByIdAndDelete(id);
            if ( !item ) {
                throw new Error('UNKNOWN_ERROR');
            }
            
            return { 'data': item.toJSON() };
        } catch (error) {
            throw error;
        }
    }

    async singleGetForPdf( id ) {
        try {
            const item = await this.model.findById( id ).populate( this.populateFields );
            
            if( !item ) {
                throw new Error('NOT_FOUND_ERROR');
            }
            
            const parsedItem = JSON.parse(JSON.stringify(item));
            return { 'data': parsedItem };

        } catch( errors ) {
            throw errors;
        }
    }
}

module.exports = { MODULE_SINGULAR_PASCALService };
