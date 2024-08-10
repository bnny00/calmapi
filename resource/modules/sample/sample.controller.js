'use strict';
const { CalmController } = require( '../../../system/core/CalmController' );
const { MODULE_SINGULAR_PASCALService } = require( './MODULE_SINGULAR_KEBAB.service' );
const { MODULE_SINGULAR_PASCAL } = require( './MODULE_SINGULAR_KEBAB.model' );
const MODULE_SINGULAR_CAMELDTO = require( './MODULE_SINGULAR_KEBAB.dto' );
const autoBind = require( 'auto-bind' ),
    MODULE_SINGULAR_CAMELService = new MODULE_SINGULAR_PASCALService(
        new MODULE_SINGULAR_PASCAL().getInstance()
    );

class MODULE_SINGULAR_PASCALController extends CalmController {

    constructor( service ) {
        super( service );
        this.dto = { ...this.dto, ...MODULE_SINGULAR_CAMELDTO };
        autoBind( this );
    }

    async getAll(req, res, next) {
        const user = req.user;
        req.query[ 'IMO_No' ] = user.IMO_No;

        try {
            const response = await this.service.getAll(req.query);
            res.sendCalmResponse(response.data, { totalCount: response.total });
        } catch (e) {
            next(e);
        }
    }

    async get(req, res, next) {
        const { id } = req.params;
        try {
            const response = await this.service.get(id);
            res.sendCalmResponse( response.data );
        } catch (e) {
            next(e);
        }
    }

    async insert(req, res, next) {
        try {
            
            if (req.user.Role === 'reader') {
                throw new CalmError('PERMISSION_DENIED_ERROR');
            }

            if (req.user) {
                req.body.createdBy = req.user._id;
            }

            const response = await this.service.insert( req.body, req.user );

            res.sendCalmResponse( response.data );
        } catch (e) {
            next(e);
        }
    }

    async update(req, res, next) {
        const { id } = req.params;
        try {
            if (req.user.Role === 'reader') {
                throw new CalmError('PERMISSION_DENIED_ERROR');
            }

            if (req.user) {
                req.body.updatedBy = req.user._id;
            }

            const response = await this.service.update( id, req.body );

            res.sendCalmResponse( response.data );
        } catch (e) {
            next(e);
        }
    }

    async delete(req, res, next) {
        const { id } = req.params;
        try {
            if (req.user.Role === 'reader') {
                throw new CalmError('PERMISSION_DENIED_ERROR');
            }

            const response = await this.service.delete(id);

            res.sendCalmResponse( response.data, { deleted: response.deleted });
        } catch (e) {
            next(e);
        }
    }

}

module.exports = new MODULE_SINGULAR_PASCALController( MODULE_SINGULAR_CAMELService );
