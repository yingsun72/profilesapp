import { type ClientSchema, a, defineData } from "@aws-amplify/backend";
import { postConfirmation } from "../auth/post-confirmation/resource";

const schema = a
  .schema({
    UserProfile: a
      .model({
        email: a.string(),
        profileOwner: a.string(),
        adLocations: a.hasMany('AdLocation'),  // Simplified relationship
      })
      .authorization((allow) => [
        allow.ownerDefinedIn("profileOwner"),
      ]),

    AdLocation: a
      .model({
        profileOwner: a.string(),
        objectId: a.string(),
        location: a.string(),
        scanDate: a.datetime(),
        qrCode: a.string(),
        userProfileID: a.string(),  // Add this field
        userProfile: a.belongsTo('UserProfile'),  // Simplified relationship
      })
      .authorization((allow) => [
        allow.ownerDefinedIn("profileOwner"),
      ]),
  })
  .authorization((allow) => [allow.resource(postConfirmation)]);

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "apiKey",
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});