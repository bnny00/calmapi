'use strict';

class GetDTO {
    constructor( { ...props } ) {
        this._id = props._id;
        Object.assign(this, props);

        // Auto Generated Fields
        this.createdBy = props.createdBy;
        this.updatedBy = props.updatedBy;
        this.createdAt = props.createdAt;
        this.updatedAt = props.updatedAt;
        Object.freeze( this );
    }
}


class InsertDTO {
    constructor( { ...props } ) {
        Object.assign(this, props);
        
        // Auto Generated Fields
        this.createdBy = props.createdBy;
        Object.freeze( this );
    }
}

class UpdateDTO {
    constructor( { ...props } ) {
        Object.assign(this, props);
        // Auto Generated Fields
        this.updatedBy = props.updatedBy;
        // Delete Fields which are not present in data
        Object.keys( this ).forEach( key => {
            if ( this[ key ] === undefined ) {
                delete this[ key ];
            }
        } );
        Object.freeze( this );
    }
}

class PrintDTO {

    constructor({ ...props }) {
        Object.assign(this, props);

        // Auto Generated Fields
        this.createdBy = props.createdBy;
        Object.freeze( this );

    }

}


module.exports = { GetDTO, InsertDTO, UpdateDTO, PrintDTO };
