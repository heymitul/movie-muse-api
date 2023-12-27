module.exports = (mongoose) => {
  const schema = mongoose.Schema(
      {
        _id: String,
        title: String,
        slug: String,
        releasedYear: Number,
        coverUrl: String,
        createdBy: String,
        updatedBy: String
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

  return mongoose.model('movies', schema);
};
