import { type ClientSchema, a, defineData } from "@aws-amplify/backend";
import { postConfirmation } from "../auth/post-confirmation/resource";

const schema = a
  .schema({
    UserProfile: a
      .model({
        email: a.string(),
        profileOwner: a.string(),
        adLocations: a.hasMany('AdLocation', {
          references: ['userProfileId']  // Specify the reference field
        }),
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
        userProfileId: a.string(),  // Reference field for the relationship
        userProfile: a.belongsTo('UserProfile', {
          references: ['userProfileId']  // Specify the reference field
        }),
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
