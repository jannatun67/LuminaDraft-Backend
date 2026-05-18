import mongoose, { Schema, Document } from 'mongoose';

export interface IService extends Document {
  title: string;
  description: string;
  price: number;
  category: string;
  rating: number;
  image: string;
  users: number;
  deliveryTime: string;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ServiceSchema: Schema<IService> = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: 0,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['Content Writing', 'Image Generation', 'Code Assistant', 'Data Analysis', 'AI Automation', 'Voice Synthesis'],
      index: true,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    image: {
      type: String,
      required: [true, 'Image URL is required'],
    },
    users: {
      type: Number,
      default: 0,
    },
    deliveryTime: {
      type: String,
      default: '2-3 days',
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Create text index for search
ServiceSchema.index({ title: 'text', description: 'text' });

export const Service = mongoose.model<IService>('Service', ServiceSchema);