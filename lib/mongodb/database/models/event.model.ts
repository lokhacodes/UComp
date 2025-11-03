import { Document, Schema, model, models } from "mongoose";

export interface IEvent extends Document {
  _id: string;
  title: string;
  description?: string;
  location?: string;
  createdAt: Date;
  imageUrl: string;
  startDateTime: Date;
  endDateTime: Date;
  price: string;
  isFree: boolean;
  url?: string;
  subevents?: {
    name: string;
    description: string;
    isTeamCompetition: boolean;
  }[];
  category: { _id: string, name: string }
  organizer: { _id: string, firstName: string, lastName: string }
}

const SubeventSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  competitionType: { type: String, enum: ['individual', 'team'], required: true },
  teamSize: { type: Number, min: 2 },
})

const EventSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  location: { type: String },
  createdAt: { type: Date, default: Date.now },
  imageUrl: { type: String, required: true },
  startDateTime: { type: Date, default: Date.now },
  endDateTime: { type: Date, default: Date.now },
  price: { type: String },
  isFree: { type: Boolean, default: false },
  url: { type: String },
  subevents: [SubeventSchema],
  category: { type: Schema.Types.ObjectId, ref: 'Category' },
  organizer: { type: Schema.Types.ObjectId, ref: 'User' },
})

const Event = models.Event || model('Event', EventSchema);

export default Event;