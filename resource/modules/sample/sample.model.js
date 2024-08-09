'use strict';
const mongoose = require( 'mongoose' );
const { Schema } = require( 'mongoose' );
const uniqueValidator = require( 'mongoose-unique-validator' );

class MODULE_SINGULAR_PASCAL {

    initSchema() {
        const schema = new Schema( {
            'IMO_No': {
                'type': String,
                'required': true,
            },
            MODULE_SCHEMA,
            'createdBy': {
                'type': Schema.Types.ObjectId,
                'ref': 'user'
            },
            'updatedBy': {
                'type': Schema.Types.ObjectId,
                'ref': 'user'
            },
        }, { 'timestamps': true } );

        schema.plugin( uniqueValidator );
        try {
            mongoose.model( 'MODULE_SINGULAR_CAMEL', schema );
        } catch ( e ) {

        }

    }

    getInstance() {
        this.initSchema();
        return mongoose.model( 'MODULE_SINGULAR_CAMEL' );
    }
}

module.exports = { MODULE_SINGULAR_PASCAL };
