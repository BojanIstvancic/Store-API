require("dotenv").config();

const connectDB = require("./db/connect");
const Product = require("./models/product");

const jsonProducts = require("./products.json");

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    await Product.deleteMany(); // remove all products that are currently there
    await Product.create(jsonProducts);
    console.log("success");
    process.exit(0);
    // stop the process - running session
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
// node populate - run the file

start();
