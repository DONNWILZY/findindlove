const matchSchema = new mongoose.Schema({
    maleHouseMate: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    femaleHouseMate: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    approvalStatus: {
        maleApproval: {
            type: String,
            enum: ['pending', 'approved', 'rejected'],
            default: 'pending'
        },
        femaleApproval: {
            type: String,
            enum: ['pending', 'approved', 'rejected'],
            default: 'pending'
        }
    },
    status: {
        type: String,
        enum: ['pending', 'matched', 'rejected'],
        default: 'pending'
    },

   
}, { timestamps: true });