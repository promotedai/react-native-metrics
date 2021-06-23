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
