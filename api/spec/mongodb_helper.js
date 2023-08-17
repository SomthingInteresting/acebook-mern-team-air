var mongoose = require("mongoose");

beforeAll(function (done) {
  mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });


  var db = mongoose.connection;
  db.on("error", console.error.bind(console, "MongoDB connection error:"));
  db.on("open", function () {
    done();
  });
});

afterAll(function (done) {
  mongoose.connection.close(true, function () {
    done();
  });
});

mongoose.set('useFindAndModify', false);

