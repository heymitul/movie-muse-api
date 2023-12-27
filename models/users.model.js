module.exports = (mongoose) => {
  const schema = mongoose.Schema(
      {
        _id: String,
        name: String,
        email: String
      },
      {
        timestamps: true
      }
  );

  schema.method('toJSON', function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  return mongoose.model('users', schema);
};
