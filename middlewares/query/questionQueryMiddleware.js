const { searchHelper, populateHelper, questionSortHelper, paginationHelper } = require('./queryMiddlewareHelpers');
const asyncWrapper = require("express-async-handler");
const questionQueryMiddleware = function (model, options) {
    return asyncWrapper(async function (req, res, next) {
        let query = model.find();
        //search
        query = searchHelper('title', query, req);
        if (options && options.poplation) {
            query = populateHelper(query, options.poplation)
        };
        query = questionSortHelper(query, req);
        const total = await model.countDocuments();
        const paginationResult = await paginationHelper(total, query, req);
        query = paginationResult.query;
        const pagination = paginationResult.pagination;
        const queryResults = await query;
        res.queryResults = {
            success: true,
            pagination: pagination,
            count: queryResults.length,
            data: queryResults
        };
        next();
    });
};
module.exports = questionQueryMiddleware;
