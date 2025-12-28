import { Controller, Get } from "@nestjs/common";

@Controller()
export class ReviewsController {
    private reviews = [
        { id: 1, rate: 5 },
        { id: 2, rate: 4 },
        { id: 3, rate: 2 }
    ]
    @Get("api/reviews")
    public getAllReviews() {

        return this.reviews
    }
}