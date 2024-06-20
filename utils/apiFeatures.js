class apiFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    //filtering
    const queryObj = { ...this.queryString }; //creates a copy of the query parameters in the url
    const excludeFields = ['page', 'sort', 'limit', 'fields'];
    excludeFields.forEach((e) => delete queryObj[e]);
    this.query = this.query.find(queryObj);
    //let query = Tour.find(queryObj)//creates a mongoose query object, find all documents in the tour collection that match the query parameters
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortByAnyDocument = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortByAnyDocument);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 10;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = apiFeatures;
