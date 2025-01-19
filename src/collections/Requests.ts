import { AxiosRequestConfig } from 'axios';
import { Request } from 'rettiwt-core';
import * as Parser from 'twitter-text';

import { EResourceType } from '../enums/Resource';
import { FetchArgs } from '../models/args/FetchArgs';
import { PostArgs } from '../models/args/PostArgs';


/**
 * The request generator from rettiwt-core.
 *
 * @internal
 */
const request = new Request();

/**
 * The collection of requests to various resources.
 *
 * @internal
 */
export const requests: { [key in keyof typeof EResourceType]: (args: FetchArgs | PostArgs) => AxiosRequestConfig } = {
	/* eslint-disable @typescript-eslint/naming-convention */
	LIST_TWEETS: (args: FetchArgs) => request.list.tweets(args.id!, args.count, args.cursor),

	MEDIA_UPLOAD_APPEND: (args: PostArgs) => request.media.appendUpload(args.upload!.id!, args.upload!.media!),
	MEDIA_UPLOAD_FINALIZE: (args: PostArgs) => request.media.finalizeUpload(args.upload!.id!),
	MEDIA_UPLOAD_INITIALIZE: (args: PostArgs) => request.media.initializeUpload(args.upload!.size!),

	TWEET_DETAILS: (args: FetchArgs) => request.tweet.details(args.id!),
	TWEET_DETAILS_ALT: (args: FetchArgs) => request.tweet.replies(args.id!),
	TWEET_LIKE: (args: PostArgs) => request.tweet.like(args.id!),
	TWEET_POST: (args: PostArgs) => {
		// @ts-ignore
		const parsedTweet = Parser.default.parseTweet(args?.tweet?.text || '');
		const overLength = parsedTweet.weightedLength > 280;

		const config = request.tweet.post(args.tweet!);

		if (config.data.features) {
			config.data.features.responsive_web_twitter_article_tweet_consumption_enabled = true;
			config.data.features.responsive_web_home_pinned_timelines_enabled = true;
			config.data.features.creator_subscriptions_quote_tweet_preview_enabled = false;
			config.data.features.communities_web_enable_tweet_community_results_fetch = true;
			config.data.features.responsive_web_media_download_video_enabled = false;
			config.data.features.verified_phone_label_enabled = false;
			config.data.features.c9s_tweet_anatomy_moderator_badge_enabled = true;
			config.data.features.articles_preview_enabled = true;
			config.data.features.rweb_tipjar_consumption_enabled = true;
			config.data.features.freedom_of_speech_not_reach_fetch_enabled = true;
			config.data.features.graphql_is_translatable_rweb_tweet_is_translatable_enabled = true;
			config.data.features.longform_notetweets_consumption_enabled = true;
			config.data.features.longform_notetweets_inline_media_enabled = true;
			config.data.features.longform_notetweets_rich_text_read_enabled = true;
			config.data.features.responsive_web_edit_tweet_api_enabled = true;
			config.data.features.responsive_web_enhance_cards_enabled = false;
			config.data.features.responsive_web_graphql_exclude_directive_enabled = true;
			config.data.features.responsive_web_graphql_skip_user_profile_image_extensions_enabled = false;
			config.data.features.responsive_web_graphql_timeline_navigation_enabled = true;
			config.data.features.rweb_video_timestamps_enabled = true;
			config.data.features.standardized_nudges_misinfo = true;
			config.data.features.tweet_awards_web_tipping_enabled = false;
			config.data.features.tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled = true;
			config.data.features.view_counts_everywhere_api_enabled = true;
			config.data.features.rweb_client_transaction_id_enabled = false;
		}

		// if (config.data.variables) {
		// 	config.data.variables.withDownvotePerspective = false;
		// 	config.data.variables.withReactionsMetadata = false;
		// 	config.data.variables.withReactionsPerspective = false;
		// 	config.data.variables.withSuperFollowsTweetFields = true;
		// 	config.data.variables.withSuperFollowsUserFields = true;
		// }

		// 超长则换方法
		if (overLength) {
			config.url = 'https://x.com/i/api/graphql/3Wu3Na3lrBzHKWJylOmaSg/CreateNoteTweet';
			config.data.queryId = '3Wu3Na3lrBzHKWJylOmaSg';
		}

		return config;
	},
	TWEET_RETWEET: (args: PostArgs) => request.tweet.retweet(args.id!),
	TWEET_RETWEETERS: (args: FetchArgs) => request.tweet.retweeters(args.id!, args.count, args.cursor),
	TWEET_SCHEDULE: (args: PostArgs) => request.tweet.schedule(args.tweet!, args.tweet!.scheduleFor!),
	TWEET_SEARCH: (args: FetchArgs) => request.tweet.search(args.filter!, args.count, args.cursor),
	TWEET_UNLIKE: (args: PostArgs) => request.tweet.unlike(args.id!),
	TWEET_UNPOST: (args: PostArgs) => request.tweet.unpost(args.id!),
	TWEET_UNRETWEET: (args: PostArgs) => request.tweet.unretweet(args.id!),
	TWEET_UNSCHEDULE: (args: PostArgs) => request.tweet.unschedule(args.id!),

	USER_DETAILS_BY_USERNAME: (args: FetchArgs) => request.user.detailsByUsername(args.id!),
	USER_DETAILS_BY_ID: (args: FetchArgs) => request.user.detailsById(args.id!),
	USER_FEED_FOLLOWED: (args: FetchArgs) => request.user.followed(args.count, args.cursor),
	USER_FEED_RECOMMENDED: (args: FetchArgs) => request.user.recommended(args.count, args.cursor),
	USER_FOLLOW: (args: PostArgs) => request.user.follow(args.id!),
	USER_FOLLOWING: (args: FetchArgs) => request.user.following(args.id!, args.count, args.cursor),
	USER_FOLLOWERS: (args: FetchArgs) => request.user.followers(args.id!, args.count, args.cursor),
	USER_HIGHLIGHTS: (args: FetchArgs) => request.user.highlights(args.id!, args.count, args.cursor),
	USER_LIKES: (args: FetchArgs) => request.user.likes(args.id!, args.count, args.cursor),
	USER_MEDIA: (args: FetchArgs) => request.user.media(args.id!, args.count, args.cursor),
	USER_NOTIFICATIONS: (args: FetchArgs) => request.user.notifications(args.count, args.cursor),
	USER_SUBSCRIPTIONS: (args: FetchArgs) => request.user.subscriptions(args.id!, args.count, args.cursor),
	USER_TIMELINE: (args: FetchArgs) => request.user.tweets(args.id!, args.count, args.cursor),
	USER_TIMELINE_AND_REPLIES: (args: FetchArgs) => request.user.tweetsAndReplies(args.id!, args.count, args.cursor),
	USER_UNFOLLOW: (args: PostArgs) => request.user.unfollow(args.id!),
	/* eslint-enable @typescript-eslint/naming-convention */
};
