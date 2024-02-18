const mongoose = required('momgoose');

const InterestSchema = new mongoose.schema({
user:{
    type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
}





});

const Interest = mongoose.model('Interest', InterestSchema)
module.exports = Interest