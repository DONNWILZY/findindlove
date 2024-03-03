// models/index.js

// Import all models and export them as a single object
const AdminSettings = require('./AdminSetings');
const Comment = require('./Comment');
const CommentReply = require('./CommentReply');
const DataSettings = require('./DataSettings');
const Deposit = require('./Deposit');
const DevicePermission = require('./DevicePermission');
const Form = require('./Form');
const Interest = require('./Interest');
const News = require('./News');
const Notification = require('./Notification');
const OtpCode = require('./OtpCode');
const Post = require('./Post');
const Reaction = require('./Reactions');
const ReportUser = require('./ReportUser');
const Season = require('./Season');
const User = require('./User');
const UserNotes = require('./UserNotes');
const Permission = require('./UserPermission');
const UserSettings = require('./UserSettings');
const VideoContent = require('./VideoContent');
const Vote = require('./Vote');
// const   = require('./');




module.exports = {
    adminSettings: AdminSettings,
    comment: Comment,
    reply: CommentReply,
    dataSettings: DataSettings,
    deposit: Deposit,
    DevicePermission,
    form: Form,
    interest: Interest,
    news: News,
    notification: Notification,
    opt: OtpCode,
    post: Post,
    reaction: Reaction,
    reportAbuse: ReportUser,
    seasn: Season,
    user: User,
    note: UserNotes,
    permission: Permission,
    userSettings: UserSettings,
    video: VideoContent,
    poll: Vote,

};
