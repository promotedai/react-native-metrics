
/** Semantic type of action event to log. */
export enum ActionType {
  UnknownActionType = 0,

  /** Action that doesn't correspond to any of the below. */
  CustomActionType = 1,

  /** Navigating to details about content. */
  Navigate = 2,

  /** Adding an item to shopping cart. */
  AddToCart = 4,

  /** Remove an item from shopping cart. */
  RemoveFromCart = 10,

  /** Going to checkout. */
  Checkout = 8,

  /** Purchasing an item. */
  Purchase = 3,

  /** Sharing content. */
  Share = 5,

  /** Liking content. */
  Like = 6,

  /** Un-liking content. */
  Unlike = 9,

  /** Commenting on content. */
  Comment = 7,

  /** Making an offer on content. */
  MakeOffer = 11,

  /** Asking a question about content. */
  AskQuestion = 12,

  /** Answering a question about content. */
  AnswerQuestion = 13,

  /** Complete sign-in. */
  CompleteSignIn = 14,

  /** Complete sign-up. */
  CompleteSignUp = 15
};

/** Provides session context for Promoted integration points. */
export interface LoggingSessionInfo {
  logUserId?: string;
  sessionId?: string;
  viewId?: string;
};

/** Logging interface. */
export type PromotedMetricsType = {
  /**
   * Call when sign-in completes with specified user ID.
   * Starts logging session with the provided user and logs a
   * user event.
   */
  startSessionAndLogUser(userId: string): void;

  /**
   * Call when sign-in completes with no user.
   * Starts logging session with signed-out user and logs a
   * user event.
   */
  startSessionAndLogSignedOutUser(): void;

  // Impression logging

  /**
   * Logs an impression for given content.
   * Typically, you would call useImpressionLogger() for use with
   * SectionLists and FlatLists. This method should only be used
   * outside of those components.
   */
  logImpression(content: Object): void;

  // Action logging

  logNavigateAction(screenName: string): void;
  logNavigateActionWithContent(screenName: string, content: Object): void;
  logAddToCartAction(item: Object): void;
  logRemoveFromCartAction(item: Object): void;
  logCheckoutAction(): void;
  logPurchaseAction(item: Object): void;
  logShareAction(content: Object): void;
  logLikeAction(content: Object): void;
  logUnlikeAction(content: Object): void;
  logCommentAction(content: Object): void;
  logMakeOfferAction(content: Object): void;
  logAskQuestionAction(content: Object): void;
  logAnswerQuestionAction(content: Object): void;
  logCompleteSignInAction(): void;
  logCompleteSignUpAction(): void;
  logAction(name: string): void;
  logActionWithType(name: string, type: ActionType): void;
  logActionWithContent(name: string, type: ActionType, content: Object): void;

  // View logging

  /**
   * Logs a screen view. Use with NavigationContainer's onReady handler
   * to provide the name and key from the current navigation route.
   */
  logViewReady(routeName: string, routeKey: string): void;

  /**
   * Logs a screen view. Use with NavigationContainer's onChange handler
   * to provide the name and key from the current navigation route.
   */
  logViewChange(routeName: string, routeKey: string): void;

  // Impression logging

  /**
   * Begins tracking session for given collection view.
   * Can be called multiple times in succession, such as when a collection
   * view reloads on a timer. In these cases, the impression logging state
   * from the previous session will persist.
   *
   * @param collectionViewName identifier for collection view to track
   */
  collectionViewDidLoad(collectionViewName: string): void;

  /**
   * Logs impressions for changed content.
   * Call this method with currently visible content and the underlying
   * `ImpressionLogger` will calculate deltas and log appropriate events.
   *
   * @param visibleContent list of currently visible content
   * @param collectionViewName identifier for collection view to track
   */
  collectionViewDidChange(visibleContent: Array<Object>, collectionViewName: string): void;

  /**
   * Ends tracking session for given collection view.
   * Drops all associated impression logging state.
   *
   * @param collectionViewName identifier for collection view to track
   */
  collectionViewDidUnmount(collectionViewName: string): void;

  // Session information

  /** Returns logging session context for Promoted integration points. */
  getLoggingSessionInfo(): Promise<LoggingSessionInfo>;
};