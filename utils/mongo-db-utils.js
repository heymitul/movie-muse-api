async function createRecord(model, objectToBeCreated) {
  try {
    console.debug(`Creating document for '${model.collection.collectionName}'`);
    const modelObj = new model(objectToBeCreated);

    // Save model in the database
    let data = await modelObj.save(objectToBeCreated);
    console.debug(`Created document for '${model.collection.collectionName}'`);

    data = {
      id: data._doc._id.toString(),
      ...data._doc
    };

    return data;
  } catch (err) {
    throw {
      message: err.message || `Unknown error occurred while creating '${model.collection.collectionName}.`
    };
  }
}

async function updateRecordById(model, id, objectToBeUpdated) {
  try {
    console.debug(`Updating document for '${model.collection.collectionName}'`, objectToBeUpdated);
    await model.findOneAndUpdate({ _id: id }, objectToBeUpdated);
    console.debug(`Updated document for '${model.collection.collectionName}'`);
  } catch (err) {
    throw {
      code: err.code || 500,
      message: err.message || `'${model.collection.collectionName}' doesn't exist.`
    };
  }
}

async function getRecordByQuery(model, query) {
  try {
    console.debug(`Retrieving '${model.collection.collectionName}'.`);
    return await model.findOne(query);
  } catch (err) {
    throw {
      code: err.code || 500,
      message: err.message || `Unknown error occurred while retrieving '${model.collection.collectionName}.`
    };
  }
}

async function getAllRecordsByQuery(model, query) {
  try {
    console.debug(`Retrieving all '${model.collection.collectionName}'.`);

    return await model.find(query).lean();
  } catch (err) {
    throw {
      code: err.code || 500,
      message: err.message || `Unknown error occurred while retrieving '${model.collection.collectionName}.`
    };
  }
}

async function getRecordById(model, id) {
  try {
    console.debug(`Retrieving '${model.collection.collectionName}' with ${id}.`);

    return await model.findById(id);
  } catch (err) {
    console.log(err)
    throw {
      code: err.code || 500,
      message: err.message || `Unknown error occurred while retrieving '${model.collection.collectionName}.`
    };
  }
}

async function getAllRecords(model, paginationInfo, lookupInfo = null) {
  try {
    console.debug(`Retrieving all documents for '${model.collection.collectionName}'.`);
    const {
      page = 1,
      limit = 25,
      query = {},
      sortBy = 'createdAt',
      sortOrder = 'ASC'
    } = paginationInfo;

    const skip = (page - 1) * limit;

    const pipeline = [
      {
        $sort: {
          [sortBy]: sortOrder === 'ASC' ? 1 : -1
        }
      },
      {
        $skip: skip
      },
      {
        $limit: limit * 1
      }
    ];

    if (query) {
      pipeline.push({ $match: query });
    }

    if (lookupInfo) {
      pipeline.push({
        $lookup: lookupInfo
      });
    }

    let records = await model.aggregate(pipeline);
    records = (records || []).map(record => {
      return {
        ...record,
        id: record._id
      }
    })

    const total = await model.countDocuments(query || {});

    return {
      totalRecords: total,
      records: records,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    };
  } catch (err) {
    console.log(err)
    throw {
      code: err.code || 500,
      message: err.message || `Unknown error occurred while retrieving pagination of '${model.collection.collectionName}.`
    };
  }
}

async function deleteRecordById(model, id) {
  try {
    console.debug(`Deleting '${model.collection.collectionName}' with ${id}.`);
    const data = await model.findByIdAndRemove(id, { useFindAndModify: false });
    if (!data) {
      throw {
        code: 404,
        message: `'${model.collection.collectionName}' with id: ${id} doesn't exist.`
      };
    }

    console.debug(`Deleted '${model.collection.collectionName}' with id: ${id}`);
  } catch (err) {
    throw {
      code: err.code || 500,
      message: err.message || `'${model.collection.collectionName}' doesn't exist.`
    };
  }
}

module.exports = {
  createRecord,
  updateRecordById,
  deleteRecordById,
  getRecordByQuery,
  getAllRecordsByQuery,
  getRecordById,
  getAllRecords
};
