import { Document, Model, model, Schema } from "mongoose";

const connectionsSchema: Schema = new Schema({
  startStation: { type: String, unique: true},
  endStation:   { type: String, unique: true},
});

connectionsSchema.method("toJSON", function() {
	const { _id, ...object } = this.toObject();
  object.id = _id;
  return object;
})

interface ITrainConnection extends Document {
  startStation: string,
  endStation:   string,
}

let connectionModel: Model<ITrainConnection> = model<ITrainConnection>("TrainConnection", connectionsSchema);

export { connectionModel as trainConnection };