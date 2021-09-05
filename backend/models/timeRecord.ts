import { Document, Model, model, Schema } from "mongoose";

const recordSchema: Schema = new Schema({
  timeOfScrape:	Date,
  startStation: String,
  endStation:   String,
  departure:		Date,
  delay:				Date,
});

recordSchema.method("toJSON", function() {
	const { _id, ...object } = this.toObject();
  object.id = _id;
  return object;
})

interface ITimeRecord extends Document {
  timeOfScrape:	Date,
  startStation: string,
  endStation:   string,
  departure:		Date,
  delay:				Date
}

let recordModel: Model<ITimeRecord> = model<ITimeRecord>("TimeRecord", recordSchema);

export { recordModel as timeRecord,
          ITimeRecord,
       };