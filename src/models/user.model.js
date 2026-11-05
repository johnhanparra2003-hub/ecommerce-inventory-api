import mongoose from 'mongoose';

export const USER_ROLES = Object.freeze({ CUSTOMER: 'customer', ADMIN: 'admin' });

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 50 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: Object.values(USER_ROLES), default: USER_ROLES.CUSTOMER },
    isActive: { type: Boolean, default: true }
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        delete ret.password;
        return ret;
      }
    }
  }
);

export const User = mongoose.model('User', userSchema);
