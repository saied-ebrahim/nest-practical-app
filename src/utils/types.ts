export type JWTPayloadType = {
    id: number
    userType: string
}

export type AccessTokenType = {
    accessToken: string
}

export type ReviewType = {
    id: number;
    rating: number;
    comment: string;
    createdAt: Date;
    updatedAt: Date;
    userId: number;
    productId: number;
}