import mongooses from "mongoose";

export const connectToDB = async (MongoURI) => {
  try {
    await mongooses.connect(MongoURI);
    console.log("MongoDB connected");
  } catch (error) {
    console.log(error);
    console.log("Connection failed");
  }
};
