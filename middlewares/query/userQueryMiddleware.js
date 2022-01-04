const { searchHelper, paginationHelper } = require('./queryMiddlewareHelpers');
const asyncWrapper = require("express-async-handler");

const userQueryMiddleware = function (model, options) {
    return asyncWrapper(async function (req, res, next) {
        let query = model.find();

        query = searchHelper('name',query,req);
        const total = await model.countDocument();
        const paginationResult = await paginationHelper(total,query,req);
        query = paginationResult.query;
        const pagination = paginationResult.pagination;
        const queryResults  = await query.find();
        res.queryResults = {
            success : true,
            pagination : pagination,
            count : queryResults.length,
            data : queryResults
        }
        next();
    });
};
module.exports = userQueryMiddleware;
