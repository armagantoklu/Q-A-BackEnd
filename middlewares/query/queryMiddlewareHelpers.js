const searchHelper = (searchKey, query, req) => {
    if (req.query.search) {
        const searcObject = {};
        const regex = new RegExp(req.query.search, 'i');
        searcObject[searchKey] = regex;
        return query = query.where(searcObject);
    }
    return query;
}
const populateHelper = (query, population) => {
    return query.populate(population);
}
const questionSortHelper = (query, req) => {
    //en cok beğeniye göre falan sıralama
    const sortBy = req.params.sortBy;
    if (sortBy === 'most-answered') {
        return query.sort('-answerCount');  //normalde 1-2-3-4 diye gier başına - yazarsan geriden başlar yani en yeni cevabı getir bize dedik
    }       //eğer countlar aynıysa en güncel olanı getir
    if (sortBy === 'most-liked') {
        return query.sort('-likedCount');  //burada da en çok like alandan en az like alana doğru sıraladık
    }
    return query.sort('-createdAt');
};
const paginationHelper = async (totalDocuments, query, req) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const totalQuestion = totalDocuments;

    const pagination = {};

    //buradaki ifde hani 1den önce sayfa olmaması lazım ya onun kontrolünü yapıyoruz 
    //hani sayfa 2deysen 1e dön diye buton olur da 1deyken 0a dön diye olmaz onun kontrolü yapılıyor
    if (startIndex > 0) {
        pagination.previus = {
            page: page - 1,
            limit: limit
        }
    };
    //burada da sorular bitmişse daha kaç sayfa gidicen kontrolü yapılıyor
    if (endIndex < totalQuestion) {
        pagination.next = {
            page: page + 1,
            limit: limit
        }
    };
    return {
        query: query === undefined ? undefined : query.skip(startIndex).limit(limit),
        pagination: pagination,
        startIndex,
        limit
    }
}
module.exports = {
    searchHelper, populateHelper, questionSortHelper, paginationHelper
}