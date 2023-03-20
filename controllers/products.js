const Product = require("../models/product");

const getAllProductsStatic = async (req, res) => {
  // this call is just for testing purposes
  const products = await Product.find({}).select("name price");

  res.status(200).json({ products, nbHits: products.length });
};

/*
PRACTICE FILTERING AND SORT
- filtering - filter the data using some criteria "price < 10"
- sort - sort data based on some criteria "ascending / descending"
*/
const getAllProducts = async (req, res) => {
  const { featured, company, name, sort, fields } = req.query;
  // get the query parameter
  /*
  create URI with query parameters

  http://localhost:3000/api/v1/products?name=ed - ?name=ed -> filter all products that contain "ed" in their "name"
  http://localhost:3000/api/v1/products?name=ed&sort=-name - &sort=-name -> -name  -> sort all products using "name" parameter "descending"
  http://localhost:3000/api/v1/products?fields=name,price - select just certain fields (name, price)
 {{URL}}/products?fields=name,price&sort=name&page=3 - logic is below (skip/limit)
 {{URL}}/products?fields=name,price&sort=name&limit=3 - logic is below (limit only)

  */
  const queryObject = {};

  if (featured) {
    // setup check if req parameter exists
    queryObject.featured = featured === "true" ? true : false;
    // setup logic if this parameter is not added
  }

  if (company) {
    queryObject.company = company;
  }

  if (name) {
    queryObject.name = { $regex: name, $options: "i" };
    // setup regex - name includes part of the string that is passed as parameter
  }

  let result = Product.find(queryObject);
  // define how we want to filter data

  if (sort) {
    const sortList = sort.split(",").join(" ");
    // split into the array and join together
    // name,-price -> name -price
    result = result.sort(sortList);
    // add this sorting parameter if any kind of sort is added
    //.sort("name -price") - used for sorting
  } else {
    result = result.sort("createdAt");
    // if no sort is added automatically sory by "createdAt ascending"
  }

  if (fields) {
    const fieldsList = fields.split(",").join(" ");
    result = result.select(fieldsList);
    //.slect("name price") - select just certain fields
  }

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10; // even if we don't have pagination we still can work with limit only
  const skip = (page - 1) * limit;
  // 10 10 3
  // page 1 = skip 0 - skip 0 items, display 10 items

  result = result.skip(skip).limit(limit);
  // .skip() - amount of items to skip - like pagination
  // .limit() - amount of items to be returned

  const products = await result;
  // then setup sort
  res.status(200).json({ products, nbHits: products.length });
};

module.exports = {
  getAllProductsStatic,
  getAllProducts,
};
