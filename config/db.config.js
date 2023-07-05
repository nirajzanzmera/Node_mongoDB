const mongoose = require("mongoose")


const dataConnection = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/company', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected');
  } catch (error) {
    console.log(error);
    throw new Error('MongoDB Connection Error');
  }
};



module.exports = dataConnection