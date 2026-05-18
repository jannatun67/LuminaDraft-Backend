import mongoose, { Schema, Document, Model } from 'mongoose';

export type UserRole = 'Admin' | 'Manager' | 'User';

export interface PublicUserData {
  id: string;
  uid: string;
  email: string;
  name: string;
  role: UserRole;
  profilePic?: string;
  isActive: boolean;
  createdAt: Date;
}

interface UserMethods {
  getPublicData(): PublicUserData;
}

export interface IUser extends Document {
  uid: string;
  email: string;
  name: string;
  role: UserRole;
  profilePic?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema<IUser, Model<IUser>, UserMethods, {}> = new Schema(
  {
    uid: {
      type: String,
      required: [true, 'Firebase UID is required'],
      unique: true,
      index: true,
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email address'],
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters long'],
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    role: {
      type: String,
      enum: {
        values: ['Admin', 'Manager', 'User'],
        message: 'Role must be either Admin, Manager, or User',
      },
      default: 'User',
      required: true,
    },
    profilePic: {
      type: String,
      default: '',
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

UserSchema.index({ email: 1 });
UserSchema.index({ role: 1 });
UserSchema.index({ createdAt: -1 });

UserSchema.pre<IUser>('save', async function () {
  if (this.email) {
    this.email = this.email.toLowerCase();
  }
});

UserSchema.method('getPublicData', function getPublicData() {
  return {
    id: this._id,
    uid: this.uid,
    email: this.email,
    name: this.name,
    role: this.role,
    profilePic: this.profilePic,
    isActive: this.isActive,
    createdAt: this.createdAt,
  };
});

export const User = mongoose.model<IUser, Model<IUser>>('User', UserSchema);
export default User;
