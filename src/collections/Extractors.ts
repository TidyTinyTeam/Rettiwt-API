import {
	IInitializeMediaUploadResponse,
	IListDetailsResponse,
	IResponse,
	ITweetLikeResponse,
	ITweetPostResponse,
	ITweetRetweetResponse,
} from 'rettiwt-core';

import { EBaseType } from '../enums/Data';
import { EResourceType } from '../enums/Resource';
import { CursoredData } from '../models/data/CursoredData';
import { Tweet } from '../models/data/Tweet';
import { User } from '../models/data/User';
import { AllReturnTypes } from '../types/ReturnTypes';

export const extractors: {
	[key in keyof typeof EResourceType]: (response: NonNullable<unknown>) => AllReturnTypes | undefined;
} = {
	/* eslint-disable @typescript-eslint/naming-convention */
	LIST_TWEETS: (response) => new CursoredData<Tweet>(response as IListDetailsResponse, EBaseType.TWEET),

	MEDIA_UPLOAD_APPEND: () => undefined,
	MEDIA_UPLOAD_FINALIZE: () => undefined,
	MEDIA_UPLOAD_INITIALIZE: (response) => (response as IInitializeMediaUploadResponse).media_id_string ?? undefined,

	TWEET_RETWEET: (response) => ((response as ITweetRetweetResponse)?.data?.create_retweet ? true : false),
	TWEET_CREATE: (response) =>
		(response as ITweetPostResponse)?.data?.create_tweet?.tweet_results?.result?.rest_id ?? undefined,
	TWEET_FAVORITE: (response) => ((response as ITweetLikeResponse)?.data?.favorite_tweet ? true : false),
	TWEET_SEARCH: (response) => new CursoredData<Tweet>(response as IResponse<unknown>, EBaseType.TWEET),
	TWEET_DETAILS: (response) => Tweet.single(response as IResponse<unknown>),
	TWEET_FAVORITERS: (response) => new CursoredData<User>(response as IResponse<unknown>, EBaseType.USER),
	TWEET_RETWEETERS: (response) => new CursoredData<User>(response as IResponse<unknown>, EBaseType.USER),

	USER_DETAILS_BY_USERNAME: (response) => User.single(response as IResponse<unknown>),
	USER_DETAILS_BY_ID: (response) => User.single(response as IResponse<unknown>),
	USER_FOLLOWING: (response) => new CursoredData<User>(response as IResponse<unknown>, EBaseType.USER),
	USER_FOLLOWERS: (response) => new CursoredData<User>(response as IResponse<unknown>, EBaseType.USER),
	USER_HIGHLIGHTS: (response) => new CursoredData<Tweet>(response as IResponse<unknown>, EBaseType.TWEET),
	USER_LIKES: (response) => new CursoredData<Tweet>(response as IResponse<unknown>, EBaseType.TWEET),
	USER_MEDIA: (response) => new CursoredData<Tweet>(response as IResponse<unknown>, EBaseType.TWEET),
	USER_SUBSCRIPTIONS: (response) => new CursoredData<User>(response as IResponse<unknown>, EBaseType.USER),
	USER_TWEETS: (response) => new CursoredData<Tweet>(response as IResponse<unknown>, EBaseType.TWEET),
	USER_TWEETS_AND_REPLIES: (response) => new CursoredData<Tweet>(response as IResponse<unknown>, EBaseType.TWEET),
	/* eslint-enable @typescript-eslint/naming-convention */
};
