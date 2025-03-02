import { type ClientSchema, a, defineData } from "@aws-amplify/backend";
import { postConfirmation } from "../auth/post-confirmation/resource";

const schema = a
  .schema({
    UserProfile: a
      .model({
        email: a.string(),
        profileOwner: a.string(),
        adLocations: a.hasMany('AdLocation', {
          relationName: 'UserProfileAdLocations',  // Add this
          indexName: 'byUserProfile',  // Add this
          sourceField: 'profileOwner',  // Add this
          targetField: 'profileOwner'   // Add this
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
        userProfile: a.belongsTo('UserProfile', {
          relationName: 'UserProfileAdLocations',  // Add this
          targetNames: ['profileOwner'],
          targetFields: ['profileOwner']
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