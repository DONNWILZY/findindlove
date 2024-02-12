const mongoose = require('mongoose');

const DevicePermissionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    permissions: {
        camera: {
            type: Boolean,
            default: false
        },
        location: {
            type: Boolean,
            default: false
        },
        microphone: {
            type: Boolean,
            default: false
        },
        phone: {
            type: Boolean,
            default: false
        },
        email: {
            type: Boolean,
            default: false
        },
        storage: {
            type: Boolean,
            default: false
        },
       
    }
});

const DevicePermission = mongoose.model('DevicePermission', DevicePermissionSchema);

module.exports = DevicePermission;
